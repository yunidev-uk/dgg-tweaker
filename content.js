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
            [INPUT_TYPES.CHECKBOX, 'movie-button', "Movie Status Button", "Adds a movie schedule status button to the bottom of chat"],
            [INPUT_TYPES.CHECKBOX, 'kick-chat-bridge', "Kick Chat Messages", "Shows kick.com/destiny chat messages in DGG chat"],
            [INPUT_TYPES.CHECKBOX, 'youtube-chat-bridge', "YouTube Chat Messages", "Shows YouTube chat messages from Destiny's live stream in DGG chat"],
            [INPUT_TYPES.CHECKBOX, 'collapse-combo-emotes', "Merge emote combos", "Combines broken combos and includes multi-emote spam in combos"],
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
    'rustlesearch-button': true,
    'movie-button': false,
    'kick-chat-bridge': false,
    'youtube-chat-bridge': false,
    'collapse-combo-emotes': false
};

const SETTINGS_DISABLED_BY_DGG_LAYOUT_FIX = ['bigscreen-menubar', 'bigscreen-controls'];

function isSettingDisabled(key) {
    return settings['dgg-layout-fix'] && SETTINGS_DISABLED_BY_DGG_LAYOUT_FIX.includes(key);
}

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
                disabled: isSettingDisabled(key),
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
    updateDisabledSettings();
}

function updateDisabledSettings() {
    for (const key of SETTINGS_DISABLED_BY_DGG_LAYOUT_FIX) {
        const input = document.querySelector(`[name="dgg-tweaks-${key}"]`);
        if (input) input.disabled = isSettingDisabled(key);
    }
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

// COLLAPSE COMBO EMOTES
const COLLAPSE_COMBO_RECENT_ROW_LIMIT = 10;
const COMBO_STEP_CLASSES = ['x2', 'x5', 'x10', 'x20', 'x30', 'x50'];
let collapseComboObserver = null;
let collapseComboRootObserver = null;

function getComboStepClass(count) {
    if (count >= 50) return 'x50';
    if (count >= 30) return 'x30';
    if (count >= 20) return 'x20';
    if (count >= 10) return 'x10';
    if (count >= 5) return 'x5';
    return 'x2';
}

function isVisibleChatRow(messageEl) {
    return getComputedStyle(messageEl).display !== 'none';
}

function getRenderedEmoteName(emoteEl) {
    return emoteEl.getAttribute('title') || emoteEl.textContent.trim();
}

function getRenderedComboCount(messageEl) {
    const dataCount = parseInt(messageEl.getAttribute('data-combo'), 10);
    if (Number.isFinite(dataCount)) return dataCount;

    const renderedCount = parseInt(messageEl.querySelector(':scope > .chat-combo .count')?.textContent, 10);
    return Number.isFinite(renderedCount) ? renderedCount : 1;
}

function getComboMessageInfo(messageEl) {
    if (!messageEl?.matches?.('.msg-user, .msg-emote')) return null;

    const textEl = messageEl.querySelector(':scope > .text');
    if (!textEl) return null;

    const emotes = [];
    for (const node of textEl.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
            if (node.textContent.trim() !== '') return null;
            continue;
        }

        if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('emote')) {
            const emote = getRenderedEmoteName(node);
            if (!emote) return null;
            emotes.push(emote);
            continue;
        }

        return null;
    }

    if (emotes.length === 0) return null;
    if (!emotes.every(emote => emote === emotes[0])) return null;

    return {
        emote: emotes[0],
        count: getRenderedComboCount(messageEl)
    };
}

function getRecentMatchingComboTarget(messageEl, emote) {
    let rowsSeen = 0;
    let current = messageEl.previousElementSibling;

    while (current && rowsSeen < COLLAPSE_COMBO_RECENT_ROW_LIMIT) {
        if (current.matches?.('.msg-chat') && isVisibleChatRow(current)) {
            rowsSeen += 1;
            const currentInfo = current.matches?.('.msg-emote') && getComboMessageInfo(current);
            if (currentInfo?.emote === emote) return current;
        }
        current = current.previousElementSibling;
    }

    return null;
}

function ensureComboElement(messageEl) {
    let combo = messageEl.querySelector(':scope > .chat-combo');
    if (combo) return combo;
    if (!messageEl.matches?.('.msg-emote')) return null;

    combo = el('span', { classes: ['chat-combo'] },
        el('i', { classes: ['count'] }, '1'),
        ' ',
        el('i', { classes: ['x'] }, 'X'),
        ' ',
        el('i', { classes: ['hit'] }, 'Hits'),
        ' ',
        el('i', { classes: ['combo'] }, 'C-C-C-COMBO')
    ).build();

    const textEl = messageEl.querySelector(':scope > .text');
    textEl?.after(combo);
    return combo;
}

