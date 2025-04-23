// popup.js

document.addEventListener('DOMContentLoaded', function () {
  const ids = ['facebook', 'instagram', 'youtube', 'snapchat'];
  const checkboxes = {};
  ids.forEach(id => {
    checkboxes[id] = document.getElementById(id);
  });

  // Load current settings
  chrome.storage.local.get(['settings'], function (result) {
    const settings = result.settings || {};
    ids.forEach(id => {
      checkboxes[id].checked = !!settings[id];
    });
  });

  // Save settings and reload tab on change
  ids.forEach(id => {
    checkboxes[id].addEventListener('change', function () {
      chrome.storage.local.get(['settings'], function (result) {
        const settings = result.settings || {};
        settings[id] = checkboxes[id].checked;
        chrome.storage.local.set({ settings }, function () {
          // Reload current tab for immediate effect
          chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs[0]) chrome.tabs.reload(tabs[0].id);
          });
        });
      });
    });
  });
});
