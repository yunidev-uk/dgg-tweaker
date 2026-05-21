// SETTINGS

const STORAGE = {
    async get(key) {
        if (typeof GM_getValue === 'function') return GM_getValue(key);
        const raw = localStorage.getItem(`dgg-tweaks:${key}`);
        return raw === null ? undefined : JSON.parse(raw);
    },
    async set(key, value) {
        if (typeof GM_setValue === 'function') {
            GM_setValue(key, value);
            return;
        }
        localStorage.setItem(`dgg-tweaks:${key}`, JSON.stringify(value));
    }
};

const INPUT_TYPES = {
    CHECKBOX: Symbol('checkbox'),
    NUMBER_FIELD: Symbol('number_field'),
    SELECT: Symbol('select')
}
const settingsMenuDef = [
    {
        heading: "Chat",
        fields: [
            [INPUT_TYPES.CHECKBOX, 'resize-user-info', "Resizable User Info", "Allow for resizing the user right click info menu"],
            [INPUT_TYPES.CHECKBOX, 'mentions-button', "Mentions Button", "Adds a button to the bottom of chat to view recent mentions"],
            [INPUT_TYPES.CHECKBOX, 'mentions-force-timestamps', "Force Mentions Timestamps", "Always show timestamps for mentions"],
            [INPUT_TYPES.CHECKBOX, 'rustlesearch-button', "Rustlesearch Button", "Adds a button to the bottom of chat to open your own logs"],
            [INPUT_TYPES.NUMBER_FIELD, 'link-size', "Link Size", 'Increase the clickable area for links (no visual change)', "1.00", 1.00],
            [INPUT_TYPES.CHECKBOX, 'link-size-debug', "Visualise Link Size", "Show an outline around the clickable area (debug option)"],
            [INPUT_TYPES.SELECT, 'aggregate-links-button', "'Aggregate Links' Button", "Mode for a new 'Aggregate Links' button in chat", [['off', 'Disabled'], ['link', 'Links Only'], ['name', 'Include Usernames'], ['full', 'Full Messages']]],
        ]
    },
    {
        heading: "Big Screen (requires refresh)",
        fields: [
            [INPUT_TYPES.CHECKBOX, 'bigscreen-menubar', "Cinema Mode Menu Bar", "Slide out the menu bar on hover while in Cinema Mode"],
            [INPUT_TYPES.CHECKBOX, 'bigscreen-controls', "Cinema Mode Controls", "Slide out the bottom stream controls on hover while in Cinema Mode"],
            [INPUT_TYPES.CHECKBOX, 'dgg-layout-fix', "DGG Layout Fix Script", "DGG Layout Fix script from chatter_here. Overrides the options above"],
        ]
    },
];

let settings = {
    'bigscreen-menubar': true,
    'bigscreen-controls': false,
    'link-size': 1.00,
    'link-size-debug': false,
    'aggregate-links-button': 'off',
    'resize-user-info': true,
    'dgg-layout-fix': false,
    'mentions-button': true,
    'mentions-force-timestamps': false,
    'rustlesearch-button': true
};

function changeSetting(key, value) {
    settings[key] = value;
    STORAGE.set('settings', settings);
    onSettingsChanged();
}

async function loadSettings() {
    const loaded = await STORAGE.get('settings');
    settings = Object.assign(settings, loaded);
}

// PAGE TYPES

const PAGE_TYPES = {
    BIGSCREEN: Symbol('bigscreen'),
    CHAT: Symbol('chat'),
    DEFAULT: Symbol('default')
};
const PAGE_TYPE = getPageType();

function getPageType() {
    var path = window.location.pathname;

    if (path === '/bigscreen') return PAGE_TYPES.BIGSCREEN;
    if (path === '/embed/chat') return PAGE_TYPES.CHAT;

    return PAGE_TYPES.DEFAULT;
}

