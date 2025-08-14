<template>
  <div class="flex justify-end pt-[10px]">
    <div
      class="max-w-[60%] bg-[var(--el-color-primary-light-5)] px-[20px] py-[10px] rounded-[10px] rounded-tr-none whitespace-break-spaces"
      v-html="props.content">
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ content: string }>()

</script>

<style scoped></style>
