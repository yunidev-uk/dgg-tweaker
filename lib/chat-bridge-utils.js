const CHAT_BRIDGE_UTILS = (() => {
    function requestJson({ url, method = 'GET', body = null, headers = {} }) {
        return new Promise((resolve, reject) => {
            if (typeof GM_xmlhttpRequest !== 'function') {
                fetch(url, {
                    method,
                    body: serializeBody(body),
                    headers: {
                        ...(body === null ? {} : { 'Content-Type': 'application/json' }),
                        ...headers
                    }
                })
                    .then(response => {
                        if (!response.ok) throw new Error(`HTTP ${response.status}`);
                        return response.json();
                    })
                    .then(resolve, reject);
                return;
            }

            GM_xmlhttpRequest({
                method,
                url,
                data: serializeBody(body),
                responseType: 'json',
                headers: {
                    ...(body === null ? {} : { 'Content-Type': 'application/json' }),
                    ...headers
                },
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

    function serializeBody(body) {
        if (body === null || body === undefined || typeof body === 'string') return body;
        return JSON.stringify(body);
    }

    function requestText({ url, method = 'GET', body = null, headers = {} }) {
        return new Promise((resolve, reject) => {
            if (typeof GM_xmlhttpRequest !== 'function') {
                fetch(url, { method, body: serializeBody(body), headers })
                    .then(response => {
                        if (!response.ok) throw new Error(`HTTP ${response.status}`);
                        return response.text();
                    })
                    .then(resolve, reject);
                return;
            }

            GM_xmlhttpRequest({
                method,
                url,
                data: serializeBody(body),
                headers,
                onload: response => {
                    if (response.status < 200 || response.status >= 300) {
                        reject(new Error(`HTTP ${response.status}`));
                        return;
                    }
                    resolve(response.responseText);
                },
                onerror: reject,
                ontimeout: () => reject(new Error('Request timed out'))
            });
        });
    }

    function streamText({ url, headers = {}, onChunk, onDone, onError }) {
        if (typeof GM_xmlhttpRequest !== 'function') {
            const controller = new AbortController();
            fetch(url, { headers, signal: controller.signal })
                .then(async response => {
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    const reader = response.body.getReader();
                    const decoder = new TextDecoder();
                    while (true) {
                        const { value, done } = await reader.read();
                        if (done) break;
                        onChunk(decoder.decode(value, { stream: true }));
                    }
                    onDone?.();
                })
                .catch(error => {
                    if (error.name !== 'AbortError') onError?.(error);
                });
            return () => controller.abort();
        }

        let seenLength = 0;
        const request = GM_xmlhttpRequest({
            method: 'GET',
            url,
            headers,
            onprogress: response => {
                const text = response.responseText || '';
                if (text.length <= seenLength) return;
                onChunk(text.slice(seenLength));
                seenLength = text.length;
            },
            onload: response => {
                const text = response.responseText || '';
                if (text.length > seenLength) onChunk(text.slice(seenLength));
                onDone?.();
            },
            onerror: error => onError?.(error),
            ontimeout: () => onError?.(new Error('Request timed out'))
        });

        return () => request.abort?.();
    }

    function createSeenTracker(maxSize) {
        const ids = new Set();
        const queue = [];

        return {
            hasSeen(id) {
                if (!id) return false;
                if (ids.has(id)) return true;

                ids.add(id);
                queue.push(id);

                while (queue.length > maxSize) {
                    const removed = queue.shift();
                    ids.delete(removed);
                }

                return false;
            },
            clear() {
                ids.clear();
                queue.length = 0;
            }
        };
    }

    function sanitizeNick(rawName) {
        const sanitized = String(rawName || 'user').replace(/[^a-zA-Z0-9_]/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '');
        return (sanitized || 'user').slice(0, 32);
    }

    function injectDggMessage({ id, nick, featureClass, data, timestamp }) {
        if (!String(data ?? '').trim()) return;

        const payload = {
            id,
            nick,
            features: [featureClass],
            roles: [],
            createdDate: '',
            data,
            timestamp: timestamp || new Date().toISOString()
        };

        document.dispatchEvent(new CustomEvent(DGG_TWEAKS_DGG_FRAME_EVENT, {
            detail: `MSG ${JSON.stringify(payload)}`
        }));
    }

    function replaceTextTokens(textNode, tokenRegex, renderMatch) {
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

            fragment.appendChild(renderMatch(match));
            lastIndex = tokenRegex.lastIndex;
        }

        if (lastIndex < text.length) {
            fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
        }

        textNode.replaceWith(fragment);
        return true;
    }

    return {
        createSeenTracker,
        injectDggMessage,
        replaceTextTokens,
        requestJson,
        requestText,
        streamText,
        sanitizeNick
    };
})();