// UI ELEMENTS
const CHAT_UI = {
    [INPUT_TYPES.CHECKBOX]: (key, label, description) => el('div', { classes: ['form-group', 'checkbox', 'dgg-tweaks-setting'], id: 'dgg-tweaks-' + key },
        el('label', { title: description, for: 'dgg-tweaks-' + key },
            el('input', {
                name: 'dgg-tweaks-' + key,
                type: 'checkbox',
                checked: settings[key],
                events: { change: e => changeSetting(key, e.target.checked) }
            }),
            label
        )
    ),
    [INPUT_TYPES.NUMBER_FIELD]: (key, label, description, placeholder, min = undefined, max = undefined) => el('div', { classes: ['form-group', 'dgg-tweaks-setting'], id: 'dgg-tweaks-' + key },
        el('label', { title: description, for: 'dgg-tweaks-' + key }, label),
        el('input', {
            classes: ['form-control'],
            type: 'number',
            name: 'dgg-tweaks-' + key,
            value: settings[key],
            min,
            max,
            placeholder,
            events: {
                change: e => changeSetting(key, parseFloat(e.target.value))
            }
        })
    ),
    [INPUT_TYPES.SELECT]: (key, label, description, options) => el('div', { classes: ['form-group', 'dgg-tweaks-setting'], id: 'dgg-tweaks-' + key },
        el('label', { title: description, for: 'dgg-tweaks-' + key }, label),
        el('select', {
            classes: ['form-control'],
            name: 'dgg-tweaks-' + key,
            events: {
                change: e => changeSetting(key, e.target.value)
            }
        }, ...options.map(option => el('option', { value: option[0], selected: option[0] === settings[key] ? true : undefined }, option[1])))
    )
}

function renderField(context, field) {
    const [fieldType, ...args] = field;
    return context[fieldType](...args);
}

function chatSettingsMenu() {
    const menu = el('div', { id: 'dgg-tweaks-settings' },
        el('h3', { classes: ['dgg-tweaks-settings-title'] }, "DGG Tweaks"),
        ...settingsMenuDef.map(section => el('section', { classes: ['dgg-tweaks-settings-section'] },
            el('h4', { classes: ['dgg-tweaks-settings-heading'] }, section.heading),
            ...section.fields.map(field => renderField(CHAT_UI, field))
        ))
    ).build();

    document.getElementById('chat-settings-form').appendChild(menu);
}

// LINK AGGREGATION BUTTON
function openLinkAggregatorPopup() {
    const linksRaw = document.querySelectorAll('.externallink');
    const urls = new Set();
    let messages = [];
    for (const linkEl of linksRaw) {
        if (urls.has(linkEl.href)) continue;

        const message = linkEl.closest('div.msg-user');
        if (!message) continue;

        urls.add(linkEl.href);
        if (settings['aggregate-links-button'] === 'link') {
            messages.push(fromHTML(linkEl.cloneNode(true)));
        } else if (settings['aggregate-links-button'] === 'name') {
            const cloned = message.cloneNode(true);
            cloned.querySelector('.text').replaceWith(linkEl.cloneNode(true));
            messages.push(fromHTML(cloned));
        } else {
            messages.push(fromHTML(message.cloneNode(true)));
        }
    }
    const linkButton = document.getElementById('chat-aggregate-links-btn');
    var popupContent = el('div', { classes: ['dgg-tweaks-aggregate-links'] }, ...messages).build();
    if (messages.length) linkButton._tippy.setContent(popupContent.outerHTML);
    else linkButton._tippy.setContent("<div class='dgg-tweaks-aggregate-links'>No links found in chat</div>");

    if (linkButton._tippy.state.isShown) linkButton._tippy.hide();
    else linkButton._tippy.show();
}

function removeChatToolButton(id) {
    const button = document.getElementById(id);
    button?._tippy?.destroy();
    button?.remove();
}

function ensureClonedChatToolButton({ id, anchor, placement = 'after', onClick, ariaLabel, tippyOptions }) {
    let button = document.getElementById(id);
    if (button || !anchor) return button;

    button = anchor.cloneNode(true);
    button.id = id;
    button.removeAttribute('data-tippy-content');
    if (ariaLabel) button.setAttribute('aria-label', ariaLabel);
    button.addEventListener('click', onClick);

    if (placement === 'before') anchor.before(button);
    else anchor.after(button);

    if (tippyOptions) tippy(button, tippyOptions);
    return button;
}

const CHAT_TOOL_TIPPY_OPTIONS = {
    trigger: 'click',
    interactive: true,
    allowHTML: true,
    content: "",
    maxWidth: 'none',
};

function addLinkAggregationButton() {
    if (settings["aggregate-links-button"] === 'off') {
        removeChatToolButton('chat-aggregate-links-btn');
        return;
    }

    ensureClonedChatToolButton({
        id: 'chat-aggregate-links-btn',
        anchor: document.getElementById('chat-watching-focus-btn'),
        placement: 'before',
        onClick: openLinkAggregatorPopup,
        tippyOptions: CHAT_TOOL_TIPPY_OPTIONS,
    });
}

let linkHitboxRefreshId = null;
let linkSizeHandlersRegistered = false;
let expandedLinkHoverTarget = null;