function updateCollapsedCombo(messageEl, count) {
    const stepClass = getComboStepClass(count);
    const combo = ensureComboElement(messageEl);
    if (!combo) return false;
    const textEl = messageEl.querySelector(':scope > .text');

    messageEl.setAttribute('data-combo', count);
    messageEl.setAttribute('data-combo-group', stepClass);
    combo.classList.remove(...COMBO_STEP_CLASSES, 'combo-complete');
    combo.classList.add(stepClass);
    combo.querySelector('.count').textContent = String(count);

    if (textEl) {
        textEl.remove();
        combo.remove();
        messageEl.append(textEl, combo);
    }

    return true;
}

function collapseComboMessage(messageEl) {
    const messageInfo = getComboMessageInfo(messageEl);
    if (!messageInfo) return;

    const target = getRecentMatchingComboTarget(messageEl, messageInfo.emote);
    if (!target) return;

    const targetInfo = getComboMessageInfo(target);
    if (!targetInfo) return;

    if (updateCollapsedCombo(target, targetInfo.count + 1)) {
        messageEl.remove();
    }
}

function onCollapseComboMutations(mutations) {
    for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
            if (node.nodeType !== Node.ELEMENT_NODE) continue;
            if (node.matches?.('.msg-chat')) {
                collapseComboMessage(node);
            } else {
                node.querySelectorAll?.('.msg-chat').forEach(collapseComboMessage);
            }
        }
    }
}

function observeCollapseComboLines(linesEl) {
    collapseComboRootObserver?.disconnect();
    collapseComboRootObserver = null;
    collapseComboObserver?.disconnect();
    collapseComboObserver = new MutationObserver(onCollapseComboMutations);
    collapseComboObserver.observe(linesEl, { childList: true });
}

function registerCollapseComboObserver() {
    collapseComboObserver?.disconnect();
    collapseComboRootObserver?.disconnect();
    collapseComboObserver = null;
    collapseComboRootObserver = null;

    if (!settings['collapse-combo-emotes']) return;

    const linesEl = UTIL.getChatLinesElement();
    if (linesEl) {
        observeCollapseComboLines(linesEl);
        return;
    }

    collapseComboRootObserver = new MutationObserver(() => {
        const lines = UTIL.getChatLinesElement();
        if (lines) observeCollapseComboLines(lines);
    });
    collapseComboRootObserver.observe(document.body, { childList: true, subtree: true });
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

// MOVIE STATUS BUTTON
const MOVIE_STATUS_URL = 'https://movies.zeul.dev/api/status';
const MOVIE_REFRESH_INTERVAL_MS = 5 * 60 * 1000;
const MOVIE_TICK_INTERVAL_MS = 1000;
const MOVIE_POLL_EXPIRE_MS = 5 * 60 * 1000;

let movieStatus = {
    fetchOk: false,
    scheduleType: 'Normal',
    sessions: [],
    lastPoll: null
};
let movieFetchTimer = null;
let movieTickTimer = null;

function requestJson(url) {
    if (typeof GM_xmlhttpRequest === 'function') {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url,
                onload: response => {
                    if (response.status < 200 || response.status >= 300) {
                        reject(new Error(`Request failed with status ${response.status}`));
                        return;
                    }
                    resolve(JSON.parse(response.responseText));
                },
                onerror: reject,
                ontimeout: reject
            });
        });
    }

    if (typeof GM !== 'undefined' && typeof GM.xmlHttpRequest === 'function') {
        return GM.xmlHttpRequest({ method: 'GET', url }).then(response => JSON.parse(response.responseText));
    }

    return fetch(url).then(response => {
        if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
        return response.json();
    });
}

function parseMovieDate(value) {
    if (value === null || value === undefined) return null;
    if (typeof value === 'number') {
        const timestamp = value < 10000000000 ? value * 1000 : value;
        const date = new Date(timestamp);
        return Number.isNaN(date.getTime()) ? null : date;
    }

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}

function normalizeMoviePoll(poll) {
    if (!poll) return null;
    if (typeof poll === 'string') return { url: poll, time: null };

    const url = poll.url || poll.pollUrl || poll.link || poll.href;
    if (!url) return null;

    const time = parseMovieDate(
        poll.time ||
        poll.timestamp ||
        poll.createdAt ||
        poll.created_at ||
        poll.detectedAt ||
        poll.detected_at ||
        poll.messageTimestamp ||
        poll.date
    );
    return { url, time };
}

function getActiveMoviePoll() {
    const poll = normalizeMoviePoll(movieStatus.lastPoll);
    if (!poll) return null;
    if (!poll.time) return poll;
    return Date.now() - poll.time.getTime() <= MOVIE_POLL_EXPIRE_MS ? poll : null;
}

async function fetchMovieStatus() {
    try {
        const data = await requestJson(MOVIE_STATUS_URL);
        movieStatus = {
            fetchOk: true,
            scheduleType: data.scheduleType || 'Normal',
            sessions: (data.sessions || []).map(session => ({
                start: parseMovieDate(session.start),
                end: parseMovieDate(session.end)
            })).filter(session => session.start && session.end).sort((a, b) => a.start - b.start),
            lastPoll: data.lastPoll || null
        };
    } catch (error) {
        movieStatus.fetchOk = false;
        console.error('[dgg-tweaks] Failed to fetch movie status:', error);
    }

    updateMovieButton();
}

