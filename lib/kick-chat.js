const KICK_CHAT_CONFIG = {
    fallbackChannelId: 1772249,
    channelSlug: 'destiny',
    featureClass: 'dgg-tweaks-kick',
    maxSeenMessages: 1000,
    pollIntervalMs: 2500
};

const kickChatState = {
    enabled: false,
    starting: false,
    pollTimer: null,
    seenIds: new Set(),
    seenQueue: [],
    channelId: null
};

function gmJsonRequest(url) {
    return new Promise((resolve, reject) => {
        if (typeof GM_xmlhttpRequest !== 'function') {
            fetch(url)
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    return response.json();
                })
                .then(resolve, reject);
            return;
        }

        GM_xmlhttpRequest({
            method: 'GET',
            url,
            responseType: 'json',
            onload: response => {
                if (response.status < 200 || response.status >= 300) {
                    reject(new Error(`HTTP ${response.status}`));
                    return;
                }

                if (response.response) {
                    resolve(response.response);
                    return;
                }

                try {
                    resolve(JSON.parse(response.responseText));
                } catch (error) {
                    reject(error);
                }
            },
            onerror: reject,
            ontimeout: () => reject(new Error('Request timed out'))
        });
    });
}

async function discoverKickChannelId() {
    try {
        const data = await gmJsonRequest(`https://kick.com/api/v2/channels/${KICK_CHAT_CONFIG.channelSlug}`);
        const channelId = Number(data?.id);
        if (Number.isFinite(channelId) && channelId > 0) return channelId;
    } catch (error) {
        console.warn('[DGG Tweaks] Kick channel discovery failed; using fallback id.', error);
    }

    return KICK_CHAT_CONFIG.fallbackChannelId;
}

async function ensureKickChannelId() {
    if (kickChatState.channelId) return kickChatState.channelId;

    kickChatState.channelId = await discoverKickChannelId();
    return kickChatState.channelId;
}

function kickMessageText(content) {
    return String(content ?? '');
}

function kickEmoteImageUrl(id) {
    return `https://files.kick.com/emotes/${encodeURIComponent(id)}/fullsize`;
}

function renderKickEmoteNode(id, name) {
    const emote = document.createElement('img');
    emote.className = 'emote dgg-tweaks-kick-emote';
    emote.src = kickEmoteImageUrl(id);
    emote.alt = name;
    emote.title = name;
    emote.loading = 'lazy';
    emote.decoding = 'async';
    emote.addEventListener('error', () => {
        emote.replaceWith(document.createTextNode(name));
    }, { once: true });
    return emote;
}

function renderKickEmotesInTextNode(textNode) {
    const tokenRegex = /\[emote:(\d+):([^\]]+)\]/g;
    const text = textNode.textContent;
    if (!tokenRegex.test(text)) return false;

    tokenRegex.lastIndex = 0;
    const fragment = document.createDocumentFragment();
    let lastIndex = 0;
    let match;

    while ((match = tokenRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
        }

        fragment.appendChild(renderKickEmoteNode(match[1], match[2]));
        lastIndex = tokenRegex.lastIndex;
    }

    if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
    }

    textNode.replaceWith(fragment);
    return true;
}

function renderKickEmotesInMessage(messageEl) {
    if (!messageEl?.matches?.('.msg-chat.dgg-tweaks-kick')) return;
    if (messageEl.dataset.dggTweaksKickEmotesRendered === 'true') return;

    const textEl = messageEl.querySelector(':scope > .text');
    if (!textEl) return;

    const walker = document.createTreeWalker(textEl, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    let changed = false;
    for (const textNode of textNodes) {
        changed = renderKickEmotesInTextNode(textNode) || changed;
    }

    if (changed) messageEl.dataset.dggTweaksKickEmotesRendered = 'true';
}

let kickEmoteObserver = null;
let kickEmoteRootObserver = null;

function renderKickEmotesInTree(root) {
    if (root.matches?.('.msg-chat.dgg-tweaks-kick')) renderKickEmotesInMessage(root);
    root.querySelectorAll?.('.msg-chat.dgg-tweaks-kick').forEach(renderKickEmotesInMessage);
}

function onKickEmoteMutations(mutations) {
    for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
            if (node.nodeType !== Node.ELEMENT_NODE) continue;
            renderKickEmotesInTree(node);
        }
    }
}

function observeKickEmoteLines(linesEl) {
    kickEmoteRootObserver?.disconnect();
    kickEmoteRootObserver = null;
    kickEmoteObserver?.disconnect();
    kickEmoteObserver = new MutationObserver(onKickEmoteMutations);
    kickEmoteObserver.observe(linesEl, { childList: true, subtree: true });
    renderKickEmotesInTree(linesEl);
}