function getLinkHitboxLayer() {
    let layer = document.getElementById('dgg-tweaks-link-hitboxes');
    if (layer) return layer;

    layer = document.createElement('div');
    layer.id = 'dgg-tweaks-link-hitboxes';
    document.body.appendChild(layer);
    return layer;
}

function getLinkHitboxOutset(link) {
    const linkSize = Number(settings['link-size']);
    const multiplier = Number.isFinite(linkSize) ? Math.max(1, linkSize) : 1;
    if (multiplier <= 1) return 0;

    const fontSize = parseFloat(getComputedStyle(link).fontSize) || 16;
    return (multiplier - 1) * 0.5 * fontSize;
}

function pointDistanceFromRect(x, y, rect) {
    const dx = x < rect.left ? rect.left - x : x > rect.right ? x - rect.right : 0;
    const dy = y < rect.top ? rect.top - y : y > rect.bottom ? y - rect.bottom : 0;
    return Math.hypot(dx, dy);
}

function isExpandedLinkPointAvailable(x, y) {
    const topElement = document.elementFromPoint(x, y);
    if (!topElement) return false;

    return Boolean(topElement.closest('.msg-chat'));
}

function findExpandedLinkAtPoint(x, y) {
    if (!isExpandedLinkPointAvailable(x, y)) return null;

    let best = null;
    let bestDistance = Infinity;

    const links = document.querySelectorAll('.msg-chat .text a.externallink[href]');
    for (const link of links) {
        const outset = getLinkHitboxOutset(link);
        if (outset <= 0) continue;

        for (const rect of link.getClientRects()) {
            if (!rect.width || !rect.height) continue;
            if (
                x < rect.left - outset ||
                x > rect.right + outset ||
                y < rect.top - outset ||
                y > rect.bottom + outset
            ) continue;

            const distance = pointDistanceFromRect(x, y, rect);
            if (distance < bestDistance) {
                best = link;
                bestDistance = distance;
            }
        }
    }

    return best;
}

function followExpandedLink(link, event) {
    const openInNewTab = event.ctrlKey || event.metaKey || event.shiftKey || event.button === 1 || link.target === '_blank';
    if (openInNewTab) {
        window.open(link.href, '_blank', 'noopener');
        return;
    }

    window.location.href = link.href;
}

function maybeFollowExpandedLink(event) {
    if (event.defaultPrevented || event.button > 1) return;
    if (event.target.closest('a, button, input, textarea, select, [role="button"]')) return;

    const link = findExpandedLinkAtPoint(event.clientX, event.clientY);
    if (!link) return;

    event.preventDefault();
    event.stopPropagation();
    followExpandedLink(link, event);
}

function updateExpandedLinkCursor(event) {
    if (event.target.closest('a, button, input, textarea, select, [role="button"]')) {
        document.body.classList.remove('dgg-tweaks-expanded-link-hover');
        expandedLinkHoverTarget?.classList.remove('dgg-tweaks-expanded-link-hover');
        expandedLinkHoverTarget = null;
        return;
    }

    const link = findExpandedLinkAtPoint(event.clientX, event.clientY);
    document.body.classList.toggle('dgg-tweaks-expanded-link-hover', Boolean(link));

    if (expandedLinkHoverTarget !== link) {
        expandedLinkHoverTarget?.classList.remove('dgg-tweaks-expanded-link-hover');
        expandedLinkHoverTarget = link;
        expandedLinkHoverTarget?.classList.add('dgg-tweaks-expanded-link-hover');
    }
}

function refreshLinkHitboxes() {
    const layer = getLinkHitboxLayer();
    layer.replaceChildren();
    if (!settings['link-size-debug']) return;

    const links = document.querySelectorAll('.msg-chat .text a.externallink[href]');
    for (const link of links) {
        const outset = getLinkHitboxOutset(link);
        if (outset <= 0) continue;

        for (const rect of link.getClientRects()) {
            if (!rect.width || !rect.height) continue;
            if (rect.right <= 0 || rect.bottom <= 0 || rect.left >= window.innerWidth || rect.top >= window.innerHeight) continue;

            const left = Math.max(0, rect.left - outset);
            const top = Math.max(0, rect.top - outset);
            const right = Math.min(window.innerWidth, rect.right + outset);
            const bottom = Math.min(window.innerHeight, rect.bottom + outset);
            if (right <= left || bottom <= top) continue;

            const hitbox = document.createElement('a');
            hitbox.className = 'dgg-tweaks-link-hitbox';
            hitbox.href = link.href;
            hitbox.target = link.target || '_blank';
            hitbox.rel = link.rel || 'noopener noreferrer';
            hitbox.tabIndex = -1;
            hitbox.setAttribute('aria-hidden', 'true');
            hitbox.style.left = `${left}px`;
            hitbox.style.top = `${top}px`;
            hitbox.style.width = `${right - left}px`;
            hitbox.style.height = `${bottom - top}px`;
            layer.appendChild(hitbox);
        }
    }
}

