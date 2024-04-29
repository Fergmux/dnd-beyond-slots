import { createApp } from 'vue'
// import './src/style.css'
import App from '../src/manager/App.vue'
import Manager from '../src/manager/Manager.vue'
import {
  Event,
  Slots,
  Items,
  Item,
  UpdateSlotsEvent,
  UpdateItemEvent
} from '../src/types/types.ts'
import { Response, Data, Inventory } from '../src/types/Character.ts'

// Chcracter id request

let manager: typeof Manager

let characterInfo: Data

let items: Items = {}
let slots: Slots = {
  equipped: {
    id: 'equipped',
    name: 'Equipped',
    size: 4
  },
  worn: {
    id: 'worn',
    name: 'Worn',
    size: 6
  },
  pockets: {
    id: 'pockets',
    name: 'Pockets',
    size: 13
  },
  backapack: {
    id: 'backapack',
    name: 'Backapack',
    size: 15
  }
}

chrome.storage.sync.clear()

const mountApp = () => {
  if (document.getElementById('slots-app')) return
  if (!document.getElementsByClassName('ct-equipment').length) return

  const content = document.getElementsByClassName('ddbc-tab-options__content')
  const appContainer = document.createElement('div')
  appContainer.setAttribute('id', 'slots-app')
  content[0].prepend(appContainer)

  const app = createApp(App, { characterInfo }).mount('#slots-app')

  manager = app.$refs.manager as typeof Manager

  syncEvent()
}

const syncEvent = () => {
  chrome.runtime.sendMessage({ type: 'SYNC', value: { items, slots } })
}

const syncItems = (inventory: Inventory[]) => {
  chrome.storage.sync.get('items', (result) => {
    console.log(result)
    const savedItems = result.items

    if (savedItems) {
      items = Object.fromEntries(
        inventory.map((item: Inventory): [number, Item] => [
          item.id,
          {
            id: item.id,
            name: item.definition.name,
            img: savedItems[item.id]?.img || item.definition.avatarUrl,
            slot: savedItems[item.id]?.slot || 'none',
            size: savedItems[item.id]?.size || 1
          }
        ])
      )
    } else {
      items = Object.fromEntries(
        inventory.map((item: Inventory): [number, Item] => [
          item.id,
          {
            id: item.id,
            name: item.definition.name,
            img: item.definition.avatarUrl ?? '',
            slot: 'none',
            size: 1
          }
        ])
      )
    }
  })
  chrome.storage.sync.get('slots', (result) => {
    console.log(result)
    const savedSlots = result.slots

    if (savedSlots) {
      slots = savedSlots
    } else {
      // items = Object.fromEntries(
      //   inventory.map((item: any) => [
      //     item.id,
      //     {
      //       id: item.id,
      //       name: item.definition.name,
      //       img: item.definition.avatarUrl,
      //       slot: 'none'
      //     }
      //   ])
      // )
    }

    chrome.storage.sync.set({ items, slots })
    console.log('ITEMS SAVED', items)
    console.log('ITEMS SAVED', slots)
    syncEvent()
  })
}

chrome.runtime.onMessage.addListener(function (request: Event) {
  switch (request.type) {
    case 'INIT':
      console.log('conent init')
      syncEvent()
      break
    case 'UPDATE_ITEM':
      console.log('conent update item')
      const updateItemEvent = request as UpdateItemEvent
      items[updateItemEvent.value.id] = updateItemEvent.value
      chrome.storage.sync.set({ items })
      syncEvent()
      break
    case 'UPDATE_SLOTS':
      console.log('conent update slots')
      const updateSlotEvent = request as UpdateSlotsEvent
      slots = updateSlotEvent.value
      chrome.storage.sync.set({ slots })
      syncEvent()
      break
    case 'CHARACTER':
      console.log('conent character')
      const characterResponse = request.value as Response
      characterInfo = characterResponse.data
      syncItems(characterInfo.inventory)
      break
    default:
      break
  }
})

chrome.runtime.sendMessage({ type: 'LISTEN' })

const config = { attributes: true, childList: true, subtree: true }
let docObserver: MutationObserver

const watchDom = () => {
  // Select the node that will be observed for mutations
  const nodes = document.getElementsByClassName('ct-primary-box')

  const targetNode = nodes.item(0)

  if (targetNode) {
    // Callback function to execute when mutations are observed
    const callback = (mutationList, observer) => {
      mountApp()
      // for (const mutation of mutationList) {
      //   if (mutation.type === "childList") {
      //     console.log("A child node has been added or removed.");
      //   } else if (mutation.type === "attributes") {
      //     console.log(`The ${mutation.attributeName} attribute was modified.`);
      //   }
      // }
    }

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback)

    // Start observing the target node for configured mutations

    if (targetNode) {
      observer.observe(targetNode, config)
      docObserver.disconnect()
    }
  }

  // Later, you can stop observing
  // observer.disconnect();
}

// Options for the observer (which mutations to observe)

const docEl = document.documentElement
docObserver = new MutationObserver(watchDom)
docObserver.observe(docEl, config)
