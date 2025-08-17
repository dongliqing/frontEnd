<template>
  <div class="border-[1px] border-[#ccc] rounded-[10px] max-w-[40%] py-[15px] px-[20px]">
    <h4 class="my-[10px]"> 猜你想问: </h4>

    <div v-for="(item, index) in questions" :key="index" class="pb-[10px] cursor-pointer hover:text-[#409eff]"
      @click="handleClick(item)">
      {{ item }}
    </div>

  </div>
</template>



<script setup lang="ts">

const emits = defineEmits(["select"]);

const questions = [
  "你是谁",
  "今天是几月几号",
  "杭州市明天天气怎么样",
]


const handleClick = (value) => {
  emits("select", value)
}

</script>


<style scoped></style>
