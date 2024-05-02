<template>
  <Manager ref="manager" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Manager from './Manager.vue'

const manager = ref(null)
</script>
