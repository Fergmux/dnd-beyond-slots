<template>
  <Manager ref="manager" />
</template>

<script setup lang="ts">
import Manager from './Manager.vue'
import { ref } from 'vue'

const manager = ref(null)
</script>
