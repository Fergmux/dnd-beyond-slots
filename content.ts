import { createApp } from 'vue'
import './src/style.css'
import App from './src/manager/App.vue'
import Manager from './src/manager/Manager.vue'

let manager: typeof Manager

const mountApp = () => {
  const content = document.getElementsByClassName('ddbc-tab-options__content')
  const appContainer = document.createElement('div')
  appContainer.setAttribute('id', 'app')
  content[0].prepend(appContainer)

  const items = document.getElementsByClassName('ddbc-item-name')
  const itemNames = Array.from(items).map((item) => item.textContent)

  const app = createApp(App).mount('#app')

  manager = app.$refs.manager as typeof Manager

  return itemNames
}

chrome.runtime.onMessage.addListener(function (
  request,
  sender,
  sendResponse: (response: any) => void
) {
  console.log(request, 'CONTENT')
  switch (request.type) {
    case 'INIT':
      const itemNames = mountApp()
      sendResponse(itemNames)
      break
    case 'UPDATE':
      manager.setItem(request.value.item)
      // chrome.storage.sync.set({ "items": "myBody" })
      break
    default:
      break
  }
  return undefined
})
