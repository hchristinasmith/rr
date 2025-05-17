/**
 * UNREEL! EXTENSION POPUP LOGIC
 * ===========================
 * This file handles the user interface for the UnReel extension popup.
 * It manages the platform toggles, detailed options, and user interactions.
 * 
 * MAIN ARCHITECTURE:
 * 1. Define data structure for platforms and their content types
 * 2. Initialize UI elements and references
 * 3. Load saved settings from storage
 * 4. Set up event handlers for user interactions
 * 5. Implement helper functions for UI state management
 * 6. Save settings when user makes changes
 */

// Wait for DOM to be fully loaded before initializing the popup
document.addEventListener('DOMContentLoaded', function () {
  /**
   * DATA STRUCTURE INITIALIZATION
   * ==========================
   * Define the core data structure that represents all supported platforms
   * and their respective content types. This makes the code more maintainable
   * and easier to extend when adding new platforms.
   * 
   * PSEUDOCODE:
   * 1. Define platforms object with content types for each platform
   * 2. Extract platform IDs for iteration
   * 3. Initialize empty objects to store UI element references
   * 4. Set up click tracking for double-click detection
   */
  // Define platforms without granular content types
  const platforms = {
    facebook: [],     // Facebook no longer has granular options
    instagram: [],    // Instagram no longer has granular options
    snapchat: [],     // Snapchat no longer has granular options
    youtube: []       // YouTube doesn't have granular options
  };
  
  // Get array of platform IDs for iteration
  const ids = Object.keys(platforms);
  
  // Initialize empty objects to store references to UI elements
  const checkboxes = {};        // Main platform checkboxes
  const icons = {};             // Platform icons

  /**
   * UI ELEMENT INITIALIZATION
   * ======================
   * Find and store references to all UI elements needed for the popup.
   * This includes checkboxes, icons, detail panels, and option elements.
   * 
   * PSEUDOCODE:
   * 1. For each platform ID:
   *    a. Get references to main checkbox and icon
   *    b. If platform has detailed options:
   *       i. Get reference to details panel and done button
   *       ii. For each option type, get reference to its checkbox
   * 2. Create shorthand variables for backward compatibility
   */
  // Initialize checkboxes and icons
  ids.forEach(id => {
    // Get main checkbox and icon for this platform
    checkboxes[id] = document.getElementById(id);
    icons[id] = document.querySelector(`#${id} + .platform-icon .icon`);
  });

  /**
   * ICON APPEARANCE MANAGEMENT
   * =======================
   * Function to update icon appearance based on checkbox state.
   * Note: Icon appearance is now handled by CSS and remains unchanged when clicked.
   * This function is kept for potential future use.
   * 
   * PSEUDOCODE:
   * 1. Function takes platform ID and checked state
   * 2. No action needed as CSS handles appearance
   */
  function updateIconAppearance(id, isChecked) {
    // Ensure the checkbox state is reflected in the UI
    checkboxes[id].checked = isChecked;
    
    // Get the platform card and icon elements
    let card;
    let icon;
    
    if (id === 'youtube') {
      card = document.querySelector(`label[for="${id}"]`);
    } else {
      card = document.querySelector(`#${id}-wrapper .platform-card`);
    }
    
    if (card) {
      // Toggle active class on the card
      if (isChecked) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
      
      // Get the platform icon
      icon = card.querySelector('.platform-icon');
      
      if (icon) {
        // Toggle shield-active class on the icon
        if (isChecked) {
          icon.classList.add('shield-active');
        } else {
          icon.classList.remove('shield-active');
        }
      }
    }
  }

  /**
   * LOAD SAVED SETTINGS
   * =================
   * Retrieve user settings from Chrome storage and update UI accordingly.
   * 
   * PSEUDOCODE:
   * 1. Get settings from Chrome storage
   * 2. For each platform:
   *    a. Check if it's enabled (default to true if not set)
   *    b. Update checkbox state
   *    c. Update icon appearance
   *    d. If platform has detailed options:
   *       i. Get platform-specific options
   *       ii. Update each option checkbox based on saved state
   */
  // Load current settings from Chrome storage
  chrome.storage.local.get(['settings'], function (result) {
    const settings = result.settings || {};
    
    // Update checkboxes based on saved settings
    ids.forEach(id => {
      // Default to true if setting not explicitly set to false
      const isChecked = settings[id] !== false; 
      // Update main checkbox state
      checkboxes[id].checked = isChecked;
      // Update icon appearance with shield classes
      updateIconAppearance(id, isChecked); 
    });
  });

  /**
   * PLATFORM CARD CLICK HANDLER SETUP
   * ==============================
   * Sets up click handling for platform cards, including double-click detection.
   * Single click toggles the main checkbox, double click shows detailed options.
   * 
   * PSEUDOCODE:
   * 1. Initialize click tracking state for the platform
   * 2. Get reference to the platform card element
   * 3. Add click event listener that:
   *    a. Ignores direct checkbox clicks
   *    b. Prevents event propagation
   *    c. Tracks click count with reset timer
   *    d. For first click:
   *       i. Set timer to toggle checkbox after delay
   *    e. For second click (double-click):
   *       i. Cancel single-click timer
   *       ii. Show detailed options panel
   */
  function setupPlatformCard(platformId) {
    // Get reference to the platform card element
    let card;
    
    // YouTube doesn't have a wrapper
    if (platformId === 'youtube') {
      card = document.querySelector(`label[for="${platformId}"]`);
    } else {
      card = document.querySelector(`#${platformId}-wrapper .platform-card`);
    }
    
    if (!card) {
      console.error(`Card not found for platform: ${platformId}`);
      return;
    }
    
    // Add click event listener
    card.addEventListener('click', function(e) {
      // Don't interfere with direct checkbox clicks
      if (e.target.type === 'checkbox') {
        return;
      }
      
      // Stop event propagation to prevent unintended interactions
      e.preventDefault();
      e.stopPropagation();
      
      // Get the checkbox
      const checkbox = document.getElementById(platformId);
      
      // Toggle checkbox checked state
      checkbox.checked = !checkbox.checked;
      
      // Force update the icon appearance
      updateIconAppearance(platformId, checkbox.checked);
      
      // Save settings
      saveSettings();
    });
  }

  /**
   * PLATFORM CARDS AND DONE BUTTONS SETUP
   * =================================
   * Set up the platform cards for click handling and the "Done" buttons
   * for closing the detailed options panels.
   * 
   * PSEUDOCODE:
   * 1. For each platform that has detailed options:
   *    a. Set up the platform card for click handling
   *    b. Add click event listener to the "Done" button that:
   *       i. Hides the detailed options panel
   *       ii. Saves the current settings
   */
  // Setup platform cards dynamically
  ids.forEach(id => {
    // Set up click handling for the platform card
    setupPlatformCard(id);
  });

  /**
   * SAVE SETTINGS FUNCTION
   * ===================
   * Saves all current settings to Chrome storage and reloads the active tab
   * to apply changes immediately.
   * 
   * PSEUDOCODE:
   * 1. Get existing settings from Chrome storage
   * 2. For each platform:
   *    a. If platform has detailed options:
   *       i. Create options object for this platform
   *       ii. Save state of each option checkbox
   *       iii. Determine if any option is active
   *       iv. Set main platform state based on options and main checkbox
   *       v. Update main checkbox UI to reflect actual state
   *    b. If platform doesn't have detailed options:
   *       i. Simply save the state of the main checkbox
   * 3. Save updated settings to Chrome storage
   * 4. Reload current tab to apply changes immediately
   */
  // Save all settings
  function saveSettings() {
    chrome.storage.local.get(['settings'], function (result) {
      // Get existing settings or create empty object
      const settings = result.settings || {};
      
      // Process each platform - save the main checkbox state
      ids.forEach(id => {
        settings[id] = checkboxes[id].checked;
        
        // Add detailed options for compatibility with content.js
        // Even though we no longer have UI controls for them
        if (id === 'facebook' && settings[id]) {
          settings.facebookOptions = { stories: true, reels: true };
        } else if (id === 'instagram' && settings[id]) {
          settings.instagramOptions = { stories: true, reels: true };
        } else if (id === 'snapchat' && settings[id]) {
          settings.snapchatOptions = { stories: true, spotlight: true };
        }
      });
      
      // Save updated settings to Chrome storage
      chrome.storage.local.set({ settings }, function () {
        // Reload current tab for immediate effect
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          if (tabs[0]) chrome.tabs.reload(tabs[0].id);
        });
      });
    });
  }

  /**
   * CHECKBOX CHANGE EVENT HANDLERS
   * ===========================
   * Set up event handlers for checkbox changes to save settings when changed.
   * 
   * PSEUDOCODE:
   * 1. For YouTube (no detailed options):
   *    a. Add change event listener that:
   *       i. Updates icon appearance
   *       ii. Saves settings
   * 
   * 2. For platforms with detailed options (Facebook, Instagram, Snapchat):
   *    a. Add change event listener that saves settings
   */
  // Add change event handlers for all platform checkboxes
  ['youtube', 'facebook', 'instagram', 'snapchat'].forEach(id => {
    checkboxes[id].addEventListener('change', function () {
      // Get current checked state
      const isChecked = this.checked;
      // Update icon appearance
      updateIconAppearance(id, isChecked);
      // Save settings and reload tab
      saveSettings();
    });
  });



  // End of DOMContentLoaded event handler
});
