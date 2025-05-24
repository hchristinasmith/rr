/**
 * INITIALIZATION SECTION
 * ===================
 * This section sets up the browser API compatibility and logs initial debug information.
 * 
 * PSEUDOCODE:
 * 1. Check if we're running in Firefox/Safari (browser API) or Chrome
 * 2. Set browserApi to the appropriate API object
 * 3. Log that the content script has loaded
 */

// Fallback API selector for Safari/Firefox compatibility
const browserApi = typeof browser !== "undefined" ? browser : chrome;

// Debug logging
console.log("UNreel content script loaded");

/* ----------------------------- FACEBOOK SECTION ----------------------------- */

/**
 * FACEBOOK REELS BLOCKING
 * ======================
 * This function hides Facebook Reels elements from the page.
 * 
 * PSEUDOCODE:
 * 1. Define an array of CSS selectors that target Reels elements
 * 2. For each selector in the array:
 *    a. Find all matching elements in the DOM
 *    b. For each matching element:
 *       i. Log that we're hiding it
 *       ii. Set its display style to 'none' to hide it
 */
function hideFacebookReels() {
  console.log("UnReel: hideFacebookReels function called");
  // Array of CSS selectors targeting various Reels UI elements
  const reelsSelectors = [
    // Navigation and menu items
    'a[aria-label="Reels"]',
    'div[aria-label="Reels"]',
    'div[data-testid="reels_menu_item"]',
    'a[href*="/reel/"]',
    'a[href*="/reels/"]',
    
    // Text-based selectors
    'div:has(> span:contains("Reels"))',
    'a:has(> span:contains("Reels"))',
    'div[aria-label*="reel" i]',
    'span[aria-label*="reel" i]',
    
    // New Facebook UI selectors
    'div[role="button"][aria-label*="reel" i]',
    'div[role="tab"][aria-label*="reel" i]',
    'div[role="navigation"] a[href*="/reel"]',
    'div[role="navigation"] a[href*="/reels"]',
    
    // Feed items
    'div[data-pagelet*="FeedUnit"] div:has(a[href*="/reel/"])',
    'div[data-pagelet*="FeedUnit"] div:has(a[href*="/reels/"])',
    'div[data-pagelet="Feed"] div:has(a[href*="/reel/"])',
    'div[data-pagelet="Feed"] div:has(a[href*="/reels/"])',
    
    // Sidebar items
    'div[role="complementary"] a[href*="/reel"]',
    'div[role="complementary"] a[href*="/reels"]',
  ];

  let totalHidden = 0;
  // Process each selector
  reelsSelectors.forEach(selector => {
    try {
      // Find all elements matching the current selector
      const elements = document.querySelectorAll(selector);
      console.log(`UnReel: Found ${elements.length} elements matching selector: ${selector}`);
      
      elements.forEach(el => {
        // Try to find a parent container for better hiding
        const parent = el.closest('div[role="article"]') || 
                      el.closest('div[data-pagelet*="FeedUnit"]') || 
                      el.closest('div[role="complementary"]') || 
                      el;
        
        // Hide the element by setting display to none
        parent.style.display = 'none';
        totalHidden++;
      });
    } catch (error) {
      console.log(`UnReel: Error with selector ${selector}:`, error);
    }
  });
  
  console.log(`UnReel: Total Facebook Reels elements hidden: ${totalHidden}`);
}

/**
 * FACEBOOK STORIES BLOCKING
 * ======================
 * This function hides Facebook Stories elements from the page.
 * 
 * PSEUDOCODE:
 * 1. Define an array of CSS selectors that target Stories elements
 * 2. For each selector in the array:
 *    a. Try to find all matching elements in the DOM (with error handling)
 *    b. For each matching element:
 *       i. Log that we're hiding it
 *       ii. Set its display style to 'none' to hide it
 *    c. If an error occurs, log it and continue with the next selector
 */
