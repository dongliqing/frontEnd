<template>
  <div class="flex flex-col h-full">
    <header class="text-center bg-[#ddd] h-[45px] leading-[45px]">天气数据格式化</header>
    <div ref="chatContainer" class="flex-1 overflow-y-auto py-[20px]">

      <CommonQuestion @select="(e) => { inputValue = e; scrollToBottom() }" />

      <div v-for="(item, index) in messageList" :key="index">
        <UserInfo v-if="item.role === 'user'" :content="item.content" />

        <div v-else-if="item.toolName === 'getCurrentWeather'"
          class="mt-[20px] max-w-[80%] bg-[#a0cfff85] px-[20px] py-[10px] rounded-[10px] rounded-tl-none">
          <h3> {{ item.location }}</h3>
          <div v-for="(weather, index) in item.toolData" :key="index" class=">span:w-[30px]">
            <el-card class="mb-[10px]">{{ weather.fxDate }} | {{ weather.textDay }} | 最高气温：{{ weather.tempMax }}℃ | 最低气温：{{ weather.tempMin }}℃</el-card>
          </div>
        </div>

        <SystemInfo v-else :content="item.content" />
      </div>
      <Loading v-if="isLoaing" />
    </div>
    <footer class="h-[100px] bg-[#ddd] flex p-[20px]">
      <el-input type="textarea" :rows="3" @keyup.enter.prevent="handleSend" placeholder="请输入聊天消息"
        class="flex-1 h-[100px] !text-[20px] !text-[#000]" v-model="inputValue" />
      <el-button type="primary" class="ml-[20px]" :disabled="isLoaing" @click="handleSend">发送</el-button>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick, } from 'vue';
import UserInfo from '@/components/UserInfo.vue';
import SystemInfo from '@/components/SystemInfo.vue';
import CommonQuestion from '@/components/CommonQuestion.vue';
import { textChatUseToolFormat, } from "@/api/common";
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


  textChatUseToolFormat({ content }).then((res) => {
    // console.log('res data:', res);
    try {
      const result = JSON.parse(res.data);
      messageList.value.push({
        role: 'assistant',
        ...result,
      });
    } catch (error) {
      messageList.value.push({
        role: 'assistant',
        content: res.data,
      });
    }


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