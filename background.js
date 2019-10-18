
const match_url = '*://*.hy3237222.xyz/*'
// const match_url = '.chrome.com'
// const match_url = "*://*.chrome.com"

chrome.runtime.onInstalled.addListener(function () {

  console.log("background loaded.");
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: { urlContains: match_url.replace(/[\*:/]/g, '') },
      })
      ],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    console.log(request, sender, sendResponse)
  });