function blockFacebookStories() {
  console.log("UnReel: blockFacebookStories function called");
  // Array of CSS selectors targeting various Stories UI elements
  const storiesSelectors = [
    // Main Stories containers
    '[aria-label="Stories"]',
    'div[role="region"][aria-label*="Stories"]',
    'div[data-pagelet="Stories"]',
    
    // Text-based selectors
    'div:has(> span:contains("Stories"))',
    'a:has(> span:contains("Stories"))',
    
    // Visual elements (stories cards and containers)
    'div[role="complementary"] div[data-visualcompletion="ignore-dynamic"]',
    'div[role="main"] > div > div > div > div > div > div[data-visualcompletion="ignore-dynamic"]:first-child',
    'div[style*="border-radius: 8px"][style*="overflow: hidden"]:has(div[role="button"])',
    'div[data-visualcompletion="ignore"] div[role="button"][tabindex="0"]',
    
    // New Facebook UI selectors
    'div[role="main"] div[style*="max-height"][style*="padding-top"]',
    'div[role="main"] div[style*="border-radius"][style*="margin-bottom"]',
    'div[role="main"] div[style*="height: 200px"]',
    'div[role="main"] div[style*="height: 250px"]',
    
    // Create story buttons
    'div[role="button"][aria-label*="Create"][aria-label*="story" i]',
    'div[role="button"][aria-label*="Add"][aria-label*="story" i]',
  ];

  let totalHidden = 0;
  // Process each selector with error handling
  storiesSelectors.forEach(selector => {
    try {
      // Find all elements matching the current selector
      const elements = document.querySelectorAll(selector);
      console.log(`UnReel: Found ${elements.length} elements matching selector: ${selector}`);
      
      elements.forEach(story => {
        // Try to find the main stories container for better hiding
        const container = story.closest('div[data-pagelet="Stories"]') ||
                         story.closest('div[role="region"][aria-label*="Stories"]') ||
                         story;
        
        // Hide the element by setting display to none
        container.style.display = 'none';
        totalHidden++;
      });
    } catch (error) {
      // Log any errors but continue processing other selectors
      console.log(`UnReel: Error with selector ${selector}:`, error);
    }
  });
  
  console.log(`UnReel: Total Facebook Stories elements hidden: ${totalHidden}`);
}

/**
 * FACEBOOK OBSERVER
 * ==============
 * This function sets up a MutationObserver to continuously monitor for
 * and block Facebook Reels and Stories as the DOM changes.
 * 
 * PSEUDOCODE:
 * 1. Call hideFacebookReels() and blockFacebookStories() once immediately to hide existing elements
 * 2. Create a new MutationObserver that calls both functions whenever DOM changes
 * 3. Start observing the entire document body for any changes to its children or subtree
 */
function observeFacebookReelsAndStories() {
  console.log("UnReel: observeFacebookReelsAndStories function called");
  // Block any existing Facebook elements immediately
  hideFacebookReels();
  blockFacebookStories();
  
  // Create a MutationObserver that will call both blocking functions whenever DOM changes
  const observer = new MutationObserver(() => {
    hideFacebookReels();
    blockFacebookStories();
  });
  
  // Start observing the entire document body for any changes
  observer.observe(document.body, { childList: true, subtree: true });
  console.log("UnReel: Facebook observer set up successfully");
}

/* ----------------------------- INSTAGRAM SECTION ----------------------------- */

/**
 * INSTAGRAM REELS BLOCKING
 * =======================
 * This function identifies and hides Instagram Reels elements.
 * 
 * PSEUDOCODE:
 * 1. Define an array of CSS selectors targeting Reels UI elements
 * 2. For each selector:
 *    a. Try to find all matching elements in the DOM (with error handling)
 *    b. For each matching element:
 *       i. Find its parent container (or use the element itself if no parent found)
 *       ii. Log that we're hiding it
 *       iii. Set its display style to 'none' to hide it
 *    c. If an error occurs, log it and continue with the next selector
 */
