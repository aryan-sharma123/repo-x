
// content.js — Handles overlay for both Habit and Advanced Modes

let overlay = null;
let targetElement = null;

// Default settings
const defaultSettings = {
    position: 'top',
    width: '600px',
    height: '60px',
    mode: 'habit',
    animation: true
};

let currentSettings = { ...defaultSettings };

// Load settings
browser.storage.sync.get().then(settings => {
    currentSettings = { ...defaultSettings, ...settings };
    setupEventListeners();
});

function setupEventListeners() {
    document.removeEventListener('focusin', handleFocusIn);
    document.removeEventListener('mousedown', handleMouseDown);

    if (currentSettings.mode === 'off') return;

    document.addEventListener('focusin', handleFocusIn, { capture: true });
    document.addEventListener('mousedown', handleMouseDown);
}

function handleFocusIn(e) {
    if (overlay) return;
    const el = e.target;
    if (isValidInput(el)) {
        targetElement = el;
        if (currentSettings.mode === 'habit') {
            createOverlay();
        } else if (currentSettings.mode === 'advanced') {
            applyAdvancedEnhancements(el);
        }
    }
}

function handleMouseDown(e) {
    if (overlay && e.target !== overlay && e.target !== targetElement) {
        removeOverlay();
    }
}

function isValidInput(el) {
    if (!el) return false;
    const tag = el.tagName.toLowerCase();
    const inputTypes = ['text', 'search', 'url', 'email', 'password', 'tel', 'number'];
    return tag === 'textarea' ||
        (tag === 'input' && inputTypes.includes(el.type)) ||
        el.isContentEditable;
}

// HABIT MODE
function createOverlay() {
    if (overlay) return;

    overlay = document.createElement('textarea');
    overlay.id = 'floatinput-working';

    overlay.value = targetElement.isContentEditable
        ? targetElement.innerText
        : targetElement.value;

    Object.assign(overlay.style, {
        position: 'fixed',
        zIndex: '2147483647',
        width: currentSettings.width,
        height: currentSettings.height,
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #d0d0d0',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        outline: 'none',
        resize: 'none',
        fontFamily: 'inherit',
        fontSize: '16px'
    });

    positionOverlay();
    document.body.appendChild(overlay);

    overlay.addEventListener('input', syncWithTarget);
    overlay.addEventListener('keydown', handleKeyDown);
    overlay.addEventListener('blur', handleBlur);
    overlay.focus();
    overlay.select();
}

function positionOverlay() {
    if (!overlay) return;

    const positions = {
        top: () => { overlay.style.top = '20px'; overlay.style.left = '50%'; overlay.style.transform = 'translateX(-50%)'; },
        center: () => { overlay.style.top = '50%'; overlay.style.left = '50%'; overlay.style.transform = 'translate(-50%, -50%)'; },
        bottom: () => { overlay.style.bottom = '20px'; overlay.style.left = '50%'; overlay.style.transform = 'translateX(-50%)'; }
    };

    (positions[currentSettings.position] || positions.top)();
}

function syncWithTarget() {
    if (!targetElement || !overlay) return;

    try {
        if (targetElement.isContentEditable) {
            targetElement.innerText = overlay.value;
        } else {
            targetElement.value = overlay.value;
        }

        ['input', 'change'].forEach(eventName => {
            const event = new Event(eventName, { bubbles: true, cancelable: true });
            targetElement.dispatchEvent(event);
        });
    } catch (err) {
        console.error('Failed to sync:', err);
        removeOverlay();
    }
}

function handleKeyDown(e) {
    if (e.key === 'Escape') {
        e.preventDefault();
        removeOverlay();
        targetElement?.focus();
    }
}

function handleBlur() {
    setTimeout(() => {
        if (!document.activeElement ||
            (document.activeElement !== overlay &&
            document.activeElement !== targetElement)) {
            removeOverlay();
        }
    }, 100);
}

function removeOverlay() {
    if (overlay) {
        overlay.remove();
        overlay = null;
        targetElement = null;
    }
}

// ADVANCED MODE: Apply styling changes using CSS variables
function applyAdvancedEnhancements(el) {
    const highlight = '2px solid #4285f4';
    el.style.outline = highlight;
    el.style.backgroundColor = '#f5faff';
    el.style.transition = 'all 0.3s ease';
}

// Update settings when changed from popup
browser.runtime.onMessage.addListener((message) => {
    if (message.action === 'updateSettings') {
        currentSettings = { ...currentSettings, ...message.settings };

        if (overlay) {
            overlay.style.width = currentSettings.width;
            overlay.style.height = currentSettings.height;
            positionOverlay();
        }
    }
});

window.addEventListener('unload', removeOverlay);
