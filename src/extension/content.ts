import { ImgurClient } from 'imgur'
import isEqual from 'lodash/fp/isEqual'
import OpenAI from 'openai'
import { createApp } from 'vue'
import App from '../manager/App.vue'
import { Data, Inventory, Response } from '../types/Character.ts'
import {
  Event,
  Item,
  Items,
  Slots,
  UpdateItemEvent,
  UpdateKeyEvent,
  UpdateSlotsEvent
} from '../types/types.ts'

// limit of 12,500 requests per day, will upgrade if I hit that
const client = new ImgurClient({
  clientId: import.meta.env.VITE_IMGUR_CLIENT_ID,
  clientSecret: import.meta.env.VITE_IMGUR_CLIENT_SECRET
})

let characterInfo: Data
let apiKey: string
let items: Items = {}
let slots: Slots = {
  equipped: {
    id: 'equipped',
    name: 'Equipped',
    size: 4,
    index: 0
  },
  worn: {
    id: 'worn',
    name: 'Worn',
    size: 6,
    index: 1
  },
  pockets: {
    id: 'pockets',
    name: 'Pockets',
    size: 13,
    index: 2
  },
  backpack: {
    id: 'backpack',
    name: 'Backpack',
    size: 15,
    index: 3
  }
}

const mountApp = () => {
  // If we've inserted the app container return
  if (document.getElementById('slots-app')) return
  // if the element to insert on isn't present return
  if (!document.getElementsByClassName('ct-equipment').length) return

  // if we already have the tab injected don't add another
  if (!document.getElementById('app-container')) {
    // time for some hacky shit
    // get the tabs container
    const tabsContainer = document
      .getElementsByClassName('ddbc-tab-options__nav')
      .item(0)
    // get the tabs
    const tabs = document.getElementsByClassName('ddbc-tab-options__header')
    // clone a tab
    const newTab = tabs.item(1)?.cloneNode(true) as HTMLElement
    // set the id of our new tab
    newTab.setAttribute('id', 'app-container')
    // append the new tab to the container
    if (tabsContainer && newTab) {
      tabsContainer.appendChild(newTab)
    }
    // rename the tab
    newTab.childNodes[0].textContent = 'Slots'

    // when the slots tab is clicked
    newTab.addEventListener('click', () => {
      // if we're already on that tab don;t do anything
      if (newTab.classList.contains('ddbc-tab-options__header--is-active'))
        return

      // otherwise set tab as active
      newTab.classList.add('ddbc-tab-options__header--is-active')
      ;(newTab.childNodes[0] as HTMLElement).classList.add(
        'ddbc-tab-options__header-heading--is-active'
      )

      // get the content container
      const tabsContentContainers =
        document.getElementsByClassName('ct-content-group')

      // hide all except the first content section
      for (let i = 1; i < tabsContentContainers.length; i++) {
        ;(tabsContentContainers.item(i) as HTMLElement).style.display = 'none'
      }

      // get the first content section
      const tabsContentContainer = tabsContentContainers.item(0)

      // hide everything in the content section
      tabsContentContainer?.childNodes.forEach(
        (node) => ((node as HTMLElement).style.display = 'none')
      )

      // for all the tabs
      for (let i = 0; i < tabs.length; i++) {
        const tab = tabs.item(i)
        // if it's not our tab
        if (tab?.id !== 'app-container') {
          // remove the active class
          tab?.classList.remove('ddbc-tab-options__header--is-active')
          ;(tab?.childNodes[0] as HTMLElement).classList.remove(
            'ddbc-tab-options__header-heading--is-active'
          )

          // add a click listener for when we want to go back to a standard tab
          tab?.addEventListener('click', () => {
            // show all the first content section's content
            ;(
              tabsContentContainer?.childNodes[0] as HTMLElement
            ).style.display = 'flex'
            ;(
              tabsContentContainer?.childNodes[1] as HTMLElement
            ).style.display = 'block'

            // show all the other content sections
            for (let i = 1; i < tabsContentContainers.length; i++) {
              ;(tabsContentContainers.item(i) as HTMLElement).style.display =
                'block'
            }

            // remove the app container
            tabsContentContainer?.querySelector('#slots-app')?.remove()
            // remove the active class from our tab
            newTab.classList.remove('ddbc-tab-options__header--is-active')
            ;(newTab.childNodes[0] as HTMLElement).classList.remove(
              'ddbc-tab-options__header-heading--is-active'
            )
            // add the active class to the tab we've just clicked on
            tab.classList.add('ddbc-tab-options__header--is-active')
            ;(tab.childNodes[0] as HTMLElement).classList.add(
              'ddbc-tab-options__header-heading--is-active'
            )
          })
        }
      }

      // Insert the app container
      const appContainer = document.createElement('div')
      appContainer.setAttribute('id', 'slots-app')
      tabsContentContainer?.append(appContainer)

      // moun the app
      createApp(App).mount('#slots-app')

      syncEvent()
    })
  }
}

