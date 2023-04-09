document.getElementById('save').addEventListener('click', () => {
    const apiKey = document.getElementById('apiKey').value;
    const enableExtension = document.getElementById('enableExtension').checked;
  
    chrome.storage.sync.set({ apiKey, enableExtension }, () => {
      console.log('Settings saved:', { apiKey, enableExtension });
    });
  });
  
  // Load saved settings
  chrome.storage.sync.get(['apiKey', 'enableExtension'], (result) => {
    document.getElementById('apiKey').value = result.apiKey || '';
    document.getElementById('enableExtension').checked = result.enableExtension || false;
    console.log('Settings loaded: apiKey =', result.apiKey, 'enableExtension =', result.enableExtension);
  });
  