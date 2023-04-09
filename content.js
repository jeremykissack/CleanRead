function createCleanReadButton() {
    const button = document.createElement('button');
    button.innerText = 'CleanRead';
    button.style.marginLeft = '10px';
    button.style.backgroundColor = '#0079d3';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '3px';
    button.style.padding = '5px 10px';
    button.style.cursor = 'pointer';
    button.style.fontSize = '14px';
    return button;
  }
  
  function processText(element) {
    const originalText = element.innerText;
    chrome.runtime.sendMessage({ action: 'processText', text: originalText }, (response) => {
      if (response.error) {
        console.error('Failed to process text:', response.error);
      } else {
        element.innerText = response.processedText;
      }
    });
  }
  
  function highlightText(element) {
    element.style.backgroundColor = '#ffff99'; // You can change the color to your preference
  }
  
  function removeHighlight(element) {
    element.style.backgroundColor = '';
  }
  
  function insertCleanReadButton() {
    const MIN_TEXT_LENGTH = 100; // You can adjust this value to target larger or smaller text fields
    const allElements = document.getElementsByTagName('*');
  
    for (let element of allElements) {
      if (element.textContent.length >= MIN_TEXT_LENGTH && element.childElementCount === 0) {
        const cleanReadButton = createCleanReadButton();
        cleanReadButton.addEventListener('click', () => processText(element));
        cleanReadButton.addEventListener('mouseover', () => highlightText(element));
        cleanReadButton.addEventListener('mouseout', () => removeHighlight(element));
        element.parentNode.insertBefore(cleanReadButton, element.nextSibling);
      }
    }
  }
  
  chrome.runtime.sendMessage({ action: 'getSettings' }, (response) => {
    console.log('Settings received:', response);
  
    if (response.enableExtension) {
      insertCleanReadButton();
    }
  });
  