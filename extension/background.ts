let currentTab: chrome.tabs.Tab
let version = '1.0'
let characterId
let requestId

// watch for the api data
chrome.runtime.onMessage.addListener(function (request, _, sendResponse) {
  // Forward any messages from content to the manager/popup
  if (currentTab?.id) {
    console.log('background message pass', request.type)
    chrome.tabs.sendMessage(currentTab.id, request)
  }

  // the dnd beyond page has loaded so start snooping the network
  if (request.type === 'LISTEN') {
    console.log('background listen', request)
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
        // if we're on the right tab attach the debugger and bind callback
        if (
          currentTab.id &&
          currentTab.url?.includes('dndbeyond.com/characters/')
        ) {
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

  // add the listener for the debugger
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

  // on debugger event check for api data
  function allEventHandler(
    debuggeeId: chrome.debugger.Debuggee,
    message: string,
    params?: { requestId?: string; response?: Response; type?: string }
  ) {
    if (currentTab.id != debuggeeId.tabId) {
      return
    }

    // if we have a response, set the request ID
    // (we can't get the response here)
    if (message == 'Network.responseReceived') {
      const characterUrl = `https://character-service.dndbeyond.com/character/v5/character/${characterId}?includeCustomItems=true`
      if (params?.response?.url === characterUrl && params?.type === 'XHR') {
        requestId = params?.requestId
      }
    }

    // once the response of the rquest set above is finsihed loading get the response data
    // (we can't get the url here)
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
            // send the data to the content script
            chrome.tabs.sendMessage(debuggeeId.tabId || 0, {
              type: 'CHARACTER',
              value: JSON.parse(characterResponse.body)
            })
            // detatch the debugger
            chrome.debugger.detach(debuggeeId)
          }
        )
      }
    }
  }
})
