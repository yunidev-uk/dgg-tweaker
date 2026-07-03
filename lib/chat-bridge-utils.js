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

    function requestText({ url, method = 'GET', body = null, headers = {}, timeout = undefined, signal = null }) {
        return new Promise((resolve, reject) => {
            let controller = null;
            let timeoutId = null;
            let settled = false;
            const settleResolve = value => {
                if (settled) return;
                settled = true;
                resolve(value);
            };
            const settleReject = error => {
                if (settled) return;
                settled = true;
                reject(error);
            };

            if (typeof GM_xmlhttpRequest !== 'function') {
                controller = new AbortController();
                const abort = () => controller.abort();
                signal?.addEventListener?.('abort', abort, { once: true });
                if (timeout) {
                    timeoutId = setTimeout(() => controller.abort(), timeout);
                }

                fetch(url, { method, body: serializeBody(body), headers, signal: controller.signal })
                    .then(response => {
                        if (!response.ok) throw new Error(`HTTP ${response.status}`);
                        return response.text();
                    })
                    .then(settleResolve, settleReject)
                    .finally(() => {
                        clearTimeout(timeoutId);
                        signal?.removeEventListener?.('abort', abort);
                    });
                return;
            }

            let partialText = '';
            const capturePartialText = response => {
                if (response.responseText && response.responseText.length > partialText.length) {
                    partialText = response.responseText;
                }
            };

            const request = GM_xmlhttpRequest({
                method,
                url,
                data: serializeBody(body),
                headers,
                timeout,
                onprogress: capturePartialText,
                onreadystatechange: response => {
                    if (response.readyState === 3) capturePartialText(response);
                },
                onload: response => {
                    capturePartialText(response);
                    if (response.status < 200 || response.status >= 300) {
                        settleReject(new Error(`HTTP ${response.status}`));
                        return;
                    }
                    settleResolve(partialText || response.responseText);
                },
                onerror: settleReject,
                ontimeout: response => {
                    capturePartialText(response || {});
                    if (partialText) {
                        settleResolve(partialText);
                        return;
                    }
                    settleReject(new Error('Request timed out'));
                }
            });

            const abort = () => {
                request.abort?.();
                if (partialText) settleResolve(partialText);
                else {
                    const error = new Error('Request aborted');
                    error.name = 'AbortError';
                    settleReject(error);
                }
            };
            signal?.addEventListener?.('abort', abort, { once: true });
        });
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
        sanitizeNick
    };
})();