// Get images for a list of items
const getItemImages = async (itemsToGet: Item[], force = false) => {
  if (!apiKey) return
  const openai = new OpenAI({
    apiKey, // only user entered keys can go here so it's safe to do the below
    dangerouslyAllowBrowser: true
  })

  // If there's a dnd image leave it as that
  // If there is an image already don't fetch unless forced
  const promises = itemsToGet
    .filter(
      (item) =>
        !item.img?.startsWith('https://www.dndbeyond.com/') &&
        (!item.img || force)
    )
    .map(async (item: Item) => {
      try {
        // Generate image with dall-e
        const response = await openai.images.generate({
          model: 'dall-e-2',
          prompt: `${item.name}, a digital painting in the style of dungeons and dragons art illustration on a white background`,
          n: 1,
          size: '256x256'
        })

        console.log('loading image for', item.name)

        // upload image to imgur
        const imgurResponse = await client.upload({
          image: response.data[0].url || '',
          title: item.name
        })

        // set the item's image to the imgur link
        items[item.id].img = imgurResponse.data.link
        syncEvent()
      } catch (e) {
        console.log("couldn't fetch image")
      }
    })

  await Promise.all(promises)
}

const syncEvent = () => {
  // Sync local data with components
  chrome.runtime.sendMessage({ type: 'SYNC', value: { items, slots, apiKey } })
}

// Get items from storage and sycnc to components
const syncItems = (inventory: Inventory[]) => {
  // get array of itm ids
  chrome.storage.sync.get('items', async (storedData) => {
    // get items from ids
    chrome.storage.sync.get(storedData.items, async (itemsData) => {
      const savedItems = itemsData

      // merge api items with local items
      const formattedItems = inventory.map((item: Inventory): Item => {
        const savedItem = savedItems?.[item.id]
        return {
          id: item.id,
          name: item.definition.name,
          img: savedItem?.img ?? item.definition.avatarUrl ?? '',
          slot: savedItem?.slot ?? 'none',
          size: savedItem?.size ?? 1,
          track: savedItem?.track ?? true,
          index: savedItem?.index ?? -1,
          stackSize: savedItem?.stackSize ?? 20,
          quantity: item.quantity
        }
      })

      const extraStacks: Items = {}
      formattedItems.forEach((item: Item) => {
        let x = 0
        while (item.quantity > item.stackSize) {
          item.quantity -= item.stackSize
          const newItem: Item = { ...item, id: Number(String(item.id) + x) }
          newItem.quantity = item.stackSize
          extraStacks[newItem.id] = newItem
          x++
        }
      })

      items = {
        ...Object.fromEntries(
          formattedItems.map((item: Item): [number, Item] => [item.id, item])
        ),
        ...extraStacks
      }

      // generate images where neccesary
      await getItemImages(Object.values(items))
      // save item ids
      chrome.storage.sync.set({ items: Object.keys(items) })
      // save item data
      storeItems(Object.values(items))
    })
  })

  // get slot data from storage
  chrome.storage.sync.get('slots', (storedData) => {
    const savedSlots = storedData.slots

    // if we have saved slots use them otherwise save the default slots
    if (savedSlots) {
      slots = savedSlots
    } else {
      storeSlots()
    }

    syncEvent()
  })

  // get api key from storage
  chrome.storage.sync.get('apiKey', (storedData) => {
    apiKey = storedData.apiKey
  })
}