function scheduleLinkHitboxRefresh() {
    cancelAnimationFrame(linkHitboxRefreshId);
    linkHitboxRefreshId = requestAnimationFrame(refreshLinkHitboxes);
}

function registerLinkSizeHandling() {
    if (linkSizeHandlersRegistered) return;
    linkSizeHandlersRegistered = true;

    document.addEventListener('click', maybeFollowExpandedLink, true);
    document.addEventListener('auxclick', maybeFollowExpandedLink, true);
    document.addEventListener('pointermove', event => {
        updateExpandedLinkCursor(event);
        scheduleLinkHitboxRefresh();
    }, true);
    window.addEventListener('resize', scheduleLinkHitboxRefresh);
    document.addEventListener('scroll', scheduleLinkHitboxRefresh, true);
}

function showTimeEnabled() {
    return document.getElementById("chat").classList.contains("pref-showtime");
}

const FULL_DATE_FORMAT = {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    suffix: true
};

const TIME_FORMAT = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
}

function formatTimestamp(timestamp, options = FULL_DATE_FORMAT) {
    const { suffix = false, ...formatOptions } = options;
    const date = new Date(timestamp);

    let formatted = new Intl.DateTimeFormat("en-GB", formatOptions).format(date);
    if (suffix) {
        const day = date.getDate();
        formatted = formatted.replace(day.toString(), `${day}${getDaySuffix(day)}`);
    }
    return formatted;
}

function getDaySuffix(day) {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
    }
}

function buildTemplatedChatMessage(username, text, timestamp = Date.now()) {
    const fullDate = formatTimestamp(timestamp, FULL_DATE_FORMAT);
    const time = formatTimestamp(timestamp, TIME_FORMAT);
    const elementString = `<div class="msg-chat msg-user" data-username="${username.toLowerCase()}"><time class="time" title="${fullDate}" data-unixtimestamp="${timestamp}">${time}</time>  <a title="" class="user">${username}</a><span class="ctrl">: </span> <span class="text">${text}</span></div>`;
    const templateContainer = document.createElement('template');
    templateContainer.innerHTML = elementString;
    return templateContainer.content.childNodes[0];
}

// RESIZE USER INFO

const RESIZE_AXIS = {
    VERTICAL: 'vertical',
    HORIZONTAL: 'horizontal',
    DIAGONAL: 'diagonal'
}

let currentResizeAxis = RESIZE_AXIS.DIAGONAL;

function startInfoResize(axis) {
    document.addEventListener("mouseup", endResize);
    document.addEventListener("mousemove", resizeInfo);
    currentResizeAxis = axis;
}

function resizeInfo(e) {
    const el = document.querySelector('#chat-user-info');

    const left = parseInt(el.style.left.slice(0, el.style.left.length - 2));
    const top = parseInt(el.style.top.slice(0, el.style.top.length - 2));

    if (currentResizeAxis != RESIZE_AXIS.HORIZONTAL) el.style.height = e.clientY - top + "px";
    if (currentResizeAxis != RESIZE_AXIS.VERTICAL) el.style.width = e.clientX - left + "px";
}

function endResize() {
    document.removeEventListener("mouseup", endResize);
    document.removeEventListener("mousemove", resizeInfo);
}

async function injectInfoResize() {
    const infoBox = document.querySelector('#chat-user-info');
    UTIL.injectStylesheet('css/resize-user-info.css', settings['resize-user-info']);
    if (settings['resize-user-info']) {
        if (!infoBox.querySelector('#info-resize-vertical')) infoBox.appendChild(el('div', { id: 'info-resize-vertical', classes: ['resize-vertical'], events: { mousedown: () => startInfoResize(RESIZE_AXIS.VERTICAL) } }).build());
        if (!infoBox.querySelector('#info-resize-horizontal')) infoBox.appendChild(el('div', { id: 'info-resize-horizontal', classes: ['resize-horizontal'], events: { mousedown: () => startInfoResize(RESIZE_AXIS.HORIZONTAL) } }).build());
        if (!infoBox.querySelector('#info-resize-diagonal')) infoBox.appendChild(el('div', { id: 'info-resize-diagonal', classes: ['resize-diagonal'], events: { mousedown: () => startInfoResize(RESIZE_AXIS.DIAGONAL) } }).build());
    } else {
        infoBox.querySelector('#info-resize-vertical')?.remove();
        infoBox.querySelector('#info-resize-horizontal')?.remove();
        infoBox.querySelector('#info-resize-diagonal')?.remove();
    }
}

