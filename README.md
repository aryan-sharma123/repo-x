#  Floating Input Extension – Custom Typing Experience Anywhere

Name - Aryan
En.no - 23112022
department - Chemical Engineering ( 3rd year )

---


##  Features

###  Habit Mode (Primary Mode)
- Automatically detects when a user clicks into any text field or textarea.
- A **floating input box** pops up at a customizable position (Top, Center, Bottom).
- Text typed in this floating box is instantly synced with the original input field in real-time.
- Press `ESC` to dismiss the floating box anytime.

###  Customizable Settings
- **Box Position**: Top, Center, or Bottom of screen
- **Box Size**: Adjustable width and height
- **Animations**: Enable or disable float-in animation
- **Toggle Modes**: Habit, Advanced (upcoming), or Disabled
- All settings are saved across sessions using Firefox's `storage.sync`.

---

##  How to Run and Test the Extension

### Prerequisites:
- **Firefox Browser**
- Basic knowledge of browser extension loading

### Steps:
1. **Download/Clone this repository**  
   Or download the provided `.zip` file and extract it.

2. **Open Firefox** and go to `about:debugging#/runtime/this-firefox`

3. Click **"Load Temporary Add-on"**

4. Select the `manifest.json` file inside the project folder.

5. Navigate to any website, click into any input field, and watch the **floating input box appear**.

6. Use the **extension icon** in the top-right to open settings.

---



## Assumptions & Extra Features

- This version is focused on **Habit Mode** only. Advanced Mode is modular and will be added later.
- Designed for **accessibility and UX improvement**, especially for users who:
  - Frequently write long-form text (e.g., blog writers)
  - Are visually fatigued by small text fields at the screen's bottom
  - Use assistive or ergonomic typing tools

###  Possible Enhancements (Mentioned for Verification)
- **Advanced Mode**: Inject LLMs to auto-expand input fields or suggest content.
- **Dark Mode Support**
- **Auto-language detection** for multilingual users.
- **Keybinding Manager**: Configure your own shortcut to trigger the floating box.

---


