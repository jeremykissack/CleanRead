document.addEventListener('DOMContentLoaded', () => {
    const enableExtensionCheckbox = document.getElementById('enableExtension');
  
    // Load the saved settings
    chrome.storage.sync.get(['enableExtension'], (result) => {
      enableExtensionCheckbox.checked = result.enableExtension;
    });
  
    // Save the settings when the checkbox state changes
    enableExtensionCheckbox.addEventListener('change', () => {
      chrome.storage.sync.set({ enableExtension: enableExtensionCheckbox.checked });
    });
  });
  