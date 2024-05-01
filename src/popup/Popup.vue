<template>
  <div class="container">
    <h1>Inventory Management</h1>
    <h2>Slots</h2>
    <table>
      <tr>
        <th>Name</th>
        <th>Size</th>
        <th>Index</th>
        <th>Remove</th>
      </tr>
      <tr v-for="slot in slots">
        <td>
          <input v-model="slot.name" @input="updateSlots" type="text" />
        </td>
        <td>
          <input
            :value="slot.size"
            @input="capSlotSize($event, slot)"
            type="number"
          />
        </td>
        <td>
          <input
            @input="updateSlots"
            v-model="slot.index"
            min="0"
            max="99"
            type="number"
          />
        </td>
        <td><button @click="removeSlot(slot)">-</button></td>
      </tr>
    </table>
    <button @click="addSlot">Add slot</button>

    <h2>Items</h2>
    <table>
      <tr>
        <th>Item</th>
        <th>Slot</th>
        <th>Size</th>
        <th>Index</th>
        <th>Stack size</th>
        <th>Image</th>
        <th>AI Image</th>
        <th>Track</th>
      </tr>

      <tr v-for="item in itemList">
        <td class="itemName">{{ item.name }}</td>
        <td>
          <select v-model="item.slot" @input="updateItem(item)">
            <option value="none">None</option>
            <option
              v-for="slot in slots"
              :value="slot.id"
              :disabled="isDisabled(item, slot)"
            >
              {{ slot.name }}
            </option>
          </select>
        </td>
        <td>
          <input
            :value="item.size"
            @input="capItemSize($event, item)"
            min="1"
            :max="getMaxSize(item)"
            type="number"
          />
        </td>
        <td>
          <input
            v-model="item.index"
            @input="updateItem(item)"
            min="-1"
            :max="
              item.slot === 'none' ? 999 : slots[item.slot].size - item.size
            "
            type="number"
          />
        </td>
        <td>
          <input
            v-model="item.stackSize"
            @input="updateItem(item)"
            min="1"
            :max="999"
            type="number"
          />
        </td>
        <td>
          <input @input="updateItem(item)" v-model="item.img" type="text" />
        </td>
        <td>
          <button @click="updateImage(item)">Generate</button>
        </td>
        <td>
          <input
            @input="untrackItem(item)"
            v-model="item.track"
            type="checkbox"
          />
        </td>
      </tr>
    </table>
    <h2>OpenAI API Key</h2>
    <input type="text" v-model="apiKey" />
    <button @click="updateKey">Save Key</button>
    <button @click="updateImage(Object.values(items))">Generate images</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, ComputedRef, onMounted } from 'vue'
import browser from 'webextension-polyfill'
import { Slots, Slot, Item, Items } from '../types/types'

onMounted(() => {
  // request a data sync from content script
  chrome.runtime.sendMessage({ type: 'INIT' })
})

// listen to any data changes
chrome.runtime.onMessage.addListener((request) => {
  if (request.type === 'SYNC') {
    console.log('popup sync')
    items.value = request.value.items
    slots.value = request.value.slots
    console.log(request.value.apiKey, 'API KEY POPUP')
    apiKey.value = request.value.apiKey
  }
})

// SLOTS //

const slots = ref<Slots>({})

// add a slot
const addSlot = () => {
  const slot: Slot = {
    id: Date.now().toString(),
    name: 'Slot',
    size: 1,
    index: Object.keys(slots.value).length - 1
  }
  slots.value[slot.id] = slot
  updateSlots()
}

// remove a slot and move any items it was holding out
const removeSlot = (slot: Slot) => {
  delete slots.value[slot.id]
  const changedItems: Item[] = []
  Object.values(items.value).forEach((item) => {
    if (item.slot === slot.id) {
      item.slot = 'none'
      changedItems.push(item)
    }
  })
  updateItem(changedItems)
  updateSlots()
}

// an object woth key: slotId and value: number of items in slot
const slotsUsed: ComputedRef<Record<string, number>> = computed(() =>
  Object.values(slots.value).reduce((obj, slot) => {
    const totalItems = Object.values(items.value)
      .filter((item) => item.slot === slot.id)
      .reduce((total, item) => total + item.size, 0)
    return { ...obj, [slot.id]: totalItems }
  }, {})
)

// an object with key: slotId and value: boolean if slot is full
const slotsFull: ComputedRef<Record<string, boolean>> = computed(() =>
  Object.values(slots.value).reduce((obj, slot) => {
    return { ...obj, [slot.id]: slotsUsed.value[slot.id] >= slot.size }
  }, {})
)

// check if a slot option should be disabled (full or item wont fit)
const isDisabled = (item: Item, slot: Slot) => {
  if (slot.id === 'none') {
    return false
  }
  return (
    slotsFull.value[item.slot] ||
    item.size > slot.size - slotsUsed.value[slot.id]
  )
}

// make sure a slot isn't too big or smaller than the items it holds
const capSlotSize = (event: Event, slot: Slot) => {
  const value = parseInt((event.target as HTMLInputElement).value)
  const maxSize = 99
  const minSize = slotsUsed.value[slot.id]
  console.log(maxSize, minSize, 'SLOT CAP')
  if (value >= maxSize) {
    slot.size = maxSize
  } else if (value <= minSize) {
    slot.size = minSize
  } else {
    slot.size = value
  }
  updateSlots()
}

// send the updated slots to the content script
const updateSlots = () => {
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    if (tabs[0].id) {
      browser.tabs.sendMessage(tabs[0].id, {
        type: 'UPDATE_SLOTS',
        value: slots.value
      })
    }
  })
}

// ITEMS //

const items = ref<Items>({})
const itemList = computed(() => Object.values(items.value))

// set an item's tracking to false
const untrackItem = (item: Item) => {
  item.slot = 'none'
  updateItem(item)
}

// make sure an item is at least size 1 and not bigger than the space of the slot it's in
const capItemSize = (event: Event, item: Item) => {
  const value = parseInt((event.target as HTMLInputElement).value)
  const maxSize = getMaxSize(item)
  if (value >= maxSize) {
    item.size = maxSize
  } else if (value <= 1) {
    item.size = 1
  } else {
    item.size = value
  }
  updateItem(item)
}

// get the max size an item can be in its slot
const getMaxSize = (item: Item) =>
  slots.value[item.slot]
    ? item.size + slots.value[item.slot].size - slotsUsed.value[item.slot]
    : 99

// send an updated item ot the conent script
const updateItem = (item: Item | Item[]) => {
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    if (tabs[0].id) {
      browser.tabs.sendMessage(tabs[0].id, {
        type: 'UPDATE_ITEM',
        value: Array.isArray(item) ? item : [item]
      })
    }
  })
}

// request a new image for an item(s)
const updateImage = (item: Item | Item[]) => {
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    if (tabs[0].id) {
      browser.tabs.sendMessage(tabs[0].id, {
        type: 'UPDATE_IMAGE',
        value: Array.isArray(item) ? item : [item]
      })
    }
  })
}

// API KEY //

const apiKey = ref('')

// update the api key
const updateKey = () => {
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    if (tabs[0].id) {
      console.log(apiKey.value, 'API KEY POPUP SAVE')
      browser.tabs.sendMessage(tabs[0].id, {
        type: 'UPDATE_KEY',
        value: apiKey.value
      })
    }
  })
}
</script>

<style scoped lang="scss">
.container {
  text-align: center;
}

.bold {
  font-weight: bold;
}

table {
  text-align: left;
}

input[type='number'] {
  width: 50px;
}

.itemName {
  width: 200px;
}
</style>
