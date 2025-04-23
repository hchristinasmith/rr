ReelRaid App

## Core Features
- block social media app reels (youtube, facebook, instagram, snapchat)
- identify and hide content such as Reels, Stories, and similar distracting elements based on platform. 
- allow user to easily toggle features on/off
- customisable settingsl block specific content (e.g. Reels or Stories) on different platforms
- browser extension for chrome and safari
- works on facebook, instagram, youtube, and snapchat
- A simple pop-up interface that allows users to manage settings (toggle blocking of conetent, view stats, etc.)
- Design intutive UI for managing settings within the browser extension (easy to understand toggle switches)

## Extension Directory

ReelRaid/
├── manifest.json  ## Extension metadata and settings
├── background.js  ## Handles background tasks (blocking reels)
├── content.js     ## Runs on social media pages (Facebook, Instagram, YouTube, Snapchat)
├── popup/
│   ├── popup.html ## Popup interface for managing settings
│   ├── popup.css  ## Styles for the popup interface
│   └── popup.js   ## Popup logic and functionality
└── assets/

## Tech Stack

### Frontend (UI/UX)
- **HTML**: For the structure of the popup interface (buttons, toggles)
- **CSS**: For styling the popup interface, including toggle switches and buttons with simple, responsive styles
- **Vanilla JavaScript (ES6+)**: For logic and functionality, managing background tasks (blocking reels) and popup interactions

### Browser Extension APIs
- **chrome.runtime**: Communication between different parts of the extension (background, popup, and content scripts)
- **chrome.storage**: Store user settings (which reels to block)
- **chrome.tabs**: Access and interact with web pages to detect platforms like Facebook or Instagram
- **chrome.webNavigation**: Monitor page navigation and block reels based on URL

### Browser Compatibility
- **Chrome Extensions**: Primary focus, with potential to adapt for Safari later

### UI for the Popup
- Simple HTML forms with toggle switches and buttons
- Basic CSS for styling
- Minimal JavaScript for interactions, focusing on simplicity

### Storage
- **chrome.storage.local**: Store user preferences for content blocking across different social media apps
