const YOUTUBE_CHAT_CONFIG = {
    liveUrl: 'https://www.youtube.com/@Destiny/live',
    featureClass: 'dgg-tweaks-youtube',
    maxSeenMessages: 1000,
    fallbackPollIntervalMs: 3000,
    liveRetryIntervalMs: 60000,
    signalerReconnectDelayMs: 1000,
    invalidationTimeoutMs: 10000
};

const youtubeChatState = {
    enabled: false,
    starting: false,
    fetching: false,
    pollTimer: null,
    liveRetryTimer: null,
    seen: CHAT_BRIDGE_UTILS.createSeenTracker(YOUTUBE_CHAT_CONFIG.maxSeenMessages),
    apiKey: null,
    signalerApiKey: null,
    context: null,
    continuation: null,
    videoId: null,
    continuationMode: null,
    gsessionId: null,
    sid: null,
    session: null,
    signalerUnavailable: false,
    signalerAbort: null,
    signalerBuffer: '',
    lastSignalerActivity: 0,
    invalidationTimeoutTimer: null,
    consecutivePollFailures: 0,
    emotes: new Map()
};

const YOUTUBE_SIGNALER_PATTERNS = {
    firstChat: /\[\[\d+,\[\[null,null,\["([^"]+)"\]\]\]\]/,
    noChat: /\[\[\d*,\[\[\[\[.*\[null,null,\["\d*/,
    chatTimestamp: /\d{16,}/,
    session: /\w{8,}/
};

function extractBalancedJson(text, startIndex) {
    const opener = text[startIndex];
    const closer = opener === '{' ? '}' : ']';
    let depth = 0;
    let inString = false;
    let escaped = false;

    for (let i = startIndex; i < text.length; i += 1) {
        const char = text[i];

        if (inString) {
            if (escaped) escaped = false;
            else if (char === '\\') escaped = true;
            else if (char === '"') inString = false;
            continue;
        }

        if (char === '"') {
            inString = true;
            continue;
        }

        if (char === opener) depth += 1;
        else if (char === closer) {
            depth -= 1;
            if (depth === 0) return text.slice(startIndex, i + 1);
        }
    }

    return null;
}

function extractJsonAfter(text, marker, fromIndex = 0) {
    const markerIndex = text.indexOf(marker, fromIndex);
    if (markerIndex === -1) return null;

    const objectStart = text.slice(markerIndex + marker.length).search(/[\[{]/);
    if (objectStart === -1) return null;

    const startIndex = markerIndex + marker.length + objectStart;
    const json = extractBalancedJson(text, startIndex);
    return json ? JSON.parse(json) : null;
}

function extractYtcfg(text) {
    let index = 0;

    while ((index = text.indexOf('ytcfg.set(', index)) !== -1) {
        try {
            const config = extractJsonAfter(text, 'ytcfg.set(', index);
            if (config?.INNERTUBE_API_KEY && config?.INNERTUBE_CONTEXT) return config;
        } catch { }
        index += 'ytcfg.set('.length;
    }

    return null;
}

function findNestedContinuation(value) {
    if (!value || typeof value !== 'object') return null;

    if (Array.isArray(value)) {
        for (const item of value) {
            const continuation = findNestedContinuation(item);
            if (continuation) return continuation;
        }
        return null;
    }

    for (const key of ['reloadContinuationData', 'timedContinuationData', 'invalidationContinuationData']) {
        const continuation = value[key]?.continuation;
        if (continuation) return continuation;
    }

    for (const child of Object.values(value)) {
        const continuation = findNestedContinuation(child);
        if (continuation) return continuation;
    }

    return null;
}

function findNestedVideoId(value) {
    if (!value || typeof value !== 'object') return null;

    if (Array.isArray(value)) {
        for (const item of value) {
            const videoId = findNestedVideoId(item);
            if (videoId) return videoId;
        }
        return null;
    }

    const videoId = value.watchEndpoint?.videoId || value.currentVideoEndpoint?.watchEndpoint?.videoId;
    if (videoId) return videoId;

    for (const child of Object.values(value)) {
        const foundVideoId = findNestedVideoId(child);
        if (foundVideoId) return foundVideoId;
    }

    return null;
}

function getNextContinuation(liveChatContinuation) {
    return findNestedContinuation(liveChatContinuation?.continuations);
}

function getContinuationData(liveChatContinuation) {
    const continuations = liveChatContinuation?.continuations || [];
    for (const continuation of continuations) {
        if (continuation.timedContinuationData) {
            return { mode: 'timed', data: continuation.timedContinuationData };
        }
        if (continuation.invalidationContinuationData) {
            return { mode: 'invalidation', data: continuation.invalidationContinuationData };
        }
        if (continuation.reloadContinuationData) {
            return { mode: 'timed', data: continuation.reloadContinuationData };
        }
    }
    return null;
}

function getNextPollInterval(liveChatContinuation) {
    const continuation = getContinuationData(liveChatContinuation);
    const timeoutMs = Number(continuation?.data?.timeoutMs);
    if (Number.isFinite(timeoutMs) && timeoutMs > 0) return timeoutMs;
    return YOUTUBE_CHAT_CONFIG.fallbackPollIntervalMs;
}

async function discoverYoutubeLiveChat() {
    const html = await CHAT_BRIDGE_UTILS.requestText({ url: YOUTUBE_CHAT_CONFIG.liveUrl });
    const ytcfg = extractYtcfg(html) || {};
    const initialData = extractJsonAfter(html, 'var ytInitialData = ') || extractJsonAfter(html, 'ytInitialData = ');
    const continuation = findNestedContinuation(initialData);
    const videoId = findNestedVideoId(initialData);
    const apiKey = ytcfg.INNERTUBE_API_KEY;
    const signalerApiKey = ytcfg.LIVE_CHAT_BASE_TANGO_CONFIG?.apiKey;
    const context = ytcfg.INNERTUBE_CONTEXT;

    if (!apiKey || !context || !continuation) {
        throw new Error('YouTube live chat metadata not found.');
    }

    return { apiKey, signalerApiKey, context, continuation, videoId };
}

function youtubeRequestBody({ timestamp = '', isTimeout = false, isFirst = true } = {}) {
    const body = {
        context: youtubeChatState.context,
        continuation: youtubeChatState.continuation,
        webClientInfo: { IsDocumentHidden: false }
    };

    if (isTimeout) body.isInvalidationTimeoutRequest = true;
    else if (!isFirst && timestamp) body.invalidationPayloadLastPublishAtUsec = timestamp;

    return body;
}

function youtubeLiveChatUrl() {
    return `https://www.youtube.com/youtubei/v1/live_chat/get_live_chat?prettyPrint=false&key=${encodeURIComponent(youtubeChatState.apiKey)}`;
}

function youtubeSignalerHeaders(contentType) {
    return {
        'Content-Type': contentType,
        'X-WebChannel-Content-Type': 'application/json+protobuf',
        'Referer': 'https://www.youtube.com/',
        'Origin': 'https://www.youtube.com'
    };
}

function randomZx() {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

async function chooseYoutubeSignalerServer() {
    if (!youtubeChatState.signalerApiKey || !youtubeChatState.videoId) {
        throw new Error('YouTube signaler metadata not available.');
    }

    const body = `[[null,null,null,[9,5],null,[["youtube_live_chat_web"],[1],[[["chat~${youtubeChatState.videoId}"]]]]],null,null,0]`;
    const response = await CHAT_BRIDGE_UTILS.requestJson({
        method: 'POST',
        url: `https://signaler-pa.youtube.com/punctual/v1/chooseServer?key=${encodeURIComponent(youtubeChatState.signalerApiKey)}`,
        body,
        headers: youtubeSignalerHeaders('application/json+protobuf')
    });

    const gsessionId = Array.isArray(response) ? response[0] : null;
    if (!gsessionId || typeof gsessionId !== 'string') throw new Error('YouTube signaler gsessionid not found.');
    youtubeChatState.gsessionId = gsessionId;
}

function extractSidFromResponse(text) {
    const start = text.indexOf('[[');
    if (start === -1) return null;

    let parsed;
    try {
        parsed = JSON.parse(text.slice(start));
    } catch {
        return null;
    }

    for (const item of parsed) {
        const sid = item?.[1]?.[1];
        if (typeof sid === 'string') return sid;
    }
    return null;
}

async function getYoutubeSignalerSid() {
    const body = `count=1&ofs=0&req0___data__=${encodeURIComponent(`[[["1",[null,null,null,[9,5],null,[["youtube_live_chat_web"],[1],[[["chat~${youtubeChatState.videoId}"]]]],null,null,1],null,3]]]`)}`;
    const text = await CHAT_BRIDGE_UTILS.requestText({
        method: 'POST',
        url: `https://signaler-pa.youtube.com/punctual/multi-watch/channel?VER=8&gsessionid=${encodeURIComponent(youtubeChatState.gsessionId)}&key=${encodeURIComponent(youtubeChatState.signalerApiKey)}&RID=6167&CVER=22&zx=${randomZx()}&t=1`,
        body,
        headers: youtubeSignalerHeaders('application/x-www-form-urlencoded')
    });

    const sid = extractSidFromResponse(text);
    if (!sid) throw new Error('YouTube signaler SID not found.');
    youtubeChatState.sid = sid;
}

async function setupYoutubeSignaler() {
    await chooseYoutubeSignalerServer();
    await getYoutubeSignalerSid();
}

function stopYoutubeSignaler() {
    youtubeChatState.signalerAbort?.();
    youtubeChatState.signalerAbort = null;
    youtubeChatState.signalerBuffer = '';
    clearTimeout(youtubeChatState.invalidationTimeoutTimer);
    youtubeChatState.invalidationTimeoutTimer = null;
}

function scheduleInvalidationTimeoutFetch() {
    clearTimeout(youtubeChatState.invalidationTimeoutTimer);
    if (!youtubeChatState.enabled || youtubeChatState.continuationMode !== 'invalidation') return;

    youtubeChatState.invalidationTimeoutTimer = setTimeout(() => {
        fetchYoutubeChat({ isTimeout: true });
    }, YOUTUBE_CHAT_CONFIG.invalidationTimeoutMs);
}

function extractYoutubeSession(line) {
    const match = line.match(YOUTUBE_SIGNALER_PATTERNS.session);
    if (match) youtubeChatState.session = match[0];
}

function handleYoutubeSignalerLine(line) {
    const trimmed = line.trim();
    if (trimmed.length < 10) return;

    youtubeChatState.lastSignalerActivity = Date.now();

    if (YOUTUBE_SIGNALER_PATTERNS.firstChat.test(trimmed)) {
        extractYoutubeSession(trimmed);
        fetchYoutubeChat({ isFirst: true });
        return;
    }

    if (YOUTUBE_SIGNALER_PATTERNS.noChat.test(trimmed)) return;

    const timestamp = trimmed.match(YOUTUBE_SIGNALER_PATTERNS.chatTimestamp)?.[0];
    if (timestamp) {
        fetchYoutubeChat({ timestamp, isFirst: false });
        return;
    }
}

function consumeYoutubeSignalerChunk(chunk) {
    youtubeChatState.signalerBuffer += chunk;
    const lines = youtubeChatState.signalerBuffer.split('\n');
    youtubeChatState.signalerBuffer = lines.pop() || '';
    for (const line of lines) handleYoutubeSignalerLine(line);
}

function startYoutubeSignalerStream() {
    if (!youtubeChatState.enabled || youtubeChatState.signalerAbort || !youtubeChatState.gsessionId || !youtubeChatState.sid) return;

    const url = `https://signaler-pa.youtube.com/punctual/multi-watch/channel?VER=8&gsessionid=${encodeURIComponent(youtubeChatState.gsessionId)}&key=${encodeURIComponent(youtubeChatState.signalerApiKey)}&RID=rpc&SID=${encodeURIComponent(youtubeChatState.sid)}&AID=0&CI=0&TYPE=xmlhttp&zx=${randomZx()}&t=1`;
    youtubeChatState.signalerAbort = CHAT_BRIDGE_UTILS.streamText({
        url,
        headers: youtubeSignalerHeaders('application/json+protobuf'),
        onChunk: consumeYoutubeSignalerChunk,
        onDone: () => {
            youtubeChatState.signalerAbort = null;
            if (youtubeChatState.enabled && youtubeChatState.continuationMode === 'invalidation') {
                setTimeout(startYoutubeInvalidationMode, YOUTUBE_CHAT_CONFIG.signalerReconnectDelayMs);
            }
        },
        onError: error => {
            console.warn('[DGG Tweaks] YouTube signaler stream failed.', error);
            youtubeChatState.signalerAbort = null;
            if (youtubeChatState.enabled && youtubeChatState.continuationMode === 'invalidation') {
                setTimeout(startYoutubeInvalidationMode, YOUTUBE_CHAT_CONFIG.signalerReconnectDelayMs);
            }
        }
    });

    scheduleInvalidationTimeoutFetch();
}

async function startYoutubeInvalidationMode() {
    if (!youtubeChatState.enabled || youtubeChatState.continuationMode !== 'invalidation') return;
    if (youtubeChatState.signalerUnavailable || !youtubeChatState.signalerApiKey || !youtubeChatState.videoId) {
        scheduleYoutubeChatPoll(YOUTUBE_CHAT_CONFIG.fallbackPollIntervalMs);
        return;
    }

    try {
        stopYoutubeSignaler();
        await setupYoutubeSignaler();
        startYoutubeSignalerStream();
    } catch (error) {
        console.warn('[DGG Tweaks] YouTube signaler setup failed; falling back to timed polling.', error);
        youtubeChatState.signalerUnavailable = true;
        scheduleYoutubeChatPoll(YOUTUBE_CHAT_CONFIG.fallbackPollIntervalMs);
    }
}

function bestThumbnailUrl(thumbnails) {
    if (!Array.isArray(thumbnails) || thumbnails.length === 0) return null;
    return thumbnails[thumbnails.length - 1]?.url || thumbnails[0]?.url || null;
}

function hashString(value) {
    let hash = 0;
    for (let i = 0; i < value.length; i += 1) {
        hash = ((hash << 5) - hash) + value.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash).toString(36);
}

function youtubeEmoteToken(emoji) {
    const name = emoji.shortcuts?.[0] || emoji.emojiId || 'youtube-emote';
    const url = bestThumbnailUrl(emoji.image?.thumbnails);
    if (!url) return name;

    const key = hashString(`${emoji.emojiId || name}:${url}`);
    youtubeChatState.emotes.set(key, { name, url });
    return `[yt-emote:${key}:${name.replace(/\]/g, '')}]`;
}

function youtubeMessageText(message) {
    const runs = message?.runs || [];
    return runs.map(run => {
        if (typeof run.text === 'string') return run.text;
        if (run.emoji) return youtubeEmoteToken(run.emoji);
        return '';
    }).join('');
}

function youtubeTimestamp(renderer) {
    const timestampUsec = Number(renderer.timestampUsec);
    if (Number.isFinite(timestampUsec) && timestampUsec > 0) {
        return new Date(Math.floor(timestampUsec / 1000)).toISOString();
    }
    return new Date().toISOString();
}

function extractYoutubeChatMessage(action) {
    const item = action?.addChatItemAction?.item;
    const renderer = item?.liveChatTextMessageRenderer || item?.liveChatPaidMessageRenderer;
    if (!renderer) return null;

    const text = youtubeMessageText(renderer.message);
    if (!text.trim()) return null;

    const authorName = renderer.authorName?.simpleText || 'youtube_user';
    const authorId = renderer.authorExternalChannelId || authorName;
    return {
        id: renderer.id || `${authorId}:${renderer.timestampUsec}:${text}`,
        authorId,
        authorName,
        text,
        timestamp: youtubeTimestamp(renderer)
    };
}

function injectYoutubeMessage(message) {
    const nick = CHAT_BRIDGE_UTILS.sanitizeNick(message.authorName);
    CHAT_BRIDGE_UTILS.injectDggMessage({
        id: `youtube:${message.authorId || nick}:${message.id}`,
        nick,
        featureClass: YOUTUBE_CHAT_CONFIG.featureClass,
        data: message.text,
        timestamp: message.timestamp
    });
}

function renderYoutubeEmoteNode(key, fallbackName) {
    const meta = youtubeChatState.emotes.get(key);
    if (!meta?.url) return document.createTextNode(fallbackName);

    const emote = document.createElement('img');
    emote.className = 'emote dgg-tweaks-youtube-emote';
    emote.src = meta.url;
    emote.alt = meta.name;
    emote.title = meta.name;
    emote.loading = 'lazy';
    emote.decoding = 'async';
    emote.addEventListener('error', () => {
        emote.replaceWith(document.createTextNode(meta.name));
    }, { once: true });
    return emote;
}

function renderYoutubeEmotesInTextNode(textNode) {
    const tokenRegex = /\[yt-emote:([^:\]]+):([^\]]+)\]/g;
    return CHAT_BRIDGE_UTILS.replaceTextTokens(textNode, tokenRegex, match => renderYoutubeEmoteNode(match[1], match[2]));
}

function renderYoutubeEmotesInMessage(messageEl) {
    if (!messageEl?.matches?.('.msg-chat.dgg-tweaks-youtube')) return;
    if (messageEl.dataset.dggTweaksYoutubeEmotesRendered === 'true') return;

    const textEl = messageEl.querySelector(':scope > .text');
    if (!textEl) return;

    const walker = document.createTreeWalker(textEl, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    let changed = false;
    for (const textNode of textNodes) {
        changed = renderYoutubeEmotesInTextNode(textNode) || changed;
    }

    if (changed) messageEl.dataset.dggTweaksYoutubeEmotesRendered = 'true';
}

let youtubeEmoteObserver = null;
let youtubeEmoteRootObserver = null;

function renderYoutubeEmotesInTree(root) {
    if (root.matches?.('.msg-chat.dgg-tweaks-youtube')) renderYoutubeEmotesInMessage(root);
    root.querySelectorAll?.('.msg-chat.dgg-tweaks-youtube').forEach(renderYoutubeEmotesInMessage);
}

function onYoutubeEmoteMutations(mutations) {
    for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
            if (node.nodeType !== Node.ELEMENT_NODE) continue;
            renderYoutubeEmotesInTree(node);
        }
    }
}

function observeYoutubeEmoteLines(linesEl) {
    youtubeEmoteRootObserver?.disconnect();
    youtubeEmoteRootObserver = null;
    youtubeEmoteObserver?.disconnect();
    youtubeEmoteObserver = new MutationObserver(onYoutubeEmoteMutations);
    youtubeEmoteObserver.observe(linesEl, { childList: true, subtree: true });
    renderYoutubeEmotesInTree(linesEl);
}

function registerYoutubeEmoteObserver(enabled) {
    youtubeEmoteObserver?.disconnect();
    youtubeEmoteRootObserver?.disconnect();
    youtubeEmoteObserver = null;
    youtubeEmoteRootObserver = null;

    if (!enabled) return;

    const linesEl = UTIL.getChatLinesElement();
    if (linesEl) {
        observeYoutubeEmoteLines(linesEl);
        return;
    }

    youtubeEmoteRootObserver = new MutationObserver(() => {
        const lines = UTIL.getChatLinesElement();
        if (lines) observeYoutubeEmoteLines(lines);
    });
    youtubeEmoteRootObserver.observe(document.body, { childList: true, subtree: true });
}

function updateYoutubeContinuation(liveChat) {
    const continuationData = getContinuationData(liveChat);
    const nextContinuation = continuationData?.data?.continuation || getNextContinuation(liveChat);
    if (nextContinuation) youtubeChatState.continuation = nextContinuation;
    youtubeChatState.continuationMode = continuationData?.mode || 'timed';
    return continuationData;
}

async function fetchYoutubeChat({ primeOnly = false, timestamp = '', isTimeout = false, isFirst = true } = {}) {
    if (!youtubeChatState.enabled || !youtubeChatState.continuation) return;
    if (youtubeChatState.fetching) return;

    youtubeChatState.fetching = true;

    try {
        const data = await CHAT_BRIDGE_UTILS.requestJson({
            method: 'POST',
            url: youtubeLiveChatUrl(),
            body: youtubeRequestBody({ timestamp, isTimeout, isFirst })
        });

        const liveChat = data?.continuationContents?.liveChatContinuation;
        const continuationData = updateYoutubeContinuation(liveChat);
        youtubeChatState.consecutivePollFailures = 0;

        for (const action of liveChat?.actions || []) {
            const message = extractYoutubeChatMessage(action);
            if (!message) continue;
            if (youtubeChatState.seen.hasSeen(message.id)) continue;
            if (!primeOnly) injectYoutubeMessage(message);
        }

        if (youtubeChatState.continuationMode === 'invalidation') {
            clearTimeout(youtubeChatState.pollTimer);
            youtubeChatState.pollTimer = null;
            if (!youtubeChatState.signalerAbort) startYoutubeInvalidationMode();
            scheduleInvalidationTimeoutFetch();
        } else {
            stopYoutubeSignaler();
            scheduleYoutubeChatPoll(Number(continuationData?.data?.timeoutMs) || getNextPollInterval(liveChat));
        }
    } catch (error) {
        console.warn('[DGG Tweaks] YouTube chat poll failed.', error);
        youtubeChatState.consecutivePollFailures += 1;
        if (youtubeChatState.consecutivePollFailures >= 3) {
            resetYoutubeLiveChatSession();
            scheduleYoutubeLiveRetry();
        } else {
            scheduleYoutubeChatPoll(YOUTUBE_CHAT_CONFIG.fallbackPollIntervalMs);
        }
    } finally {
        youtubeChatState.fetching = false;
    }
}

function scheduleYoutubeChatPoll(delay = YOUTUBE_CHAT_CONFIG.fallbackPollIntervalMs) {
    if (!youtubeChatState.enabled || youtubeChatState.pollTimer) return;

    youtubeChatState.pollTimer = setTimeout(async () => {
        youtubeChatState.pollTimer = null;
        if (!youtubeChatState.enabled) return;
        await fetchYoutubeChat();
    }, delay);
}

function scheduleYoutubeLiveRetry(delay = YOUTUBE_CHAT_CONFIG.liveRetryIntervalMs) {
    if (!youtubeChatState.enabled || youtubeChatState.liveRetryTimer) return;

    youtubeChatState.liveRetryTimer = setTimeout(() => {
        youtubeChatState.liveRetryTimer = null;
        if (!youtubeChatState.enabled) return;
        startYoutubeChat({ retry: true });
    }, delay);
}

function clearYoutubeLiveRetry() {
    clearTimeout(youtubeChatState.liveRetryTimer);
    youtubeChatState.liveRetryTimer = null;
}

function resetYoutubeLiveChatSession() {
    clearTimeout(youtubeChatState.pollTimer);
    youtubeChatState.pollTimer = null;
    stopYoutubeSignaler();
    youtubeChatState.fetching = false;
    youtubeChatState.apiKey = null;
    youtubeChatState.signalerApiKey = null;
    youtubeChatState.context = null;
    youtubeChatState.continuation = null;
    youtubeChatState.videoId = null;
    youtubeChatState.continuationMode = null;
    youtubeChatState.gsessionId = null;
    youtubeChatState.sid = null;
    youtubeChatState.session = null;
    youtubeChatState.signalerUnavailable = false;
    youtubeChatState.consecutivePollFailures = 0;
}

async function startYoutubeChat() {
    if (youtubeChatState.starting) return;
    if (youtubeChatState.enabled && youtubeChatState.continuation) return;

    youtubeChatState.enabled = true;
    youtubeChatState.starting = true;
    clearYoutubeLiveRetry();

    try {
        const liveChat = await discoverYoutubeLiveChat();
        if (!youtubeChatState.enabled) return;

        youtubeChatState.apiKey = liveChat.apiKey;
        youtubeChatState.signalerApiKey = liveChat.signalerApiKey;
        youtubeChatState.context = liveChat.context;
        youtubeChatState.continuation = liveChat.continuation;
        youtubeChatState.videoId = liveChat.videoId;
        youtubeChatState.signalerUnavailable = false;

        await fetchYoutubeChat({ primeOnly: true, isFirst: true });
    } catch (error) {
        resetYoutubeLiveChatSession();
        if (youtubeChatState.enabled) {
            console.info('[DGG Tweaks] YouTube chat is not available; retrying later.', error);
            scheduleYoutubeLiveRetry();
        }
    } finally {
        youtubeChatState.starting = false;
    }
}

function stopYoutubeChat() {
    youtubeChatState.enabled = false;
    youtubeChatState.starting = false;
    youtubeChatState.fetching = false;
    clearYoutubeLiveRetry();
    resetYoutubeLiveChatSession();
}

function syncYoutubeChat(enabled) {
    if (!enabled) {
        stopYoutubeChat();
        return;
    }

    startYoutubeChat();
}
