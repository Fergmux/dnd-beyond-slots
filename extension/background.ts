let currentTab: chrome.tabs.Tab
let version = '1.0'
let characterId
let requestId

chrome.runtime.onMessage.addListener(function (request, _, sendResponse) {
  // Forward any messages from content to the manager/popup
  if (currentTab?.id) {
    console.log('background message pass', request.type)
    chrome.tabs.sendMessage(currentTab.id, request)
  }

  if (request.type === 'LISTEN') {
    console.log('background listen')
    chrome.tabs.query(
      //get current Tab
      {
        currentWindow: true,
        active: true
      },
      function (tabArray) {
        currentTab = tabArray[0]
        const urlParts = currentTab.url?.split('/')
        characterId = urlParts && urlParts[urlParts.length - 1]
        if (currentTab.id) {
          chrome.debugger.attach(
            {
              //debug at current tab
              tabId: currentTab.id
            },
            version,
            onAttach.bind(null, currentTab.id)
          )
        }
      }
    )
  }

  function onAttach(tabId: number) {
    chrome.debugger.sendCommand(
      {
        // first enable the Network
        tabId: tabId
      },
      'Network.enable'
    )

    chrome.debugger.onEvent.addListener(allEventHandler)
  }

  function allEventHandler(
    debuggeeId: chrome.debugger.Debuggee,
    message: string,
    params?: { requestId?: string; response?: Response; type?: string }
  ) {
    if (currentTab.id != debuggeeId.tabId) {
      return
    }

    if (message == 'Network.responseReceived') {
      const characterUrl = `https://character-service.dndbeyond.com/character/v5/character/${characterId}?includeCustomItems=true`
      if (params?.response?.url === characterUrl && params?.type === 'XHR') {
        requestId = params?.requestId
      }
    }

    if (message == 'Network.loadingFinished') {
      if (params?.requestId === requestId) {
        chrome.debugger.sendCommand(
          {
            tabId: debuggeeId.tabId
          },
          'Network.getResponseBody',
          {
            requestId: params?.requestId
          },
          function (response) {
            const characterResponse = response as { body: string }
            // you get the response body here!
            // you can close the debugger tips by:
            chrome.tabs.sendMessage(debuggeeId.tabId || 0, {
              type: 'CHARACTER',
              value: JSON.parse(characterResponse.body)
            })
            // chrome.debugger.detach(debuggeeId)
          }
        )
      }
    }
  }
})
