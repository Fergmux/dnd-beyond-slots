<template>
  <div class="ct-content-group__header">
    <div class="ct-content-group__header-content">Slots</div>
  </div>
  <div class="container ct-content-group__content">
    <!-- SLOTS -->

    <draggable
      :modelValue="slotsArray"
      tag="div"
      style="display: flex; flex-wrap: wrap"
      @update:modelValue="moveSlot"
    >
      <template #item="{ element: slot }">
        <!-- <div @mouseover.stop="onDragOver"> -->
        <div style="margin-right: 15px">
          <h4>{{ slot.name }}</h4>

          <!-- ITEMS -->
          <draggable
            tag="div"
            @update:modelValue="moveItem($event, slot)"
            :modelValue="itemsFormatted[slot.id]"
            @start="dragging = true"
            @end="dragging = false"
            group="items"
            class="slotList"
          >
            <template #item="{ element: item }">
              <div
                :style="{
                  'background-image': `url(${item.img})`,
                  width: `${(item.size || 1) * 70}px`
                }"
                class="slot"
              >
                {{ item.name }}
                <span class="footer">{{
                  item.quantity > 1 ? item.quantity : ''
                }}</span>
              </div>
            </template>
          </draggable>
        </div>
      </template>
    </draggable>
    <!-- </div> -->

    <!-- UNSLOTTED ITEMS -->
    <h4>Other items</h4>
    <draggable
      tag="div"
      @update:modelValue="moveItem($event, { id: 'none' })"
      :modelValue="otherItems"
      group="items"
      class="slotList"
    >
      <template #item="{ element: item }: { element: Item }">
        <div
          :style="{
            'background-image': `url(${item.img})`,
            width: `${item.size * 70}px`
          }"
          class="slot"
        >
          {{ item.name }}
          <span class="footer">{{
            item.quantity > 1 ? item.quantity : ''
          }}</span>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts">
import { computed, ComputedRef, ref, Ref, WritableComputedRef } from 'vue'
import draggable from 'vuedraggable'
import { Item, Items, Slot, Slots, SyncEvent } from '../types/types'

// GENERAL //

// watch for changes to the data
chrome.runtime.onMessage.addListener((request: Event) => {
  if (request.type === 'SYNC') {
    console.log('manager sync')
    const syncEvent = request as unknown as SyncEvent
    items.value = syncEvent.value.items
    slots.value = syncEvent.value.slots
  }
})

// item being dragged
const dragging = ref(false)

// SLOTS //

const slots: Ref<Slots> = ref({})
const slotsArray = computed(() =>
  Object.values(slots.value).sort((a, b) => a.index - b.index)
)

const updateSlots = () =>
  chrome.runtime.sendMessage({ type: 'UPDATE_SLOTS', value: slots.value })

// intercept a slot draggable move
const moveSlot = (slotArray: Slot[]) => {
  slotArray.forEach((slot, index) => {
    slot.index = index
  })
  updateSlots()
}

// ITEMS //

const items: Ref<Items> = ref({})
const trackedItems = computed(() =>
  Object.values(items.value).filter((item) => item.track)
)
const updateItem = (item: Item[]) => {
  chrome.runtime.sendMessage({ type: 'UPDATE_ITEM', value: item })
}
// unslotted items
const otherItems = computed(() => {
  const noSlot = trackedItems.value.filter(
    (item) => item.slot === 'none' && item.track
  )
  return noSlot.length ? noSlot : [{}]
})

// an object with key: slotId and value: array of items
type ItemSlot = Record<string, Item[]>
const itemSlots: ComputedRef<ItemSlot> = computed(
  () =>
    Object.values(slots.value).reduce(
      (obj: ItemSlot, slot: Slot) => ({
        ...obj,
        [slot.id]: trackedItems.value.filter(
          (item: Item) => item.slot === slot.id
        )
      }),
      {}
    ),
  {}
)

// the arranged items (keyed by slot)
const itemsFormatted: WritableComputedRef<Record<string, Item[]>> = computed({
  get() {
    return Object.values(slots.value).reduce((obj, slot) => {
      return {
        ...obj,
        [slot.id]: formatItems(slot)
      }
    }, {})
  },
  set(newValue) {
    console.log(newValue, 'FUCK')
  }
})

// intercept an item draggable move
const moveItem = (itemArray: Item[], slot: { id: string; size?: number }) => {
  if (
    itemArray.reduce((total, item) => total + (item.size ?? 0), 0) <=
    (slot.size && slot.id !== 'none' ? slot.size : Infinity)
  ) {
    const updatedItems = itemArray.map((item: Item, index: number) => ({
      ...item,
      index,
      slot: slot.id
    }))
    updateItem(updatedItems)
  }
}

// arrange the items in the slot
const formatItems = (slot: Slot) => {
  const totalItems = trackedItems.value
    .filter((item) => item.slot === slot.id)
    .reduce((total, item) => total + item.size, 0)

  let formattedItems: Item[] = []
  const orderedItems = itemSlots.value[slot.id].sort((a, b) =>
    a.index === -1 ? 1 : a.index - b.index
  )

  orderedItems.forEach((item: Item, index: number) => {
    formattedItems[index] = item
    item.index = index
  })

  const spaces = slot.size - totalItems
  formattedItems.push(...Array(spaces < 0 ? 0 : spaces).fill({}))

  return formattedItems
}

// const onDragOver = (event: Event) => {
//   if (dragging.value && event.target instanceof Element) {
//     console.log(event.target, 'event.target', dragging.value)
//     event.target.scrollIntoView({ behavior: 'smooth', block: 'center' })
//   }
//   // event.preventDefault()
// }
</script>

<style lang="scss">
.container {
  padding-bottom: 20px;
  text-align: left;
}

.slotList {
  display: flex;
  flex-wrap: wrap;

  .slot {
    position: relative;
    padding: 2px;
    width: 70px;
    height: 70px;
    border: 1px solid white;
    background-repeat: no-repeat;
    background-size: cover;
    overflow: hidden;
    font-weight: bold;
    text-shadow:
      2px 2px 5px black,
      -2px 2px 5px black,
      2px -2px 5px black,
      -2px -2px 5px black;
    color: white;

    .footer {
      position: absolute;
      font-size: 10px;
      right: 4px;
      bottom: 0;
    }
  }
}
</style>
