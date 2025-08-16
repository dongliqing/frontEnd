<template>
  <div class="flex flex-col h-full">
    <header class="text-center bg-[#ddd] h-[45px] leading-[45px]">大模型触发工具函数</header>
    <div ref="chatContainer" class="flex-1 overflow-y-auto py-[20px]">
      <div v-for="(item, index) in messageList" :key="index">
        <UserInfo v-if="item.role === 'user'" :content="item.content" />
        <SystemInfo v-else :content="item.content" />
      </div>
      <Loading v-if="isLoaing" />
    </div>
    <footer class="h-[100px] bg-[#ddd] flex p-[20px]">
      <el-input type="textarea" :rows="4" @keyup.enter.prevent="handleSend" placeholder="请输入聊天消息" class="flex-1 h-[100px]"
        v-model="inputValue" />
      <el-button type="primary" class="ml-[20px]" :disabled="isLoaing" @click="handleSend">发送</el-button>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick, } from 'vue';
import UserInfo from '@/components/UserInfo.vue';
import SystemInfo from '@/components/SystemInfo.vue';
import { textChatUseTool } from "@/api/common";
import Loading from '@/components/Loading.vue';

const chatContainer = ref<HTMLElement | null>(null);
const inputValue = ref();
// const requestStreamFinish = ref(false);  // 请求标识
const isLoaing = ref(false);  // 响应标识
const messageList = ref([]);


const handleSend = () => {
  if (isLoaing.value) {
    return;
  }
  const content = inputValue.value.trim();
  if (!content) {
    return;
  }

  inputValue.value = '';
  //推送到聊天框中
  messageList.value.push({
    role: 'user',
    content
  });
  //滚动到底部
  scrollToBottom();

  //设置请求表示
  isLoaing.value = true;


  textChatUseTool({ content }).then((res) => {
    console.log('res data:', res);
    messageList.value.push({
      role: 'assistant',
      content: res.data,
    });

    //滚动到底部
    scrollToBottom();

  }).catch((error) => {
    console.error('Error fetching weather data:', error);
  }).finally(() => {
    isLoaing.value = false;
  })

}



const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
};
</script>

<style lang="less" scoped></style>