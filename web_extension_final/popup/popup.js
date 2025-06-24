// popup.js — Updated to handle API key properly
document.addEventListener('DOMContentLoaded', () => {
  // Get elements
  const llmCheckbox = document.getElementById('llmEnabled');
  const apiKeyContainer = document.getElementById('apiKeyContainer');
  const modeSelect = document.getElementById('mode');
  const apiKeyInput = document.getElementById('apiKey');

  // Load settings
  browser.storage.sync.get([
    'position', 'width', 'height', 'mode',
    'animation', 'llmEnabled', 'apiKey'
  ]).then(settings => {
    // Existing settings...
    llmCheckbox.checked = settings.llmEnabled === 'true';
    apiKeyInput.value = settings.apiKey || '';
    apiKeyContainer.style.display = llmCheckbox.checked ? 'block' : 'none';

    // Initialize mode-dependent states
    llmCheckbox.disabled = settings.mode !== 'advanced';
  });

  // Toggle API key visibility
  llmCheckbox.addEventListener('change', () => {
    apiKeyContainer.style.display = llmCheckbox.checked ? 'block' : 'none';
  });

  // Handle mode changes
  modeSelect.addEventListener('change', () => {
    const isAdvanced = modeSelect.value === 'advanced';
    llmCheckbox.disabled = !isAdvanced;
    if (!isAdvanced) {
      llmCheckbox.checked = false;
      apiKeyContainer.style.display = 'none';
    }
  });

  // Save settings
  document.getElementById('save').addEventListener('click', () => {
    const updated = {
      position: document.getElementById('position').value,
      width: document.getElementById('width').value,
      height: document.getElementById('height').value,
      mode: modeSelect.value,
      animation: document.getElementById('animation').checked.toString(),
      llmEnabled: llmCheckbox.checked.toString(),
      apiKey: apiKeyInput.value
    };

    // Validate before saving
    if (updated.llmEnabled === 'true' && !updated.apiKey) {
      alert('Please enter a valid API key to enable AI features');
      apiKeyInput.focus();
      return;
    }

    // Save and send to content script
    browser.storage.sync.set(updated).then(() => {
      // Send to all tabs
      browser.tabs.query({}).then(tabs => {
        tabs.forEach(tab => {
          browser.tabs.sendMessage(tab.id, {
            action: 'updateSettings',
            settings: updated
          }).catch(() => { });
        });
      });
      window.close();
    });
  });
});