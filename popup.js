chrome.storage.local.get(['data'], function(result) {
    let data = result.data || {};
    let results = document.getElementById('results');
    results.textContent = JSON.stringify(data, null, 2);
  });
  