function blockInstagramReels() {
  console.log("UnReel: blockInstagramReels function called");
  // Array of CSS selectors targeting various Instagram Reels UI elements
  const reelsSelectors = [
    'a[href="/reels/"]',
    'a[href*="/reels"]',
    'a[role="link"][href*="/reels"]',
    'a[role="tab"][href*="/reels"]',
    'svg[aria-label*="Reels"]',
    'div[role="button"][aria-label*="reel" i]',
    'span[aria-label*="reel" i]',
    'div[role="button"][tabindex="0"][style*="transform"]',
    'div[data-visualcompletion="id-Reels"]',
    'div[data-media-type="Reels"]',
    'div[style*="height"][style*="position"]:has(span:contains("Reels"))',
    'div[style*="height"][style*="position"]:has(div[role="button"][tabindex="0"][style*="transform"])',
    'nav a[href*="/reels"]',
    'div[role="tablist"] a[href*="/reels"]'
  ];

  // Process each selector with error handling
  reelsSelectors.forEach(selector => {
    try {
      // Find all elements matching the current selector
      document.querySelectorAll(selector).forEach(el => {
        // Try to find a parent container, or use the element itself if no parent found
        // This helps hide the entire Reels container, not just the button/link
        const parent = el.closest('div[style*="height"][style*="position"]') || el;
        console.log("Hiding Instagram Reels element:", parent);
        // Hide the element by setting display to none
        parent.style.display = 'none';
      });
    } catch (error) {
      // Log any errors but continue processing other selectors
      console.log("Error with Instagram selector:", selector, error);
    }
  });
}

/**
 * INSTAGRAM REELS OBSERVER
 * ======================
 * This function sets up a MutationObserver to continuously monitor for
 * and block Instagram Reels as the DOM changes (e.g., when scrolling).
 * 
 * PSEUDOCODE:
 * 1. Call blockInstagramReels() once immediately to hide existing elements
 * 2. Create a new MutationObserver that calls blockInstagramReels() whenever DOM changes
 * 3. Start observing the entire document body for any changes to its children or subtree
 */
function observeInstagramReels() {
  console.log("UnReel: observeInstagramReels function called");
  // Block any existing Reels elements immediately
  blockInstagramReels();
  
  // Create a MutationObserver that will call blockInstagramReels() whenever DOM changes
  const observer = new MutationObserver(() => blockInstagramReels());
  
  // Start observing the entire document body for any changes
  // childList: true - observe additions/removals of child elements
  // subtree: true - observe changes to descendants as well
  observer.observe(document.body, { childList: true, subtree: true });
}

/* ----------------------------- YOUTUBE SECTION ----------------------------- */

/**
 * YOUTUBE SHORTS BLOCKING
 * =====================
 * This function identifies and hides YouTube Shorts elements from the page.
 * 
 * PSEUDOCODE:
 * 1. Define an array of CSS selectors targeting Shorts UI elements
 * 2. For each selector:
 *    a. Find all matching elements in the DOM
 *    b. For each matching element:
 *       i. Find its parent container (or use the element itself if no parent found)
 *          - We look for specific YouTube component parents to hide the entire section
 *       ii. Log that we're hiding it
 *       iii. Set its display style to 'none' to hide it
 */
function hideShortsElements() {
  console.log("UnReel: hideShortsElements function called");
  // Array of CSS selectors targeting various YouTube Shorts UI elements
  const shortsSelectors = [
    'ytd-rich-section-renderer[section-identifier="shorts-shelf"]',  // Shorts shelf in home feed
    'ytd-reel-shelf-renderer',                                      // Alternative shorts shelf
    'a[href^="/shorts"]',                                         // Any link to shorts
    '[title="Shorts"]',                                           // Elements with Shorts title
    '[aria-label="Shorts"]',                                      // Elements with Shorts aria-label
  ];

  // Process each selector
  shortsSelectors.forEach(selector => {
    // Find all elements matching the current selector
    document.querySelectorAll(selector).forEach(el => {
      // Try to find a parent container that is a YouTube component, or use the element itself
      // This helps hide the entire Shorts section, not just the button/link
      const parent = el.closest(
        'ytd-rich-section-renderer, ytd-reel-shelf-renderer, ytd-item-section-renderer, ytd-guide-entry-renderer, ytd-mini-guide-entry-renderer'
      ) || el;
      console.log("Hiding YouTube Shorts element: ", parent);
      // Hide the element by setting display to none
      parent.style.display = 'none';
    });
  });
}

