<template>
  <div class="flex pt-[10px]">
    <div class="w-[50%] bg-[var(--el-color-primary-light-5)] px-[20px] py-[5px] rounded-[10px] rounded-[8px] rounded-tl-none">
     火车票信息如下：：：
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ content?: string }>()


</script>

<style scoped></style>
