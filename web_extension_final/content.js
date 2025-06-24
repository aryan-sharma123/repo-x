// content.js - Floating Input Extension (Habit + Advanced Modes)

// ========================
// CORE FUNCTIONALITY
// ========================

let overlay = null;
let targetElement = null;

// Default settings
const defaultSettings = {
    position: 'top',
    width: '600px',
    height: '60px',
    mode: 'habit',
    animation: true,
    llmEnabled: false
};

let currentSettings = { ...defaultSettings };

// Initialize extension
function initExtension() {
    console.log('[FloatingInput] Extension initialized');

    // Load settings from storage
    browser.storage.sync.get().then(settings => {
        console.log('[FloatingInput] Loaded settings:', settings);
        currentSettings = { ...defaultSettings, ...settings };
        setupEventListeners();
        injectDebugTools(); // Inject debug helpers
    }).catch(err => {
        console.error('[FloatingInput] Failed to load settings:', err);
        currentSettings = { ...defaultSettings };
        setupEventListeners();
    });
}

// Set up event listeners
function setupEventListeners() {
    console.log('[FloatingInput] Setting up event listeners');

    // Remove existing listeners to avoid duplicates
    document.removeEventListener('focusin', handleFocusIn);
    document.removeEventListener('mousedown', handleMouseDown);

    if (currentSettings.mode === 'off') {
        console.log('[FloatingInput] Extension disabled in settings');
        return;
    }

    // Add new listeners with capture
    document.addEventListener('focusin', handleFocusIn, { capture: true });
    document.addEventListener('mousedown', handleMouseDown, { capture: true });

    console.log('[FloatingInput] Event listeners active');
}

// Handle focus events
function handleFocusIn(e) {
    if (overlay) return;

    const el = e.target;
    console.log('[FloatingInput] Focus detected on:', el.tagName, el.type || '');

    if (isValidInput(el)) {
        console.log('[FloatingInput] Valid input detected');
        targetElement = el;

        if (currentSettings.mode === 'habit') {
            createOverlay();
        } else if (currentSettings.mode === 'advanced') {
            applyAdvancedEnhancements(el);
        }
    }
}

// Handle click outside overlay
function handleMouseDown(e) {
    if (overlay && e.target !== overlay && e.target !== targetElement) {
        console.log('[FloatingInput] Click outside overlay - removing');
        removeOverlay();
    }
}

// Check if element is a valid input
function isValidInput(el) {
    if (!el) return false;
    const tag = el.tagName.toLowerCase();
    const inputTypes = ['text', 'search', 'url', 'email', 'password', 'tel', 'number'];

    const isValid = tag === 'textarea' ||
        (tag === 'input' && inputTypes.includes(el.type)) ||
        el.isContentEditable;

    console.log('[FloatingInput] Input validation:', el, isValid);
    return isValid;
}

// ========================
// HABIT MODE IMPLEMENTATION
// ========================

function createOverlay() {
    if (overlay) return;
    console.log('[FloatingInput] Creating overlay');

    overlay = document.createElement('textarea');
    overlay.id = 'floatinput-overlay';
    overlay.className = 'floatinput-overlay';

    // Sync initial value
    overlay.value = targetElement.isContentEditable
        ? targetElement.innerText
        : targetElement.value;

    // Apply styles
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
        fontSize: '16px',
        backgroundColor: '#ffffff'
    });

    positionOverlay();
    document.body.appendChild(overlay);

    // Add event listeners
    overlay.addEventListener('input', syncWithTarget);
    overlay.addEventListener('keydown', handleKeyDown);
    overlay.addEventListener('blur', handleBlur);

    overlay.focus();
    overlay.select();

    console.log('[FloatingInput] Overlay created and focused');
}

function positionOverlay() {
    if (!overlay) return;

    const positions = {
        top: () => {
            overlay.style.top = '20px';
            overlay.style.left = '50%';
            overlay.style.transform = 'translateX(-50%)';
        },
        center: () => {
            overlay.style.top = '50%';
            overlay.style.left = '50%';
            overlay.style.transform = 'translate(-50%, -50%)';
        },
        bottom: () => {
            overlay.style.bottom = '20px';
            overlay.style.left = '50%';
            overlay.style.transform = 'translateX(-50%)';
        }
    };

    (positions[currentSettings.position] || positions.top)();
    console.log('[FloatingInput] Overlay positioned:', currentSettings.position);
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
        ['input', 'change'].forEach(eventName => {
            const event = new Event(eventName, { bubbles: true, cancelable: true });
            targetElement.dispatchEvent(event);
        });

        console.log('[FloatingInput] Value synced');
    } catch (err) {
        console.error('[FloatingInput] Sync failed:', err);
        removeOverlay();
    }
}

