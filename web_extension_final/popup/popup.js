// popup.js — Handles settings UI in popup

document.addEventListener('DOMContentLoaded', () => {
  // Populate settings from saved data
  browser.storage.sync.get(['position', 'width', 'height', 'mode', 'animation'])
    .then(settings => {
      document.getElementById('position').value = settings.position || 'top';
      document.getElementById('width').value = settings.width || '600px';
      document.getElementById('height').value = settings.height || '60px';
      document.getElementById('mode').value = settings.mode || 'habit';
      document.getElementById('animation').checked = settings.animation !== 'false';
    });

  // Save and apply settings
  document.getElementById('save').addEventListener('click', () => {
    const updated = {
      position: document.getElementById('position').value,
      width: document.getElementById('width').value,
      height: document.getElementById('height').value,
      mode: document.getElementById('mode').value,
      animation: document.getElementById('animation').checked.toString()
    };

    browser.storage.sync.set(updated).then(() => {
      browser.tabs.query({}).then(tabs => {
        for (let tab of tabs) {
          browser.tabs.sendMessage(tab.id, {
            action: 'updateSettings',
            settings: updated
          }).catch(() => {}); // Safe to ignore tabs without content script
        }
      });

      window.close();
    });
  });
});
