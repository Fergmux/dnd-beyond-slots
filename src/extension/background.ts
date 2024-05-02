let currentTab: chrome.tabs.Tab
let debugee: chrome.debugger.Debuggee
let version = '1.0'
let characterId: string
let requestId: string

// on debugger event check for api data
function allEventHandler(
  debuggeeId: chrome.debugger.Debuggee,
  message: string,
  params?: { requestId?: string; response?: Response; type?: string }
) {
  // console.log('bg tabIds', currentTab.id, debuggeeId.tabId)
  if (currentTab.id !== debuggeeId.tabId) {
    return
  }

  debugee = debuggeeId

  // if we have a response, set the request ID
  // (we can't get the response here)
  // console.log('bg message', message)
  if (message == 'Network.responseReceived') {
    // console.log('bg response', params)
    const characterUrl = `https://character-service.dndbeyond.com/character/v5/character/${characterId}`
    if (
      params?.response?.url.startsWith(characterUrl) &&
      params?.type === 'XHR' &&
      params.requestId
    ) {
      requestId = params?.requestId
    }
  }

  // once the response of the rquest set above is finsihed loading get the response data
  // (we can't get the url here)
  if (message == 'Network.loadingFinished') {
    // console.log('bg loaded', params, requestId)
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

// add the listener for the debugger
const onAttach = (tabId: number) => {
  chrome.debugger.sendCommand(
    {
      // first enable the Network
      tabId: tabId
    },
    'Network.enable'
  )

  chrome.debugger.onEvent.addListener(allEventHandler)
}

const queryTabs = () => {
  chrome.tabs.query(
    // get current tab
    {
      currentWindow: true,
      active: true
    },
    function (tabArray) {
      currentTab = tabArray[0]

      const urlParts = currentTab.url?.split('/')
      characterId = (urlParts && urlParts[urlParts.length - 1]) || ''
      // if we're on the right tab attach the debugger and bind callback
      if (
        currentTab.id &&
        currentTab.url?.includes('dndbeyond.com/characters/')
      ) {
        console.log('bg current tab', currentTab)
        chrome.debugger.attach(
          { tabId: currentTab.id },
          version,
          onAttach.bind(null, currentTab.id)
        )
      }
    }
  )
}

// watch for the api data
chrome.runtime.onMessage.addListener(function (request) {
  // Forward any messages from content to the manager/popup
  if (currentTab?.id) {
    chrome.tabs.sendMessage(currentTab.id, request)
  }

  // the dnd beyond page has loaded so start snooping the network
  if (request.type === 'LISTEN') {
    queryTabs()
  }
})
