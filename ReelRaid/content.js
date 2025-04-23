// Facebook Reels
function hideFacebookReels() {
  const reelsSelectors = [
    'a[aria-label="Reels"]', // Reels link/icon in the feed
    'div[aria-label="Reels"]', // Reels icon in other parts of the site
    'div[data-testid="reels_menu_item"]', // Reels menu item
    'div[aria-label="See More"] a[href*="reels"]', // Reels in the "See More" dropdown
  ];

  reelsSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      console.log("Hiding Facebook Reels element: ", el); // Debugging
      el.style.display = 'none'; // Hide the Reels icon/menu
    });
  });
}

// Facebook Stories
function blockFacebookStories() {
  const stories = document.querySelectorAll('[aria-label="Stories"]');
  stories.forEach(story => {
    console.log("Hiding Facebook Stories element: ", story); // Debugging
    story.style.display = 'none'; // Hides the Stories section
  });
}

// Instagram Reels
function blockInstagramReels() {
  // Remove Reels tab in the top navbar
  document.querySelectorAll('a[href="/reels/"]').forEach(el => {
    console.log("Hiding Reels tab:", el);
    el.style.display = 'none';
  });

  // Remove Reels posts in the feed
  document.querySelectorAll('a[href*="/reels/"]').forEach(el => {
    const article = el.closest('article');
    if (article) {
      console.log("Hiding Reels post:", article);
      article.style.display = 'none';
    }
  });

  // Remove Reels icons (in nav or elsewhere)
  document.querySelectorAll('svg[aria-label="Reels"]').forEach(el => {
    const button = el.closest('a, div');
    if (button) {
      console.log("Hiding Reels icon/button:", button);
      button.style.display = 'none';
    }
  });
}
function observeInstagramReels() {
  blockInstagramReels();

  const observer = new MutationObserver(() => {
    blockInstagramReels();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}



// YouTube Shorts
function hideShortsElements() {
  const shortsSelectors = [
    'ytd-rich-section-renderer[section-identifier="shorts-shelf"]',
    'ytd-reel-shelf-renderer', // Shorts as part of main feed
    'a[href^="/shorts"]',
    '[title="Shorts"]',
    '[aria-label="Shorts"]',
  ];

  shortsSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      const parent = el.closest(
        'ytd-rich-section-renderer, ytd-reel-shelf-renderer, ytd-item-section-renderer, ytd-guide-entry-renderer, ytd-mini-guide-entry-renderer'
      ) || el;

      if (parent && parent.style.display !== 'none') {
        console.log("Hiding YouTube Shorts element: ", parent); // Debugging
        parent.style.display = 'none';
      }
    });
  });
}

function observeAndBlockYouTubeShorts() {
  // Initial run
  hideShortsElements();

  const observer = new MutationObserver(() => {
    hideShortsElements();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// Snapchat Spotlight & Discover
function blockSnapchatReels() {
  const selectors = [
    'div.S4e9r.Mn1n9', // Specific class you found
    'div[aria-label*="Spotlight"]',
    'div[aria-label*="Discover"]',
    'a[href*="spotlight"]',
    'a[href*="discover"]',
    'div:has(video)', // Catch-all for video-heavy divs
  ];

  selectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      console.log("Hiding Snapchat Reels element:", el);
      el.style.display = 'none';
    });
  });
}

function observeSnapchatReels() {
  blockSnapchatReels();

  const observer = new MutationObserver(() => {
    blockSnapchatReels();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}




// Main logic
chrome.storage.local.get(['settings'], (result) => {
  const settings = result.settings || {};
  const host = window.location.hostname;

  if (settings.facebook && host.includes('facebook.com')) {
    hideFacebookReels();  // Hide Facebook Reels icon and label
    blockFacebookStories();  // Hide Facebook Stories

    // Observe dynamic content (new reels or stories)
    const observer = new MutationObserver(() => {
      hideFacebookReels();
      blockFacebookStories();
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (settings.instagram && host.includes('instagram.com')) {
    observeInstagramReels();
  }  

  if (settings.youtube && host.includes('youtube.com')) {
    observeAndBlockYouTubeShorts();
  }

  if (settings.snapchat && host.includes('snapchat.com')) {
    observeSnapchatReels();
  }
});