function getMovieScheduleStatus() {
    const now = Date.now();
    const activeSession = movieStatus.sessions.find(session => now >= session.start.getTime() && now < session.end.getTime());
    if (activeSession) {
        return {
            state: 'live',
            label: 'Movie Time',
            detail: `Ends in ${formatDuration(activeSession.end.getTime() - now)}`
        };
    }

    const nextSession = movieStatus.sessions.find(session => session.start.getTime() > now);
    if (nextSession) {
        const remaining = nextSession.start.getTime() - now;
        return {
            state: 'upcoming',
            label: 'No Movies',
            detail: remaining > 24 * 60 * 60 * 1000
                ? formatMovieDate(nextSession.start)
                : `Starts in ${formatDuration(remaining)}`
        };
    }

    return {
        state: 'off',
        label: 'No Movies',
        detail: 'No sessions scheduled'
    };
}

function formatDuration(ms) {
    if (ms === null || ms === undefined || ms <= 0) return '';
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
}

function formatMovieDate(date) {
    const day = date.toLocaleDateString(undefined, { weekday: 'long' });
    const dayOfMonth = date.getDate();
    const time = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
    return `${day} ${dayOfMonth}${getDaySuffix(dayOfMonth)} ${time}`;
}

function buildMovieTooltipContent(status, poll) {
    const label = movieStatus.scheduleType && movieStatus.scheduleType !== 'Normal'
        ? `${status.label} (${movieStatus.scheduleType})`
        : status.label;
    const pollAge = poll?.time ? `Poll posted ${formatDuration(Date.now() - poll.time.getTime())} ago` : 'Poll available';

    return el('div', { classes: ['dgg-tweaks-movie-tooltip'] },
        el('strong', {}, movieStatus.fetchOk ? label : 'Connection error'),
        movieStatus.fetchOk && status.detail && el('span', {}, status.detail),
        poll && el('span', {}, pollAge)
    ).build().outerHTML;
}

function updateMovieButton() {
    const button = document.getElementById('dgg-tweaks-movie-btn');
    if (!button) return;

    const status = movieStatus.fetchOk ? getMovieScheduleStatus() : { state: 'off', label: 'Connection error', detail: '' };
    const poll = getActiveMoviePoll();

    button.classList.toggle('dgg-tweaks-movie-live', status.state === 'live');
    button.classList.toggle('dgg-tweaks-movie-upcoming', status.state === 'upcoming');
    button.style.cursor = poll ? 'pointer' : '';
    button.setAttribute('aria-label', poll ? 'Open the current movie poll' : 'Movie schedule status');

    let dot = button.querySelector('.dgg-tweaks-movie-dot');
    if (poll && !dot) {
        dot = document.createElement('span');
        dot.className = 'dgg-tweaks-movie-dot';
        button.appendChild(dot);
    } else if (!poll) {
        dot?.remove();
    }

    button._tippy?.setContent(buildMovieTooltipContent(status, poll));
}

function openMoviePoll() {
    const poll = getActiveMoviePoll();
    window.open(poll?.url || 'https://dinkdonk.mov/', '_blank', 'noopener');
}

function stopMovieStatusButton() {
    clearInterval(movieFetchTimer);
    clearInterval(movieTickTimer);
    movieFetchTimer = null;
    movieTickTimer = null;
    removeChatToolButton('dgg-tweaks-movie-btn');
}

function addMovieStatusButton() {
    if (!settings["movie-button"]) {
        stopMovieStatusButton();
        return;
    }

    ensureClonedChatToolButton({
        id: 'dgg-tweaks-movie-btn',
        anchor: document.getElementById('chat-aggregate-links-btn') ?? document.getElementById('chat-watching-focus-btn'),
        placement: 'before',
        onClick: openMoviePoll,
        ariaLabel: 'Movie schedule status',
        tippyOptions: {
            trigger: 'mouseenter focus',
            allowHTML: true,
            content: '',
            onShow: () => {
                updateMovieButton();
            }
        }
    });

    updateMovieButton();

    if (!movieFetchTimer) {
        fetchMovieStatus();
        movieFetchTimer = setInterval(fetchMovieStatus, MOVIE_REFRESH_INTERVAL_MS);
    }
    if (!movieTickTimer) {
        movieTickTimer = setInterval(updateMovieButton, MOVIE_TICK_INTERVAL_MS);
    }
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
        updateDisabledSettings();
        UTIL.injectStylesheet('css/link-size-debug.css', settings['link-size-debug']);
        scheduleLinkHitboxRefresh();
        addLinkAggregationButton();
        addMentionsButton();
        addRustlesearchButton();
        addMovieStatusButton();
        syncKickChat(PAGE_TYPE === PAGE_TYPES.CHAT && settings['kick-chat-bridge']);
        syncYoutubeChat(PAGE_TYPE === PAGE_TYPES.CHAT && settings['youtube-chat-bridge']);
        registerKickEmoteObserver(settings['kick-chat-bridge']);
        registerYoutubeEmoteObserver(settings['youtube-chat-bridge']);
        registerInfoObserver();
        registerCollapseComboObserver();
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
