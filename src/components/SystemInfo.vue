<template>
  <div class="flex pt-[10px]">
    <pre
      class="max-w-[80%] bg-[#a0cfff85] px-[20px] py-[10px] rounded-[10px] rounded-[8px] rounded-tl-none  whitespace-break-spaces"
      v-html="props.content"></pre>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ content?: string }>()

</script>

<style scoped></style>
