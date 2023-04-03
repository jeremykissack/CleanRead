// Replace this with your actual ChatGPT API key
const apiKey = 'your_api_key_here';

// Function to call the ChatGPT API to process the text
async function processTextWithChatGPT(text) {
  const messages = [
    { role: 'system', content: 'Please help improve the grammar and conciseness of the following text:' },
    { role: 'user', content: text },
  ];

  const response = await fetch('https://api.openai.com/v1/engines/gpt-3.5-turbo/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: messages,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

// Add a listener for messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'processText') {
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
