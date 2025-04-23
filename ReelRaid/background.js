// background.js
const defaultSettings = {
  facebook: true,
  instagram: true,
  youtube: true,
  snapchat: true
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['settings'], (result) => {
    if (!result.settings) {
      chrome.storage.local.set({ settings: defaultSettings });
    }
  });
});

