// ======================
// SECTION: Data Display
// ======================

function displayData(data) {
  let formData = document.getElementById('formData');
  let csrfTokens = document.getElementById('csrfTokens');
  let accessTokens = document.getElementById('accessTokens');
  let cookiesData = document.getElementById('cookies');

  // Display form data
  let formHtml = '';
  for (let url in data) {
    if (typeof data[url] === 'object' && !Array.isArray(data[url])) {
      formHtml += `Action URL: ${url}\n`;
      formHtml += 'Input Fields:\n';
      for (let field in data[url]) {
        formHtml += `  ${field}: ${data[url][field]}\n`;
      }
      formHtml += '\n';
    }
  }
  formData.textContent = formHtml || 'No form data found.';

  // Display CSRF tokens
  if (data.csrf_token) {
    csrfTokens.textContent = `CSRF Token: ${data.csrf_token}`;
  } else {
    csrfTokens.textContent = 'No CSRF token found.';
  }

  // Display Access tokens with highlighting
  if (data.access_token) {
    let accessTokenHtml = `Access Token: <span class="highlight">${data.access_token}</span>`;
    accessTokens.innerHTML = accessTokenHtml;
  } else {
    accessTokens.textContent = 'No access token found.';
  }

  // Display Cookies
  if (data.cookies && data.cookies.length > 0) {
    let cookiesHtml = '';
    data.cookies.forEach(cookie => {
      let cookieHtml = `${cookie.name}: `;
      if (cookie.name.toLowerCase().includes('session') || cookie.name.toLowerCase().includes('token')) {
        cookieHtml += `<span class="highlight">${cookie.value}</span>`;
      } else {
        cookieHtml += cookie.value;
      }
      cookiesHtml += cookieHtml + '\n';
    });
    cookiesData.innerHTML = cookiesHtml;
  } else {
    cookiesData.textContent = 'No cookies found.';
  }
}

chrome.storage.local.get(['data'], function(result) {
  let data = result.data || {};
  displayData(data);
});

// ======================
// SECTION: Export Functionality
// ======================

document.getElementById('exportCookieNames').addEventListener('click', function() {
  chrome.storage.local.get(['data'], function(result) {
    let data = result.data || {};
    if (data.cookies && data.cookies.length > 0) {
      let cookieNames = data.cookies.map(cookie => cookie.name).join('\n');
      downloadFile('cookie_names.txt', cookieNames);
    } else {
      alert('No cookies found to export.');
    }
  });
});

document.getElementById('exportFullCookies').addEventListener('click', function() {
  chrome.storage.local.get(['data'], function(result) {
    let data = result.data || {};
    if (data.cookies && data.cookies.length > 0) {
      let cookiesData = JSON.stringify(data.cookies, null, 2);
      downloadFile('full_cookies.json', cookiesData);
    } else {
      alert('No cookies found to export.');
    }
  });
});

function downloadFile(filename, text) {
  let element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

// ======================
// SECTION: Copy All Functionality
// ======================

document.getElementById('copyAllButton').addEventListener('click', function() {
  chrome.storage.local.get(['data'], function(result) {
    let data = result.data || {};
    let textToCopy = JSON.stringify(data, null, 2);
    
    navigator.clipboard.writeText(textToCopy).then(function() {
      alert('All data copied to clipboard!');
    }, function(err) {
      console.error('Could not copy text: ', err);
    });
  });
});