chrome.webRequest.onCompleted.addListener(
    function(details) {
      if (details.type === 'main_frame') {
        chrome.scripting.executeScript({
          target: {tabId: details.tabId},
          files: ['content.js']
        });
      }
    },
    {urls: ["<all_urls>"]}
  );
  
  chrome.storage.local.set({data: {}});
  
  function saveData(key, value) {
    chrome.storage.local.get(['data'], function(result) {
      let data = result.data || {};
      data[key] = value;
      chrome.storage.local.set({data: data});
    });
  }
  