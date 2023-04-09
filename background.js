console.log('CleanRead background script loaded');

// ChatGPT API key
function getApiKey() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(['apiKey'], (result) => {
        resolve(result.apiKey);
      });
    });
  }
  

// Function to call the ChatGPT API to process the text
async function processTextWithChatGPT(text) {
    const api_key = await getApiKey();
    console.log('Input Text: ', text)
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${api_key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "model": "gpt-3.5-turbo",
        "messages": [
          { "role": "system", "content": "You are a helpful assistant that summarizes text." },
          { "role": "user", "content": `Refactor this text to make it as concise as possible, without losing information. Use point-form anywhere it makes sense: ${text}` }
        ],
        // "max_tokens": 100,
        // "n": 1,
        // "stop": "\n",
        // "temperature": 0.5,
      }),
    });
  
    if (!response.ok) {
      console.error('API response not OK:', response.status);
      console.log('API Error:', await response.json());
      throw new Error('Failed to process text');
    }
  
    const data = await response.json();
    console.log('Output Text: ', data.choices[0].message.content)
    return data.choices[0].message.content.trim();
  }
  
  

// Add a listener for messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Received message:', request.action);
  
    if (request.action === 'getSettings') {
      chrome.storage.sync.get(['enableExtension'], (result) => {
        console.log('Sending settings:', { enableExtension: result.enableExtension });
        sendResponse({ enableExtension: result.enableExtension });
      });
      return true; // Indicates that the response will be sent asynchronously
    } else if (request.action === 'processText') {
      processTextWithChatGPT(request.text)
        .then((processedText) => {
          sendResponse({ processedText });
        })
        .catch((error) => {
          console.error('Error processing text:', error);
          sendResponse({ error: 'Failed to process text' });
        });
  
      return true; // Indicates that the response will be sent asynchronously
    }
  });
