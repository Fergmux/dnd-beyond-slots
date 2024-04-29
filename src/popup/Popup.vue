<template>
  <div class="container">
    <h1>Inventory Management</h1>
    <h2>Slots</h2>
    <table>
      <tr>
        <th>Name</th>
        <th>Size</th>
        <th>Remove</th>
      </tr>
      <tr v-for="slot in slots">
        <td>
          <input v-model="slot.name" @change="updateSlots" type="text" />
        </td>
        <td>
          <input v-model="slot.size" @change="updateSlots" type="number" />
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
        <th>Image</th>
      </tr>

      <tr v-for="item in itemList">
        <td :class="{ bold: item.slot }">{{ item.name }}</td>
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
            @input="capSize($event, item)"
            :max="getMaxSize(item)"
            type="number"
          />
        </td>
        <td>
          <input @input="updateItem(item)" v-model="item.img" type="text" />
        </td>
      </tr>
    </table>
    <button type="button" @click="sendMsg">Sync</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, ComputedRef, onMounted } from 'vue'
import browser from 'webextension-polyfill'
import { Slots, Slot, Item, Items } from '../types/types'

const items = ref<Items>({})
const slots = ref<Slots>({})

const itemList = computed(() => Object.values(items.value))

onMounted(() => {
  sendMsg()
})

const addSlot = () => {
  const slot: Slot = {
    id: Date.now().toString(),
    name: '',
    size: 0
  }
  slots.value[slot.id] = slot
  updateSlots()
}

const slotsUsed: ComputedRef<Record<string, number>> = computed(() =>
  Object.values(slots.value).reduce((obj, slot) => {
    const totalItems = Object.values(items.value)
      .filter((item) => item.slot === slot.id)
      .reduce((total, item) => total + item.size, 0)
    return { ...obj, [slot.id]: totalItems }
  }, {})
)

const slotsFull: ComputedRef<Record<string, boolean>> = computed(() =>
  Object.values(slots.value).reduce((obj, slot) => {
    return { ...obj, [slot.id]: slotsUsed.value[slot.id] >= slot.size }
  }, {})
)

const isDisabled = (item: Item, slot: Slot) => {
  if (slot.id === 'none') {
    return false
  }
  return (
    slotsFull.value[item.slot] ||
    item.size > slot.size - slotsUsed.value[slot.id]
  )
}

const capSize = (event: Event, item: Item) => {
  const value = parseInt((event.target as HTMLInputElement).value)
  const maxSize = getMaxSize(item)
  if (value > maxSize) {
    item.size = maxSize
  } else {
    item.size = value
  }
  updateItem(item)
}

const getMaxSize = (item: Item) =>
  slots.value[item.slot]
    ? item.size + slots.value[item.slot].size - slotsUsed.value[item.slot]
    : 99

const removeSlot = (slot: Slot) => {
  delete slots.value[slot.id]
  Object.values(items.value).forEach((item) => {
    if (item.slot === slot.id) {
      item.slot = 'none'
      updateItem(item)
    }
  })
  updateSlots()
}

const updateItem = (item: Item) => {
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    if (tabs[0].id) {
      browser.tabs.sendMessage(tabs[0].id, {
        type: 'UPDATE_ITEM',
        value: item
      })
    }
  })
}

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

chrome.runtime.onMessage.addListener((request) => {
  if (request.type === 'SYNC') {
    console.log('popup sync')
    items.value = request.value.items
    slots.value = request.value.slots
  }
})

const sendMsg = () => {
  chrome.runtime.sendMessage({ type: 'INIT' })
  // browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
  //   if (tabs[0].id) {
  //     browser.tabs
  //       .sendMessage(tabs[0].id, { type: 'INIT' })
  //       .then((response: Items) => {
  //         items.value = response
  //       })
  //   }
  // })
}
</script>

<style scoped>
.container {
  text-align: center;
}

.bold {
  font-weight: bold;
}

table {
  text-align: left;
}
</style>
../types/types