let storeItemTimeout: NodeJS.Timeout
let itemsToStore: Items = {}
// debounce storing of items to respect rate limits
const storeItems = (items: Item[]) => {
  // if we're already waiting reset the timer and buffer items for saving
  if (storeItemTimeout) {
    clearTimeout(storeItemTimeout)
    items.forEach((item) => {
      itemsToStore[item.id] = item
    })
  }
  // start the timer
  storeItemTimeout = setTimeout(() => {
    console.log('content.js saving items', itemsToStore)
    // save the items
    chrome.storage.sync.set(itemsToStore)
    // clear the buffer
    itemsToStore = {}
  }, 5000)
}

let storeSlotsTimeout: NodeJS.Timeout
// debounce saving of slots to respect rate limits
const storeSlots = () => {
  if (storeSlotsTimeout) clearTimeout(storeSlotsTimeout)
  storeSlotsTimeout = setTimeout(() => {
    console.log('content.js saving slots', slots)
    chrome.storage.sync.set({ slots })
  }, 5000)
}

// main listener function
chrome.runtime.onMessage.addListener(async function (request: Event) {
  switch (request.type) {
    // popup on mount
    case 'INIT':
      console.log('conent.js init', request)
      syncEvent()
      break
    // item(s) updated
    case 'UPDATE_ITEM':
      console.log('content.js update item', request)
      const updateItemEvent = request as UpdateItemEvent
      // make sure the item has changed to not make unneccsary save requests
      const itemsThatHaveChanged = updateItemEvent.value.filter(
        (item) => !isEqual(items[item.id], item)
      )
      // set the local variable for the new items
      itemsThatHaveChanged.forEach((element) => {
        items[element.id] = element
      })
      // save the changed items
      storeItems(itemsThatHaveChanged)
      syncEvent()
      break
    // slots updated
    case 'UPDATE_SLOTS':
      console.log('content.js update slots', request)
      const updateSlotEvent = request as UpdateSlotsEvent
      slots = updateSlotEvent.value
      storeSlots()
      syncEvent()
      break
    // background script has got the api character data
    case 'CHARACTER':
      console.log('content.js set character', request)
      const characterResponse = request.value as Response
      characterInfo = characterResponse.data
      // merge with storage data/format new items
      syncItems(characterInfo.inventory)
      break
    // a new image has been requested for an item(s)
    case 'UPDATE_IMAGE':
      console.log('content.js update image', request)
      const updateImageEvent = request as UpdateItemEvent
      getItemImages(updateImageEvent.value, true) // forced
      break
    // api key updated
    case 'UPDATE_KEY':
      console.log('content.js update api key', request)
      const updateKeyEvent = request as UpdateKeyEvent
      apiKey = updateKeyEvent.value
      chrome.storage.sync.set({ apiKey })
      break
    default:
      break
  }
})

// On init tell the background script to watch for API data
chrome.runtime.sendMessage({ type: 'LISTEN' })

const config = { attributes: true, childList: true, subtree: true }
let docObserver: MutationObserver

// watch the dom for updates ready to mount the app
const watchDom = () => {
  // once the container is present
  const nodes = document.getElementsByClassName('ct-primary-box')
  const targetNode = nodes.item(0)

  if (targetNode) {
    // if the container is present watch it for a change to inventory tab
    const callback = () => {
      mountApp()
    }

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback)

    // Start observing the target node for configured mutations
    if (targetNode) {
      // start watching the container
      observer.observe(targetNode, config)
      // stop watching the entire DOM
      docObserver.disconnect()
    }
  }
}

// observe the whole document
const docEl = document.documentElement
docObserver = new MutationObserver(watchDom)
docObserver.observe(docEl, config)
