Floating Input Extension – Custom Typing Experience Anywhere
A Firefox extension designed to improve user typing experience by bringing the input box where your eyes are — not stuck at the bottom of the screen.

👨‍💻 Developed under the banner of GDSC IIT Roorkee

📌 Features
✨ Habit Mode (Primary Mode)
Automatically detects when a user clicks into any text field or textarea.

A floating input box pops up at a customizable position (Top, Center, Bottom).

Text typed in this floating box is instantly synced with the original input field in real-time.

Press ESC to dismiss the floating box anytime.

🔧 Customizable Settings
Box Position: Top, Center, or Bottom of screen

Box Size: Adjustable width and height

Animations: Enable or disable float-in animation

Toggle Modes: Habit, Advanced (upcoming), or Disabled

All settings are saved across sessions using Firefox's storage.sync.

🚀 How to Run and Test the Extension
Prerequisites:
Firefox Browser

Basic knowledge of browser extension loading

Steps:
Download/Clone this repository
Or download the provided .zip file and extract it.

Open Firefox and go to about:debugging#/runtime/this-firefox

Click "Load Temporary Add-on"

Select the manifest.json file inside the project folder.

Navigate to any website, click into any input field, and watch the floating input box appear.

Use the extension icon in the top-right to open settings.

⚙️ Folder Structure
pgsql
Copy
Edit
floating-input-extension/
├── manifest.json
├── content.js               ← Sync logic & overlay handling
├── background.js            ← Handles defaults and messaging
├── styles.css
├── floatinginput.css
├── popup/
│   ├── popup.html           ← User interface for customization
│   └── popup.js             ← Logic for settings storage and updates
└── icons/
    └── icon.png             ← Extension icon (48x48)
✅ Assumptions & Extra Features
This version is focused on Habit Mode only. Advanced Mode is modular and will be added later.

Designed for accessibility and UX improvement, especially for users who:

Frequently write long-form text (e.g., blog writers)

Are visually fatigued by small text fields at the screen's bottom

Use assistive or ergonomic typing tools

🚧 Possible Enhancements (Mentioned for Verification)
Advanced Mode: Inject LLMs to auto-expand input fields or suggest content.

Dark Mode Support

Auto-language detection for multilingual users.

Keybinding Manager: Configure your own shortcut to trigger the floating box.

🏫 Institution
This extension is developed as part of a project under:

Google Developer Student Clubs (GDSC)
Indian Institute of Technology, Roorkee

