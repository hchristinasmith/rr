/**
 * UNREEL! EXTENSION BACKGROUND SCRIPT
 * =================================
 * This script runs in the background and manages the extension's settings.
 * It initializes default settings when the extension is installed and
 * ensures all required settings exist.
 */

/**
 * DEFAULT SETTINGS CONFIGURATION
 * ===========================
 * Define the default settings for all platforms.
 * These settings are used when the extension is first installed or when
 * missing settings need to be initialized.
 * 
 * PSEUDOCODE:
 * 1. Define default state for each platform (enabled by default)
 */
const defaultSettings = {
  // Main platform toggles (all enabled by default)
  facebook: true,
  instagram: true,
  youtube: true,
  snapchat: true,
  
  // Initialize detailed options for each platform (all enabled by default)
  facebookOptions: {
    stories: true,  // Facebook Stories enabled by default
    reels: true     // Facebook Reels enabled by default
  },
  instagramOptions: {
    stories: true,  // Instagram Stories enabled by default
    reels: true     // Instagram Reels enabled by default
  },
  snapchatOptions: {
    stories: true,   // Snapchat Stories enabled by default
    spotlight: true  // Snapchat Spotlight enabled by default
  }
};

/**
 * EXTENSION INSTALLATION/UPDATE HANDLER
 * =================================
 * This event listener runs when the extension is installed or updated.
 * It initializes default settings or ensures all required settings exist.
 * 
 * PSEUDOCODE:
 * 1. Listen for the onInstalled event
 * 2. Get current settings from storage
 * 3. If no settings exist:
 *    a. Initialize with default settings
 * 4. If settings exist but are missing some options:
 *    a. Create a copy of existing settings
 *    b. Check for missing platform options and add them if needed
 *    c. If any updates were made, save the updated settings
 */
chrome.runtime.onInstalled.addListener(() => {
  console.log("UnReel extension installed/updated");
  // Get current settings from storage
  chrome.storage.local.get(['settings'], (result) => {
    // Case 1: No settings exist yet (first installation)
    if (!result.settings) {
      console.log("Initializing default settings", defaultSettings);
      // Save default settings to storage
      chrome.storage.local.set({ settings: defaultSettings });
    } else {
      // Case 2: Settings exist but might be missing some platform toggles (update scenario)
      // Create a copy of existing settings to modify if needed
      const updatedSettings = { ...result.settings };
      let needsUpdate = false;
      
      // Check for missing platform toggles and add them if needed
      Object.keys(defaultSettings).forEach(key => {
        if (updatedSettings[key] === undefined) {
          updatedSettings[key] = defaultSettings[key];
          needsUpdate = true;
        }
      });
      
      // Ensure all detailed options are set to true for each platform
      // This maintains compatibility with content.js while removing UI controls
      // Always set these options regardless of main toggle state to ensure they exist
      updatedSettings.facebookOptions = { stories: true, reels: true };
      updatedSettings.instagramOptions = { stories: true, reels: true };
      updatedSettings.snapchatOptions = { stories: true, spotlight: true };
      
      // Log the updated settings for debugging
      console.log("UnReel: Updated settings:", updatedSettings);
      
      // If any updates were made, save the updated settings
      if (needsUpdate) {
        console.log("Updating settings", updatedSettings);
        chrome.storage.local.set({ settings: updatedSettings });
      }
    }
  });
});

/**
 * TAB UPDATE LISTENER
 * =================
 * This event listener runs when a tab is updated (e.g., when a page loads).
 * It checks if the tab contains a supported platform and logs information.
 * 
 * PSEUDOCODE:
 * 1. Listen for tab update events
 * 2. When a tab completes loading and has a URL:
 *    a. Check if the URL contains any supported platform domains
 *    b. If it's a supported platform, log information
 *    c. (Optional) Could execute content script here if needed
 */
// Listen for tab updates to refresh content script
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Only process when page has completely loaded and has a URL
  if (changeInfo.status === 'complete' && tab.url) {
    // List of supported platform domains
    const supportedDomains = [
      'facebook.com',   // Facebook
      'instagram.com',  // Instagram
      'youtube.com',    // YouTube
      'snapchat.com'    // Snapchat
    ];
    
    // Check if the URL contains any of our supported domains
    const isSupported = supportedDomains.some(domain => tab.url.includes(domain));
    
    // If this is a supported platform, log information
    if (isSupported) {
      console.log("Supported site loaded, ensuring content script is running", tab.url);
      // Note: Content script injection is handled by the manifest.json
      // We could execute the script here if needed for special cases
    }
  }
});

