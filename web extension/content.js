// content.js - Working Floating Input Extension
let overlay = null;
let targetElement = null;

// Initialize with default settings
const defaultSettings = {
    position: 'top',
    width: '600px',
    height: '60px',
    mode: 'habit',
    animation: true
};

let currentSettings = { ...defaultSettings };

// Load settings from storage
browser.storage.sync.get().then(settings => {
    currentSettings = { ...defaultSettings, ...settings };
    setupEventListeners();
});

function setupEventListeners() {
    // Remove existing listeners to avoid duplicates
    document.removeEventListener('focusin', handleFocusIn);
    document.removeEventListener('mousedown', handleMouseDown);

    if (currentSettings.mode === 'off') return;

    document.addEventListener('focusin', handleFocusIn, { capture: true });
    document.addEventListener('mousedown', handleMouseDown);
}

function handleFocusIn(e) {
    if (overlay) return; // Don't create if one exists

    const el = e.target;
    if (isValidInput(el)) {
        targetElement = el;
        createOverlay();
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

function createOverlay() {
    if (overlay) return;

    overlay = document.createElement('textarea');
    overlay.id = 'floatinput-working';

    // Get initial value
    overlay.value = targetElement.isContentEditable
        ? targetElement.innerText
        : targetElement.value;

    // Apply styles
    overlay.style.position = 'fixed';
    overlay.style.zIndex = '2147483647';
    overlay.style.width = currentSettings.width;
    overlay.style.height = currentSettings.height;
    overlay.style.padding = '12px';
    overlay.style.borderRadius = '8px';
    overlay.style.border = '1px solid #d0d0d0';
    overlay.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
    overlay.style.outline = 'none';
    overlay.style.resize = 'none';
    overlay.style.fontFamily = 'inherit';
    overlay.style.fontSize = '16px';

    // Position based on settings
    positionOverlay();

    document.body.appendChild(overlay);

    // Event listeners
    overlay.addEventListener('input', syncWithTarget);
    overlay.addEventListener('keydown', handleKeyDown);
    overlay.addEventListener('blur', handleBlur);

    // Focus and select
    overlay.focus();
    overlay.select();
}

function positionOverlay() {
    if (!overlay) return;

    switch (currentSettings.position) {
        case 'top':
            overlay.style.top = '20px';
            overlay.style.left = '50%';
            overlay.style.transform = 'translateX(-50%)';
            break;
        case 'center':
            overlay.style.top = '50%';
            overlay.style.left = '50%';
            overlay.style.transform = 'translate(-50%, -50%)';
            break;
        case 'bottom':
            overlay.style.bottom = '20px';
            overlay.style.left = '50%';
            overlay.style.transform = 'translateX(-50%)';
            break;
        default:
            overlay.style.top = '20px';
            overlay.style.left = '50%';
            overlay.style.transform = 'translateX(-50%)';
    }
}

function syncWithTarget() {
    if (!targetElement || !overlay) return;

    try {
        if (targetElement.isContentEditable) {
            targetElement.innerText = overlay.value;
        } else {
            targetElement.value = overlay.value;
        }

        // Trigger events
        targetElement.dispatchEvent(new Event('input', { bubbles: true }));
        targetElement.dispatchEvent(new Event('change', { bubbles: true }));
    } catch (error) {
        console.error('Sync error:', error);
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

// Handle settings updates
browser.runtime.onMessage.addListener((message) => {
    if (message.action === 'updateSettings') {
        currentSettings = { ...currentSettings, ...message.settings };

        // Update existing overlay if needed
        if (overlay) {
            overlay.style.width = currentSettings.width;
            overlay.style.height = currentSettings.height;
            positionOverlay();
        }
    }
});

// Cleanup when page changes
window.addEventListener('unload', removeOverlay);