// Firefox uses browser namespace instead of chrome
browser.runtime.onInstalled.addListener(() => {
    // Set default settings
    browser.storage.sync.set({
        position: 'top',
        width: '600px',
        height: '60px',
        mode: 'habit',
        animation: 'true'
    });
});

// Handle messages from content script
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getSettings") {
        browser.storage.sync.get().then(sendResponse);
        return true; // Required for async response
    }
});