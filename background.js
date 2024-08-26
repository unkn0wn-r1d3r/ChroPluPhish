// ======================
// SECTION: Web Request Listener
// ======================

chrome.webRequest.onCompleted.addListener(
  function(details) {
    if (details.type === 'main_frame' && details.tabId !== -1) {
      chrome.tabs.get(details.tabId, function(tab) {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
          return;
        }
        chrome.tabs.executeScript(tab.id, {file: 'content.js'}, function() {
          if (chrome.runtime.lastError) {
            console.error('Script injection failed: ' + chrome.runtime.lastError.message);
          }
        });
      });
    }
  },
  {urls: ["<all_urls>"]}
);

// ======================
// SECTION: Data Storage
// ======================

// Initialize storage
chrome.storage.local.set({data: {}});

// Function to save data
function saveData(key, value) {
  chrome.storage.local.get(['data'], function(result) {
    let data = result.data || {};
    data[key] = value;
    chrome.storage.local.set({data: data});
  });
}

// ======================
// SECTION: Message Listener
// ======================
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action === 'saveData') {
      saveData(sender.tab.url, request.data);
    } else if (request.action === 'getCookies') {
      chrome.cookies.getAll({url: sender.tab.url}, function(cookies) {
        sendResponse(cookies);
      });
      return true;  // Will respond asynchronously
    }
  }
);