function handleKeyDown(e) {
    if (e.key === 'Escape') {
        e.preventDefault();
        console.log('[FloatingInput] Escape pressed - removing overlay');
        removeOverlay();
        targetElement?.focus();
    }
}

function handleBlur() {
    setTimeout(() => {
        if (!document.activeElement ||
            (document.activeElement !== overlay &&
                document.activeElement !== targetElement)) {
            console.log('[FloatingInput] Overlay lost focus - removing');
            removeOverlay();
        }
    }, 100);
}

function removeOverlay() {
    if (overlay) {
        console.log('[FloatingInput] Removing overlay');
        overlay.remove();
        overlay = null;
        targetElement = null;
    }
}

// ========================
// ADVANCED MODE IMPLEMENTATION
// ========================

async function applyAdvancedEnhancements(el) {
    console.log('[FloatingInput] Starting advanced enhancements');

    // Get current settings including API key
    const settings = await browser.storage.sync.get(['llmEnabled', 'apiKey']);

    if (!settings.llmEnabled || settings.llmEnabled !== 'true') {
        console.log('[FloatingInput] LLM not enabled - using basic highlighting');
        el.style.outline = '2px solid #4285f4';
        el.style.backgroundColor = '#f5faff';
        return;
    }

    if (!settings.apiKey) {
        console.error('[FloatingInput] No API key provided');
        el.style.outline = '2px solid #ff0000';
        return;
    }

    try {
        console.log('[FloatingInput] Calling LLM for enhancements');
        const htmlSnippet = el.outerHTML;
        const prompt = "Reposition this input for better ergonomics...";

        // Inject the LLM module
        const llmScript = await fetch(browser.runtime.getURL('llm.js'));
        const llmCode = await llmScript.text();
        const modifiedCode = llmCode.replace('your-api-key', settings.apiKey);

        // Execute the LLM code
        const llmFunction = new Function('htmlSnippet', 'prompt', modifiedCode);
        const css = await llmFunction(htmlSnippet, prompt);

        if (css) {
            console.log('[FloatingInput] Received CSS from LLM:', css);
            const styleTag = document.createElement('style');
            styleTag.id = 'floatinput-llm-css';
            styleTag.textContent = css;
            document.head.appendChild(styleTag);
        }
    } catch (err) {
        console.error('[FloatingInput] Advanced mode failed:', err);
        el.style.outline = '2px solid #ff0000';
    }
}

// ========================
// DEBUG TOOLS
// ========================

function injectDebugTools() {
    console.log('[FloatingInput] Injecting debug tools');

    const script = document.createElement('script');
    script.textContent = `
        (function() {
            window.floatingInputDebug = {
                testInputs: function() {
                    console.log('[DEBUG] Testing input detection...');
                    document.querySelectorAll('input, textarea, [contenteditable]').forEach(el => {
                        el.addEventListener('focus', function() {
                            console.log('[DEBUG] Focused:', this.tagName, 
                                        "Type:", this.type || 'contenteditable',
                                        "Valid?", ${isValidInput.toString()}(this));
                        }, true);
                    });
                },
                
                forceOverlay: function() {
                    const el = document.activeElement;
                    if (el && ${isValidInput.toString()}(el)) {
                        ${createOverlay.toString()}.call({
                            targetElement: el,
                            currentSettings: ${JSON.stringify(currentSettings)}
                        });
                        console.log('[DEBUG] Overlay forced');
                    } else {
                        console.warn('[DEBUG] No valid input focused');
                    }
                },
                
                showSettings: function() {
                    console.log('Current settings:', ${JSON.stringify(currentSettings)});
                }
            };
            console.log('[DEBUG] Debug tools ready. Available commands:',
                        Object.keys(window.floatingInputDebug).join(', '));
        })();
    `;
    document.documentElement.appendChild(script);
    script.remove();
}

// ========================
// MESSAGE HANDLING
// ========================

browser.runtime.onMessage.addListener((message) => {
    if (message.action === 'updateSettings') {
        console.log('[FloatingInput] Received updated settings:', message.settings);
        currentSettings = { ...currentSettings, ...message.settings };

        if (overlay) {
            overlay.style.width = currentSettings.width;
            overlay.style.height = currentSettings.height;
            positionOverlay();
        }

        setupEventListeners();
    }
    return Promise.resolve({ success: true });
});

// ========================
// INITIALIZATION
// ========================

// Start extension when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initExtension);
} else {
    initExtension();
}

// Clean up on page unload
window.addEventListener('unload', removeOverlay);

console.log('[FloatingInput] Content script loaded');