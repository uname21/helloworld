let page = document.getElementById('buttonDiv');
const tab_prefix = 'ids_'
const options = ['left', 'left_r', 'right', 'right_r', 'mid']
const optionsAction = {
  left: function () {
    document.getElementsByName('qty')[0].value = 3;
    document.getElementsByName('exclude')[0].checked = false;
    document.getElementsByName('direction').forEach(function (v) {
      if (v.value == 'left') v.click();
    });
  },
  left_r: function () {
    document.getElementsByName('qty')[0].value = 7;
    document.getElementsByName('exclude')[0].checked = true;
    document.getElementsByName('direction').forEach(function (v) {
      if (v.value == 'right') v.click();
    });
  },
  right: function () {
    document.getElementsByName('qty')[0].value = 3;
    document.getElementsByName('exclude')[0].checked = false;
    document.getElementsByName('direction').forEach(function (v) {
      if (v.value == 'right') v.click();
    });
  },
  right_r: function () {
    document.getElementsByName('qty')[0].value = 7;
    document.getElementsByName('exclude')[0].checked = true;
    document.getElementsByName('direction').forEach(function (v) {
      if (v.value == 'left') v.click();
    });
  },
  mid: function () {
    document.getElementsByName('qty')[0].value = 6;
    document.getElementsByName('exclude')[0].checked = true;
    document.getElementsByName('direction').forEach(function (v) {
      if (v.value == 'mid') v.click();
    });
  }
}
function constructOptions(options) {
  for (let option of options) {
    let button = document.getElementById(option);
    button.addEventListener('click', function () {
      optionsAction[option]();
      start();
    });
  }
}
function start() {
  chrome.alarms.create({ when: Date.now() + 2000, periodInMinutes: 1})
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs.length == 0) return

    let tab_id = tabs[0].id
    chrome.storage.sync.get([tab_prefix + tab_id], function (data) {
      if (!data[tab_prefix + tab_id]) {
        let item;
        document.getElementsByName('direction').forEach(function (v) {
          if (v.checked) item = v.value;
        });
        let quantity = parseInt(document.getElementsByName('qty')[0].value)
        let time = document.getElementsByName('time')[0].value
        let amount = parseInt(document.getElementsByName('amount')[0].value)
        let exclude = document.getElementsByName('exclude')[0].checked ? 1 : 0
        chrome.storage.sync.set(
          {
            type: item,
            quantity: quantity,
            time: time,
            amount: amount,
            exclude: exclude
          },
          function () {
            chrome.tabs.executeScript(tab_id, { file: 'content.js' }, function (result) {

              let obj = {}
              obj[tab_prefix + tab_id] = 1
              chrome.storage.sync.set(obj)
            });
          });
      }
      else {
        document.getElementById('stop').click();
        start();
      }
    });
  });
}
function constructClear() {
  let button = document.getElementById('stop');
  const interval_prefix = 'interval_id_'
  button.addEventListener('click', function () {
    chrome.alarms.clearAll()
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length == 0) return

      let tab_id = tabs[0].id
      chrome.storage.sync.get([tab_prefix + tab_id, 'type'], function (data) {
        let id = data[tab_prefix + tab_id]
        if (id) {
          chrome.storage.sync.get(interval_prefix + data.type, function (data2) {
            let intervalId = data2[interval_prefix + data.type]
            console.log(intervalId)
            let code = 'clearInterval(' + intervalId + ');' +
              'obj=$(\'a[name="jssc"] span\').eq(2); obj.text(obj.text().replace(" Started", ""));';
            chrome.tabs.executeScript(tab_id, { code: code }, function (result) {

              chrome.storage.sync.remove(tab_prefix + tab_id)
            });

          });
        }
      });
    });
  });
}

constructOptions(options);
constructClear();