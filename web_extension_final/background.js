// background.js — Handles initial setup and messaging

browser.runtime.onInstalled.addListener(() => {
  // Set reasonable defaults for the first-time user
  browser.storage.sync.set({
    position: 'top',
    width: '600px',
    height: '60px',
    mode: 'habit',
    animation: 'true'
  });
});

// Listen for messages requesting updated settings
browser.runtime.onMessage.addListener((msg, sender, reply) => {
  if (msg.action === "getSettings") {
    browser.storage.sync.get().then(reply);
    return true; // Keep the message port open for async reply
  }
});