// USER INFO BOX

async function injectToUserInfo() {
    await injectInfoResize();
}

let infoActive = false;
const infoObserver = new MutationObserver((mutations) => {
    mutations.forEach(mu => {
        if (mu.type !== 'attributes' && mu.attributeName !== 'class') return;
        const newInfoActive = mu.target.classList.contains('active');
        if (newInfoActive && !infoActive) injectToUserInfo();
        infoActive = newInfoActive;
    });
});

function registerInfoObserver() {
    if (settings['resize-user-info']) {
        const infoBox = document.getElementById('chat-user-info');
        if (infoBox) infoObserver.observe(infoBox, { attributes: true });
    } else {
        infoObserver.disconnect();
    }
}

// DGG-LAYOUT-FIX
function applyDGGLayoutFix() {
    const moveBefore = (el, newSibling) => newSibling?.parentNode?.insertBefore(el, newSibling);
    const moveAppend = () => (el, newParent) => newParent?.appendChild(el);

    document.querySelector('.navbar .navbar__item[href="/donate"]')?.remove(); // redundant
    document.querySelector('.navbar .navbar__item[href="/"')?.remove(); // redundant

    // TODO tinker with responsive collapsing
    const moneyButtons = document.createElement("div");
    moneyButtons.className = "navbar__items _layoutfix_navbar__money";

    moveAppend(
        document.getElementById("donate-btn"),
        // document.querySelector(".navbar__items.navbar__navigation")
        moneyButtons
    );
    moveAppend(
        document.getElementById("subscribe-btn"),
        // document.querySelector(".navbar__items.navbar__navigation")
        moneyButtons
    );
    moveBefore(
        document.getElementById("control-title"),
        document.querySelector(".control-badges")
    );
    moveBefore(
        document.getElementById("stream-controls"),
        document.getElementById("embed")
    );
    moveBefore(
        document.getElementById("control-buttons"),
        // document.querySelector('.navbar__actions')
        document.querySelector(".navbar__actions>:first-child")
    );
    moveBefore(
        moneyButtons,
        document.querySelector(".navbar__actions>:first-child")
    );
}

// MENTION BUTTON
function getCurrentChatUsername() {
    return document.getElementById("chat-input-control")?.placeholder?.split(' ')[2];
}

async function openMentionsPopup() {
    const mentionsButton = document.getElementById('dgg-tweaks-mentions-btn');

    if (mentionsButton._tippy.state.isShown) return;
    
    mentionsButton._tippy.setContent(`<div class='dgg-tweaks-mentions-popup' style='padding: 8px 12px;'>Loading...</div>`);
    mentionsButton._tippy.show();

    const username = getCurrentChatUsername();

    let messages = [];

    const res = await fetch(`https://www.destiny.gg/api/chat/mentions?username=${encodeURIComponent(username)}&limit=10`);
    const json = (await res.json()).data;
    const msgArr = Array.isArray(json) ? json : Object.values(json).filter(item => typeof item !== "string" && item);
    msgArr.sort((a, b) => a.date - b.date);

    async function processMessage(message) {
        const messageContent = await REGEXES.renderChatMessage(message.text);
        messages.push(fromHTML(buildTemplatedChatMessage(message.nick, messageContent, message.date * 1000)));
    }
    var promises = []
    for (const message of msgArr) {
        promises.push(processMessage(message));
    }
    await Promise.allSettled(promises);
    
    if (messages.length) {
        var popupContent = el('div', { classes: ['dgg-tweaks-mentions-popup', settings['mentions-force-timestamps'] && 'pref-showtime'] }, ...messages).build();
        mentionsButton._tippy.setContent(popupContent.outerHTML);
    }
    else mentionsButton._tippy.setContent("<div class='dgg-tweaks-mentions-popup'>No mentions found</div>");
}

