function processText(text) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ action: 'processText', text }, (response) => {
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response.processedText);
        }
      });
    });
  }
  
  async function processPageText(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      try {
        node.textContent = await processText(node.textContent);
      } catch (error) {
        console.error('Error processing text:', error);
      }
    } else {
      for (let child of node.childNodes) {
        await processPageText(child);
      }
    }
  }
  
  // Check if the extension is enabled before processing the text
  chrome.storage.sync.get(['enableExtension'], async (result) => {
    if (result.enableExtension) {
      await processPageText(document.body);
    }
  });
  