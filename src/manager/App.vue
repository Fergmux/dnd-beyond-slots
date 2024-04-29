<template>
  <Manager :characterInfo ref="manager" />
</template>

<script setup lang="ts">
import Manager from './Manager.vue'
import { ref, PropType } from 'vue'
import { Data } from '../types/Character'

defineProps({
  characterInfo: Object as PropType<Data>
})

const manager = ref(null)
</script>
