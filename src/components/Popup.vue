<template>
  <div class="container">
    <h1>Inventory Management</h1>
    <table>
      <tr>
        <th>Item</th>
        <th>Slot</th>
      </tr>

      <tr v-for="item in items">
        <td :class="{ bold: item.slot }">{{ item.name }}{{ item.slot }}</td>
        <td>
          <select v-model="item.slot" @change="emitChange(item)">
            <option disabled value="">Select</option>
            <option :value="Slot.equipped">Equipped</option>
            <option :value="Slot.pockets">Pockets</option>
            <option :value="Slot.worn">Worn</option>
            <option :value="Slot.backpack">Backpack</option>
            <option value="">None</option>
          </select>
        </td>
      </tr>
    </table>
    <button type="button" @click="sendMsg">Sync</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import browser from 'webextension-polyfill'
import { Slot, Item } from '../types'

const items = ref<Item[]>([])

onMounted(() => {
  sendMsg()
})

const emitChange = (item: Item) => {
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    if (tabs[0].id) {
      browser.tabs.sendMessage(tabs[0].id, {
        type: 'UPDATE',
        value: { item }
      })
    }
  })
}

const sendMsg = () => {
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    if (tabs[0].id) {
      browser.tabs
        .sendMessage(tabs[0].id, { type: 'INIT' })
        .then((newItems) => {
          items.value = newItems.map((item: string, index: number) => ({
            name: item,
            slot: null,
            index
          }))
          console.log(newItems, 'Message sent, APP')
        })
    }
  })
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
