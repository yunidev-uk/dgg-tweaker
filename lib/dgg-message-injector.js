const DGG_TWEAKS_DGG_FRAME_EVENT = 'dgg-tweaks:inject-dgg-frame';

function installDggChatWebSocketBridgeHook() {
    if (window.__DGG_TWEAKS_DGG_SOCKET_HOOK_INJECTED__) return;
    window.__DGG_TWEAKS_DGG_SOCKET_HOOK_INJECTED__ = true;

    const script = document.createElement('script');
    script.textContent = `(() => {
        if (window.__DGG_TWEAKS_DGG_SOCKET_HOOK_INSTALLED__) return;

        const OriginalWebSocket = window.WebSocket;
        let dggSocket = null;

        function isDggChatSocket(url) {
            try {
                const parsed = new URL(String(url), window.location.href);
                return parsed.protocol.startsWith('ws') && (
                    parsed.pathname.includes('/chat') ||
                    parsed.hostname === 'destiny.gg' ||
                    parsed.hostname.endsWith('.destiny.gg')
                );
            } catch {
                return String(url).includes('/chat');
            }
        }

        function TweakedWebSocket(url, protocols) {
            const socket = arguments.length > 1
                ? new OriginalWebSocket(url, protocols)
                : new OriginalWebSocket(url);

            if (isDggChatSocket(url)) dggSocket = socket;
            return socket;
        }

        Object.setPrototypeOf(TweakedWebSocket, OriginalWebSocket);
        TweakedWebSocket.prototype = OriginalWebSocket.prototype;
        for (const key of Object.getOwnPropertyNames(OriginalWebSocket)) {
            if (key in TweakedWebSocket) continue;
            Object.defineProperty(TweakedWebSocket, key, Object.getOwnPropertyDescriptor(OriginalWebSocket, key));
        }

        window.WebSocket = TweakedWebSocket;
        window.__DGG_TWEAKS_DGG_SOCKET_HOOK_INSTALLED__ = true;

        document.addEventListener('${DGG_TWEAKS_DGG_FRAME_EVENT}', event => {
            if (!dggSocket) return;

            const messageEvent = new MessageEvent('message', { data: event.detail });
            if (typeof dggSocket.onmessage === 'function') {
                dggSocket.onmessage(messageEvent);
                return;
            }

            dggSocket.dispatchEvent(messageEvent);
        });
    })();`;

    (document.documentElement || document.head || document.body).appendChild(script);
    script.remove();
}

if (window.location.pathname === '/embed/chat') installDggChatWebSocketBridgeHook();