/**
 * YOUTUBE SHORTS OBSERVER
 * =====================
 * This function sets up a MutationObserver to continuously monitor for
 * and block YouTube Shorts as the DOM changes (e.g., when navigating or scrolling).
 * 
 * PSEUDOCODE:
 * 1. Call hideShortsElements() once immediately to hide existing elements
 * 2. Create a new MutationObserver that calls hideShortsElements() whenever DOM changes
 * 3. Start observing the entire document body for any changes to its children or subtree
 */
function observeAndBlockYouTubeShorts() {
  console.log("UnReel: observeAndBlockYouTubeShorts function called");
  // Block any existing Shorts elements immediately
  hideShortsElements();
  
  // Create a MutationObserver that will call hideShortsElements() whenever DOM changes
  const observer = new MutationObserver(() => hideShortsElements());
  
  // Start observing the entire document body for any changes
  observer.observe(document.body, { childList: true, subtree: true });
}


/**
 * YOUTUBE ENDSCREEN OVERLAY BLOCKING
 * ===============================
 * This function prevents the "Up Next" and endscreen overlay elements from appearing
 * when a YouTube video ends.
 * 
 * PSEUDOCODE:
 * 1. Define an inner function hideEndscreen() that:
 *    a. Lists CSS selectors for endscreen elements
 *    b. Finds and hides all matching elements
 * 
 * 2. Define an inner function attachToVideoEnd() that:
 *    a. Finds the main video element
 *    b. If video exists and isn't already processed:
 *       i. Mark it as processed to avoid duplicate event listeners
 *       ii. Add an 'ended' event listener that calls hideEndscreen()
 * 
 * 3. Set up a MutationObserver to watch for DOM changes and:
 *    a. Call attachToVideoEnd() to catch any new videos
 *    b. Call hideEndscreen() to hide any new overlay elements
 * 
 * 4. Start the observer on the document body
 * 
 * 5. Run the initial functions once to handle existing elements
 */
function blockYouTubeEndscreenOverlay() {
  console.log("UNREEL!: blockYouTubeEndscreenOverlay function activated");

  /**
   * Inner function to hide all endscreen elements
   */
  function hideEndscreen() {
    // CSS selectors targeting various YouTube endscreen UI elements
    const selectors = [
      '.ytp-endscreen-content',     // Main endscreen content container
      '.ytp-ce-element',            // Individual endscreen elements
      '.ytp-upnext',                // "Up Next" overlay
      '.ytp-cards-teaser',          // Cards teaser button
      '.ytp-ce-channel',            // Channel recommendation
      '.ytp-ce-video',              // Video recommendation
      '.ytp-ce-element-show'        // Any visible endscreen element
    ];

    // Process each selector
    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        // Hide the element by setting display to none
        el.style.display = 'none';
        console.log("Hiding YouTube endscreen element:", el);
      });
    });
  }

  /**
   * Inner function to attach event listener to video end
   */
  function attachToVideoEnd() {
    // Find the main video element
    const video = document.querySelector('video');
    // Skip if no video found or if we've already processed this video
    if (!video || video._unreelAttached) return;

    // Mark this video as processed to avoid duplicate event listeners
    video._unreelAttached = true;
    // Add event listener for when video ends
    video.addEventListener('ended', () => {
      console.log("YouTube video ended – hiding overlays...");
      hideEndscreen();
    });
  }

  // Watch for video elements or overlays being added
  const observer = new MutationObserver(() => {
    attachToVideoEnd();
    hideEndscreen();
  });

  // Start observing the entire document body for any changes
  observer.observe(document.body, { childList: true, subtree: true });

  // Initial run to handle existing elements
  attachToVideoEnd();
  hideEndscreen();
}

/**
 * YOUTUBE SUGGESTED VIDEOS BLOCKING
 * ============================
 * This function removes the suggested videos that appear in the sidebar
 * when watching a YouTube video.
 * 
 * PSEUDOCODE:
 * 1. Inject CSS once to hide the sidebar (#secondary)
 * 2. Set up a MutationObserver to keep hiding it if YouTube tries to bring it back
 * 3. Handle YouTube SPA navigation properly
 */
