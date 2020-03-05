
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

chrome.alarms.onAlarm.addListener(function () {
  console.log('Alarm run')
  // chrome.tabs.query({ url: match_url }, function (tabs) {
  //   let tab_id = tabs[0].id
  //   chrome.tabs.executeScript(tab_id, { file: 'login.js' }, function (result) {
  //     console.log(result);
  //   });
  // });
});