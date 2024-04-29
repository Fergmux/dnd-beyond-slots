<template>
  <div>Slots</div>
  <div class="container">
    <button @click="toggleVisbile">
      {{ visible ? 'Hide' : 'Show' }} slots
    </button>
    <div v-show="visible">
      {{ itemsFormatted }}
      <div v-for="slot in Object.values(slots)">
        <h4>{{ slot.name }}</h4>
        <div class="slotList">
          <div
            v-for="item in itemsFormatted[slot.id]"
            :style="{
              'background-image': `url(${item.img})`,
              width: `${item.size * 70}px`
            }"
            class="slot"
          >
            {{ item.name }}
          </div>
        </div>
      </div>
      <h4>Other items</h4>
      <div class="slotList">
        <div
          v-for="item in Object.values(items).filter(
            (item) => item.slot === 'none'
          )"
          :style="{
            'background-image': `url(${item.img})`,
            width: `${item.size * 70}px`
          }"
          class="slot"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, ComputedRef, Ref, PropType } from 'vue'
import { Slots, Slot, Item, Items, SyncEvent } from '../types/types'
import { Data } from '../types/Character'

defineProps({
  characterInfo: Object as PropType<Data>
})

const visible = ref(true)
const toggleVisbile = () => (visible.value = !visible.value)

// defineExpose({ setItem })

const items: Ref<Items> = ref({})
const slots: Ref<Slots> = ref({})

type ItemSlot = Record<string, Item[]>
const itemSlots: ComputedRef<ItemSlot> = computed(
  () =>
    Object.values(slots.value).reduce(
      (obj: ItemSlot, slot: Slot) => ({
        ...obj,
        [slot.id]: Object.values(items.value).filter(
          (item: Item) => item.slot === slot.id
        )
      }),
      {}
    ),
  {}
)

chrome.runtime.onMessage.addListener((request: Event) => {
  if (request.type === 'SYNC') {
    console.log('manager sync')
    const syncEvent = request as unknown as SyncEvent
    items.value = syncEvent.value.items
    slots.value = syncEvent.value.slots
  }
})

const itemsFormatted: ComputedRef<Record<string, Item[]>> = computed(() =>
  Object.values(slots.value).reduce((obj, slot) => {
    const totalItems = Object.values(items.value)
      .filter((item) => item.slot === slot.id)
      .reduce((total, item) => total + item.size, 0)
    return {
      ...obj,
      [slot.id]: [
        ...itemSlots.value[slot.id],
        ...Array(slot.size - totalItems >= 0 ? slot.size - totalItems : 0).fill(
          ''
        )
      ]
    }
  }, {})
)
// {
// equipped: Array(4).fill('').map(format(itemSlots.value.equipped)),
// pockets: Array(6).fill('').map(format(itemSlots.value.pockets)),
// worn: Array(13).fill('').map(format(itemSlots.value.worn)),
// backpack: Array(15).fill('').map(format(itemSlots.value.backpack)),
// none: itemSlots.value.none
// }))
</script>

<style lang="scss">
.container {
  text-align: left;
}

.slotList {
  display: flex;
  flex-wrap: wrap;

  .slot {
    width: 70px;
    height: 70px;
    border: 1px solid white;
    background-repeat: no-repeat;
    background-size: cover;
    overflow: hidden;

    // margin-right: 10px;
  }
}
</style>