function blockYouTubeSuggestedVideos() {
  console.log("UNREEL!: blockYouTubeSuggestedVideos function activated");
  
  // Track if we've already injected the CSS
  let cssInjected = false;
  
  /**
   * Injects CSS to hide the sidebar - only needs to be done once
   */
  function injectCSS() {
    if (cssInjected) return;
    
    const style = document.createElement('style');
    style.id = 'unreel-youtube-suggestions-blocker';
    style.textContent = `
      /* Hide the sidebar completely */
      #secondary { 
        display: none !important; 
      }
      
      /* Make the video player take up more space and center it */
      #primary {
        max-width: 100% !important;
        width: 100% !important;
        margin: 0 auto !important;
        padding: 0 24px !important;
      }
      
      /* Ensure the player container is properly sized */
      #player-container {
        max-width: 100% !important;
        margin: 0 auto !important;
      }
      
      /* Adjust the columns layout */
      #columns {
        max-width: 100% !important;
        margin: 0 auto !important;
        padding: 0 !important;
      }
      
      /* Make the theater mode more effective */
      .ytd-watch-flexy[theater] #player-theater-container {
        min-height: 70vh !important;
        max-height: 85vh !important;
      }
      
      /* Center the video in the page */
      ytd-watch-flexy:not([fullscreen]) #player {
        margin: 0 auto !important;
      }
    `;
    
    document.head.appendChild(style);
    cssInjected = true;
    console.log("UNREEL!: Injected CSS to block YouTube suggested videos");
  }
  
  /**
   * Directly hides the sidebar and adjusts video player positioning
   */
  function hideSidebar() {
    // Only apply on watch pages
    if (!window.location.pathname.includes('/watch')) return;
    
    // Hide the sidebar
    const sidebar = document.querySelector('#secondary');
    if (sidebar && sidebar.style.display !== 'none') {
      sidebar.style.display = 'none';
      console.log("UNREEL!: Hidden sidebar via direct DOM manipulation");
    }
    
    // Adjust the primary container (main content area)
    const primary = document.querySelector('#primary');
    if (primary) {
      primary.style.maxWidth = '100%';
      primary.style.width = '100%';
      primary.style.margin = '0 auto';
      primary.style.padding = '0 24px';
    }
    
    // Adjust the player container
    const playerContainer = document.querySelector('#player-container');
    if (playerContainer) {
      playerContainer.style.maxWidth = '100%';
      playerContainer.style.margin = '0 auto';
    }
    
    // Adjust the columns layout
    const columns = document.querySelector('#columns');
    if (columns) {
      columns.style.maxWidth = '100%';
      columns.style.margin = '0 auto';
      columns.style.padding = '0';
    }
    
    // Center the video player
    const player = document.querySelector('ytd-watch-flexy:not([fullscreen]) #player');
    if (player) {
      player.style.margin = '0 auto';
    }
  }
  
  /**
   * Enables theater mode for the video player
   */
  function enableTheaterMode() {
    // Only apply on watch pages
    if (!window.location.pathname.includes('/watch')) return;
    
    // Find the theater mode button
    const theaterButton = document.querySelector('.ytp-size-button');
    
    // Check if we're already in theater mode
    const isTheaterMode = document.querySelector('ytd-watch-flexy[theater]');
    
    // If not in theater mode and button exists, click it
    if (!isTheaterMode && theaterButton) {
      console.log("UNREEL!: Enabling theater mode");
      theaterButton.click();
    }
  }
  
  /**
   * Handles YouTube navigation events
   */
  function handleNavigation() {
    // Always ensure CSS is injected
    injectCSS();
    
    // Apply immediate hiding
    hideSidebar();
    
    // Enable theater mode
    enableTheaterMode();
    
    // Also apply after a short delay to catch any dynamic content
    setTimeout(() => {
      hideSidebar();
      enableTheaterMode();
    }, 500);
    
    // Try again after video is likely loaded
    setTimeout(() => {
      hideSidebar();
      enableTheaterMode();
    }, 2000);
  }
  
  // Inject CSS immediately
  injectCSS();
  
  // Set up a simple MutationObserver to keep hiding the sidebar if needed
  const observer = new MutationObserver(() => {
    if (window.location.pathname.includes('/watch')) {
      hideSidebar();
    }
  });
  
  // Start observing with a focused configuration
  observer.observe(document.body, { 
    childList: true,  // Watch for changes to the direct children
    subtree: true     // Watch for changes to the entire subtree
  });
  
  // Handle YouTube's SPA navigation
  window.addEventListener('yt-navigate-finish', handleNavigation);
  
  // Initial run
  handleNavigation();
  
  // Also run when the page fully loads
  window.addEventListener('load', handleNavigation);
}

