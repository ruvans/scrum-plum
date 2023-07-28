chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: ''
  });
});
//this doesn't work! well it kinda works but I think it's being overwritten or something.
function setModes() { document.documentElement.setAttribute("data-theme", "dark:dark"); document.documentElement.setAttribute("data-color-mode", "dark"); }

const extensions = 'https://krotosltd.atlassian.net/jira/software/';

// When the user clicks on the extension action
chrome.action.onClicked.addListener(async (tab) => {
  if (tab.url.startsWith(extensions)) {
    // We retrieve the action badge to check if the extension is 'ON' or 'OFF'
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    // Next state will always be the opposite
    const nextState = prevState === 'ON' ? '' : 'ON';

    // Set the action badge to the next state
    await chrome.action.setBadgeText({
      tabId: tab.id,
      text: nextState
    });

    if (nextState === 'ON') {
      // Insert the CSS file when the user turns the extension on
      await chrome.scripting.insertCSS({
        files: ['focus-mode.css'],
        target: { tabId: tab.id }
      });
	  await chrome.scripting.executeScript({
		target: { tabId: tab.id },
		func : setModes,
	  })
    } else if (nextState === '') {
      // Remove the CSS file when the user turns the extension off
      await chrome.scripting.removeCSS({
        files: ['focus-mode.css'],
        target: { tabId: tab.id }
      });
    }
  }
});