function openRustlesearch() {
    const username = getCurrentChatUsername();
    if (!username) return;

    const url = new URL('https://rustlesearch.dev/');
    url.searchParams.set('channel', 'Destinygg');
    url.searchParams.set('start_date', '2010-01-01');
    url.searchParams.set('username', username);
    window.open(url.toString(), '_blank', 'noopener');
}

function addRustlesearchButton() {
    if (!settings["rustlesearch-button"]) {
        removeChatToolButton('dgg-tweaks-rustlesearch-btn');
        return;
    }

    ensureClonedChatToolButton({
        id: 'dgg-tweaks-rustlesearch-btn',
        anchor: document.getElementById('dgg-tweaks-mentions-btn') ?? document.getElementById('chat-whisper-btn'),
        onClick: openRustlesearch,
        ariaLabel: 'Search your Rustlesearch logs',
    });
}

function addMentionsButton() {
    if (!settings["mentions-button"]) {
        removeChatToolButton('dgg-tweaks-mentions-btn');
        return;
    }

    ensureClonedChatToolButton({
        id: 'dgg-tweaks-mentions-btn',
        anchor: document.getElementById('chat-whisper-btn'),
        onClick: openMentionsPopup,
        tippyOptions: CHAT_TOOL_TIPPY_OPTIONS,
    });
}

// CINEMA MODE

function cinemaModeOpenTop() {
    const header = document.querySelector("header.header");
    header.classList.add("active");

    const intervalId = setInterval(close, 125); // Deal with exiting window
    function close() {
        if (header.matches(":hover")) return;
        clearInterval(intervalId);
        header.classList.remove("active");
        header.removeEventListener('mouseleave', close);
    }
    header.addEventListener('mouseleave', close);
}

function toggleCinemaModeTop() {
    const domElId = "dgg-tweaks-menubar-hover";
    const showClass = "dgg-tweaks-show-in-cinema-mode";
    const enabled = settings['bigscreen-menubar'];

    const header = document.querySelector("header.header");
    header.classList.remove(showClass);

    document.getElementById(domElId)?.remove();
    if (!enabled) return;

    const element = el('div', { id: domElId, events: { 'mouseenter': cinemaModeOpenTop } }).build();
    document.querySelector(".stream-panel__backdrop").appendChild(element);

    header.classList.add(showClass);
}

function cinemaModeOpenBottom() {
    const header = document.querySelector("#stream-controls");
    header.classList.add("active");

    const intervalId = setInterval(close, 125); // Deal with exiting window
    function close() {
        if (header.matches(":hover")) return;
        clearInterval(intervalId);
        header.classList.remove("active");
        header.removeEventListener('mouseleave', close);
    }
    header.addEventListener('mouseleave', close);
}

function toggleCinemaModeBottom() {
    const domElId = "dgg-tweaks-controls-hover";
    const showClass = "dgg-tweaks-show-in-cinema-mode";
    const enabled = settings['bigscreen-controls'];

    const header = document.querySelector("#stream-controls");
    header.classList.remove(showClass);

    document.getElementById(domElId)?.remove();
    if (!enabled) return;

    const element = el('div', { id: domElId, events: { 'mouseenter': cinemaModeOpenBottom } }).build();
    document.querySelector(".stream-panel__backdrop").appendChild(element);

    header.classList.add(showClass);
}

// MAIN

async function onLoad() {
    if (PAGE_TYPE === PAGE_TYPES.CHAT) {
        chatSettingsMenu();
        UTIL.injectStylesheet('css/link-size.css');
        registerLinkSizeHandling();
        registerInfoObserver();
    } else {
    }
    if (PAGE_TYPE === PAGE_TYPES.BIGSCREEN) {
        toggleCinemaModeTop();
        toggleCinemaModeBottom();
        UTIL.injectStylesheet('css/dgg-layout-fix.css', settings['dgg-layout-fix']);
        if (settings['dgg-layout-fix']) applyDGGLayoutFix();
    }
}

async function onSettingsChanged() {
    if (PAGE_TYPE === PAGE_TYPES.CHAT) {
        UTIL.injectStylesheet('css/link-size-debug.css', settings['link-size-debug']);
        scheduleLinkHitboxRefresh();
        addLinkAggregationButton();
        addMentionsButton();
        addRustlesearchButton();
        registerInfoObserver();
        if (document.querySelector('#chat-user-info')?.classList.contains('active')) await injectInfoResize();
    }
}

async function main() {
    UTIL.injectStylesheet('css/base.css');
    await loadSettings();
    await onLoad();
    await onSettingsChanged();
}

if (document.readyState !== "loading") main();
else document.addEventListener("DOMContentLoaded", main);