/* ----------------------------- SNAPCHAT SECTION ----------------------------- */

/**
 * SNAPCHAT SPOTLIGHT/STORIES BLOCKING
 * ================================
 * This function identifies and hides Snapchat Spotlight and Stories elements.
 * 
 * PSEUDOCODE:
 * 1. Define an array of CSS selectors targeting Spotlight/Stories UI elements
 * 2. For each selector:
 *    a. Find all matching elements in the DOM
 *    b. For each matching element:
 *       i. Log that we're hiding it
 *       ii. Set its display style to 'none' to hide it
 */
function blockSnapchatReels() {
  console.log("UnReel: blockSnapchatReels function called");
  // Array of CSS selectors targeting various Snapchat content elements
  const selectors = [
    'div.S4e9r.Mn1n9',              // Specific Snapchat class for content containers
    'div[aria-label*="Spotlight"]',  // Spotlight content
    'div[aria-label*="Discover"]',   // Discover section
    'a[href*="spotlight"]',         // Links to Spotlight
    'a[href*="discover"]',          // Links to Discover
    'div:has(video)',                // Any div containing video elements
  ];

  // Process each selector
  selectors.forEach(selector => {
    // Find all elements matching the current selector
    document.querySelectorAll(selector).forEach(el => {
      console.log("Hiding Snapchat Reels element:", el);
      // Hide the element by setting display to none
      el.style.display = 'none';
    });
  });
}

/**
 * SNAPCHAT CONTENT OBSERVER
 * ======================
 * This function sets up a MutationObserver to continuously monitor for
 * and block Snapchat Spotlight/Stories as the DOM changes.
 * 
 * PSEUDOCODE:
 * 1. Call blockSnapchatReels() once immediately to hide existing elements
 * 2. Create a new MutationObserver that calls blockSnapchatReels() whenever DOM changes
 * 3. Start observing the entire document body for any changes to its children or subtree
 */
function observeSnapchatReels() {
  console.log("UnReel: observeSnapchatReels function called");
  // Block any existing Snapchat elements immediately
  blockSnapchatReels();
  
  // Create a MutationObserver that will call blockSnapchatReels() whenever DOM changes
  const observer = new MutationObserver(() => blockSnapchatReels());
  
  // Start observing the entire document body for any changes
  // childList: true - observe additions/removals of child elements
  // subtree: true - observe changes to descendants as well
  observer.observe(document.body, { childList: true, subtree: true });
}

/* ----------------------------- MAIN LOGIC ----------------------------- */

/**
 * MAIN EXTENSION LOGIC
 * ==================
 * This section contains the main logic that runs when the content script is loaded.
 * It retrieves user settings and activates the appropriate blocking functions based on:
 * 1. The current website (detected from URL)
 * 2. User preferences for each platform and content type
 * 
 * PSEUDOCODE:
 * 1. Get user settings from browser storage
 * 2. Determine current website from URL
 * 3. For each supported platform (Facebook, Instagram, YouTube, Snapchat):
 *    a. Check if we're on that platform's website
 *    b. Check if blocking is enabled for that platform
 *    c. For platforms with granular options (Facebook, Instagram, Snapchat):
 *       i. Check which specific content types should be blocked
 *       ii. Set up observers for each enabled content type
 *    d. For platforms without granular options (YouTube):
 *       i. Set up observers for all content types
 */

