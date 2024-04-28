<template>
  <div>Slots</div>
  <div class="container">
    <div>
      <h4>Equipped</h4>
      <div class="slotList">
        <div v-for="item in itemsFormatted.equipped" class="slot">
          {{ item }}
        </div>
      </div>
      <h4>Pockets</h4>
      <div class="slotList">
        <div v-for="item in itemsFormatted.pockets" class="slot">
          {{ item }}
        </div>
      </div>
      <h4>Worn</h4>
      <div class="slotList">
        <div v-for="item in itemsFormatted.worn" class="slot">{{ item }}</div>
      </div>
      <h4>Backpack</h4>
      <div class="slotList">
        <div v-for="item in itemsFormatted.backpack" class="slot">
          {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, ComputedRef, Ref } from 'vue'
import { Slot, Item } from '../types'

const setItem = (item: Item) => {
  console.log(items)
  console.log(items.value)
  console.log(item.slot)
  console.log(items.value[item.slot])
  items.value[item.slot].push(item.name)
}

defineExpose({ setItem })

const items: Ref<Record<Slot, string[]>> = ref({
  equipped: [],
  pockets: [],
  worn: [],
  backpack: []
})

const format =
  (array: string[]) =>
  (item: string, index: number): string =>
    array[index] ? array[index] : item

const itemsFormatted: ComputedRef<Record<Slot, string[]>> = computed(() => ({
  equipped: Array(4).fill('').map(format(items.value.equipped)),
  pockets: Array(6).fill('').map(format(items.value.pockets)),
  worn: Array(13).fill('').map(format(items.value.worn)),
  backpack: Array(15).fill('').map(format(items.value.backpack))
}))
</script>

<style lang="scss">
.container {
  text-align: left;
}

.slotList {
  display: flex;

  .slot {
    width: 50px;
    height: 50px;
    border: 1px solid white;
    // margin-right: 10px;
  }
}
</style>