function registerKickEmoteObserver(enabled) {
    kickEmoteObserver?.disconnect();
    kickEmoteRootObserver?.disconnect();
    kickEmoteObserver = null;
    kickEmoteRootObserver = null;

    if (!enabled) return;

    const linesEl = UTIL.getChatLinesElement();
    if (linesEl) {
        observeKickEmoteLines(linesEl);
        return;
    }

    kickEmoteRootObserver = new MutationObserver(() => {
        const lines = UTIL.getChatLinesElement();
        if (lines) observeKickEmoteLines(lines);
    });
    kickEmoteRootObserver.observe(document.body, { childList: true, subtree: true });
}

function syntheticKickNick(sender) {
    const rawName = sender?.username || sender?.slug || `user_${sender?.id || 'unknown'}`;
    const sanitized = String(rawName).replace(/[^a-zA-Z0-9_]/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '');
    return (sanitized || 'user').slice(0, 32);
}

function hasSeenKickMessage(id) {
    if (!id) return false;
    if (kickChatState.seenIds.has(id)) return true;

    kickChatState.seenIds.add(id);
    kickChatState.seenQueue.push(id);

    while (kickChatState.seenQueue.length > KICK_CHAT_CONFIG.maxSeenMessages) {
        const removed = kickChatState.seenQueue.shift();
        kickChatState.seenIds.delete(removed);
    }

    return false;
}

function injectSyntheticDggMessage(kickMessage) {
    const text = kickMessageText(kickMessage?.content);
    if (!text.trim()) return;

    const sender = kickMessage.sender || {};
    const nick = syntheticKickNick(sender);
    const payload = {
        id: `kick:${sender.id || sender.slug || nick}`,
        nick,
        features: [KICK_CHAT_CONFIG.featureClass],
        roles: [],
        createdDate: '',
        data: text,
        timestamp: kickMessage.created_at || new Date().toISOString()
    };

    document.dispatchEvent(new CustomEvent(DGG_TWEAKS_DGG_FRAME_EVENT, {
        detail: `MSG ${JSON.stringify(payload)}`
    }));
}

function extractKickHistoryMessages(data) {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.messages)) return data.messages;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.data?.messages)) return data.data.messages;
    return [];
}

function sortKickMessages(messages) {
    return [...messages].sort((a, b) => {
        const aTime = new Date(a.created_at || 0).getTime();
        const bTime = new Date(b.created_at || 0).getTime();
        return aTime - bTime;
    });
}

async function pollKickChatHistory({ primeOnly = false } = {}) {
    if (!kickChatState.enabled || !kickChatState.channelId) return;

    try {
        const data = await gmJsonRequest(`https://web.kick.com/api/v1/chat/${kickChatState.channelId}/history`);
        const messages = sortKickMessages(extractKickHistoryMessages(data));

        for (const message of messages) {
            if (message?.type !== 'message') continue;
            if (hasSeenKickMessage(message.id)) continue;
            if (!primeOnly) injectSyntheticDggMessage(message);
        }
    } catch (error) {
        console.warn('[DGG Tweaks] Kick history poll failed.', error);
    }
}

function scheduleKickChatPoll() {
    if (!kickChatState.enabled || kickChatState.pollTimer) return;

    const tick = async () => {
        kickChatState.pollTimer = null;
        if (!kickChatState.enabled) return;

        await pollKickChatHistory();
        if (kickChatState.enabled) scheduleKickChatPoll();
    };

    kickChatState.pollTimer = setTimeout(tick, KICK_CHAT_CONFIG.pollIntervalMs);
}

async function startKickChat() {
    if (kickChatState.enabled || kickChatState.starting) return;

    kickChatState.enabled = true;
    kickChatState.starting = true;

    try {
        kickChatState.channelId = await ensureKickChannelId();
        if (!kickChatState.enabled) return;

        await pollKickChatHistory({ primeOnly: true });
        scheduleKickChatPoll();
    } catch (error) {
        console.warn('[DGG Tweaks] Kick chat polling startup failed.', error);
    } finally {
        kickChatState.starting = false;
    }
}

function stopKickChat() {
    kickChatState.enabled = false;
    kickChatState.starting = false;
    clearTimeout(kickChatState.pollTimer);
    kickChatState.pollTimer = null;
}

function syncKickChat(enabled) {
    if (!enabled) {
        stopKickChat();
        return;
    }

    startKickChat();
}