// Retrieve user settings from browser storage
browserApi.storage.local.get(['settings'], (result) => {
  console.log("UnReel: Retrieved settings from storage:", result);
  // Get settings or use empty object as fallback
  const settings = result.settings || {};
  // Get current URL to determine which platform we're on
  const currentUrl = window.location.href;

  // -------------------- FACEBOOK BLOCKING --------------------
  if (currentUrl.includes('facebook.com')) {
    console.log("UnReel: Detected Facebook website");
    console.log("UnReel: Facebook setting is", settings.facebook);
    
    if (settings.facebook !== false) {
      console.log("UnReel: Activating Facebook blocking");
      // Get Facebook-specific options or use defaults
      const facebookOptions = settings.facebookOptions || { stories: true, reels: true };
      console.log("UnReel: Facebook options:", facebookOptions);
      
      // Use the combined observer approach for Facebook
      observeFacebookReelsAndStories();
      
      // Run an additional check after a short delay to catch any elements that might have been missed
      setTimeout(() => {
        console.log("UnReel: Running delayed Facebook content check");
        observeFacebookReelsAndStories();
      }, 2000);
      
      // Run another check after a longer delay for slower connections
      setTimeout(() => {
        console.log("UnReel: Running final Facebook content check");
        observeFacebookReelsAndStories();
      }, 5000);
    } else {
      console.log("UnReel: Facebook blocking is disabled in settings");
    }
  } 
  
  // -------------------- INSTAGRAM BLOCKING --------------------
  if (settings.instagram && window.location.hostname.includes('instagram.com')) {
    console.log("UnReel: Activating Instagram blocking");
    // Get Instagram-specific options or use defaults
    const igOptions = settings.instagramOptions || { stories: true, reels: true };
    
    // Block Reels if enabled in settings
    if (igOptions.reels) {
      observeInstagramReels();
    }

    // Block Stories if enabled in settings
    if (igOptions.stories) {
      console.log("UnReel: Blocking Instagram Stories");
      
      // Create a style element for CSS-based blocking
      const style = document.createElement('style');
      style.id = 'unreel-instagram-stories-blocker';
      style.textContent = `
        /* Target stories section - first section in the feed */
        main[role="main"] > section:first-of-type,
        main[role="main"] > div > section:first-of-type {
          display: none !important;
          height: 0 !important;
          min-height: 0 !important;
          max-height: 0 !important;
          padding: 0 !important;
          margin: 0 !important;
          border: none !important;
          position: absolute !important;
          opacity: 0 !important;
          pointer-events: none !important;
          z-index: -9999 !important;
        }
        
        /* Force second section to top with no gap */
        main[role="main"] > section:nth-of-type(2),
        main[role="main"] > div > section:nth-of-type(2) {
          margin-top: 0 !important;
          padding-top: 0 !important;
        }
        
        /* Target story elements by their characteristics */
        div[role="button"][tabindex="0"][style*="width"],
        div[role="button"][aria-label*="story"],
        div[role="button"][aria-label*="Story"],
        div[style*="overflow-x"][style*="height"],
        div[style*="overflow: auto"][style*="height"] {
          display: none !important;
        }
        
        /* Target parent containers */
        section:has(div[role="button"][tabindex="0"]),
        section:has(div[role="button"][aria-label*="story"]),
        div:has(> div[role="button"][tabindex="0"]) {
          display: none !important;
          height: 0 !important;
          min-height: 0 !important;
          max-height: 0 !important;
          padding: 0 !important;
          margin: 0 !important;
          border: none !important;
        }
      `;
      document.head.appendChild(style);
      
      // Function to completely remove Instagram stories
      function removeInstagramStories() {
        try {
          // Direct DOM removal approach
          const mainFeed = document.querySelector('main[role="main"]');
          if (mainFeed) {
            const sections = mainFeed.querySelectorAll('section');
            if (sections.length > 0) {
              // First section is typically stories
              const firstSection = sections[0];
              
              // Check if it contains story elements
              const hasStoryButtons = firstSection.querySelectorAll('div[role="button"][tabindex="0"], div[role="button"][aria-label*="story"]').length > 0;
              
              if (hasStoryButtons) {
                console.log("UnReel: Found and removing stories section");
                // Remove it completely
                firstSection.remove();
                
                // Adjust spacing on second section if it exists
                if (sections.length > 1) {
                  const secondSection = sections[1];
                  secondSection.style.marginTop = '0';
                  secondSection.style.paddingTop = '0';
                }
                
                return true;
              }
            }
          }
          
          // Secondary approach - look for story elements directly
          const storySelectors = [
            'div[role="button"][tabindex="0"][style*="width"]',
            'div[role="button"][aria-label*="story"]',
            'div[role="button"][aria-label*="Story"]'
          ];
          
          let found = false;
          storySelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
              // Find the parent container
              const container = el.closest('section') || el.closest('div[style*="overflow"]');
              if (container) {
                container.remove();
                found = true;
              } else {
                el.remove();
                found = true;
              }
            });
          });
          
          return found;
        } catch (error) {
          console.log("UnReel: Error removing Instagram stories:", error);
          return false;
        }
      }
      
      // Inject a script that runs in the page context for more direct access
      const scriptElement = document.createElement('script');
      scriptElement.textContent = `
        (function() {
          // Function to remove stories from page context
          function removeStoriesFromPage() {
            // Target the main feed
            const main = document.querySelector('main[role="main"]');
            if (!main) return;
            
            // Get all sections
            const sections = main.querySelectorAll('section');
            if (sections.length > 0) {
              // First section is typically stories
              const firstSection = sections[0];
              
              // Check if it has stories
              const hasStories = firstSection.querySelectorAll('div[role="button"][tabindex="0"], div[role="button"][aria-label*="story"]').length > 0;
              
              if (hasStories || sections.length >= 2) {
                // Remove it
                firstSection.remove();
                
                // Adjust second section if it exists
                if (sections.length > 1) {
                  const secondSection = sections[1];
                  secondSection.style.marginTop = '0';
                  secondSection.style.paddingTop = '0';
                }
              }
            }
          }
          
          // Run immediately
          removeStoriesFromPage();
          
          // Set up interval to keep checking
          setInterval(removeStoriesFromPage, 1000);
          
          // Also run on navigation and scroll events
          window.addEventListener('popstate', function() {
            setTimeout(removeStoriesFromPage, 300);
          });
          
          window.addEventListener('scroll', function() {
            setTimeout(removeStoriesFromPage, 200);
          }, {passive: true});
        })();
      `;
      
      // Inject the script
      document.documentElement.appendChild(scriptElement);
      scriptElement.remove();
      
      // Run our extension-context function initially
      removeInstagramStories();
      
      // Set up a MutationObserver to watch for new story elements
      const storiesObserver = new MutationObserver(() => {
        removeInstagramStories();
      });
      
      // Start observing
      storiesObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      // Also set up periodic checks
      setTimeout(removeInstagramStories, 1000);
      setTimeout(removeInstagramStories, 2000);
      setTimeout(removeInstagramStories, 5000);
      
      // And an interval for continuous checking
      setInterval(removeInstagramStories, 2000);
      
      console.log("UnReel: Instagram Stories blocking fully initialized");
    }
  }

  // -------------------- YOUTUBE BLOCKING --------------------
  if (settings.youtube && window.location.hostname.includes('youtube.com')) {
    console.log("UNREEL!: Activating YouTube blocking");
    // YouTube doesn't have granular options, so we activate all blocking features
    // Block Shorts videos
    observeAndBlockYouTubeShorts();
    // Block endscreen overlays and recommendations
    blockYouTubeEndscreenOverlay();
    // Block suggested videos in the sidebar
    blockYouTubeSuggestedVideos();
  }

  // -------------------- SNAPCHAT BLOCKING --------------------
  if (settings.snapchat && window.location.hostname.includes('snapchat.com')) {
    console.log("UnReel: Activating Snapchat blocking");
    // Get Snapchat-specific options
    const snapOptions = settings.snapchatOptions || { stories: true, spotlight: true };
    
    // Currently we don't have separate functions for different Snapchat content types
    // So we use the same function for all Snapchat content if any option is enabled
    if (snapOptions.stories || snapOptions.spotlight) {
      observeSnapchatReels();
    }
  }
});
