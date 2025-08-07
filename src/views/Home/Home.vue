<template>
  <div class="flex flex-col h-full">
    <header class="text-center bg-[#ddd] h-[45px] leading-[45px]">我的AI应用</header>
    <div ref="chatContainer" class="flex-1 overflow-y-auto py-[20px]">
      <div v-for="(item, index) in massageList" :key="index">
        <UserInfo v-if="item.role === 'user'" :content="item.content" />
        <SystemInfo v-else :content="item.content" />
      </div>
      <!-- <TicketInfo /> -->
    </div>
    <footer class="h-[100px] bg-[#ddd] flex p-[20px]">
      <el-input type="textarea" @keyup.enter.prevent="handleSend" placeholder="请输入聊天消息" class="flex-1 h-[100px]"
        v-model="inputValue" />
      <el-button type="primary" class="ml-[20px]" :disabled="requestFlag" @click="handleSend">发送</el-button>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick, watch } from 'vue';
import UserInfo from '@/components/UserInfo.vue';
import SystemInfo from '@/components/SystemInfo.vue';
import TicketInfo from '@/components/TicketInfo.vue';
import { getWeather, streamTextChat, textChat, fetchStreamData } from "@/api/common";


const chatContainer = ref<HTMLElement | null>(null);
const inputValue = ref();
const requestFlag = ref(false);  // 请求标识
const isLoaing = ref(false);  // 响应标识
const massageList = ref([]);


// getWeather({ data: "hangzhou" }).then((res) => {
//   console.log('Weather data:', res);
// }).catch((error) => {
//   console.error('Error fetching weather data:', error);
// });

// textChat({}).then((res) => {
//   console.log('textChat:', res);
// }).catch((error) => {
//   console.error('Error fetching weather data:', error);
// });


const handleSend = () => {
  if (requestFlag.value) {
    return;
  }
  const content = inputValue.value.trim();
  if (!content) {
    return;
  }
  
  inputValue.value = '';
  //推送到聊天框中
  massageList.value.push({
    role: 'user',
    content
  });
  //滚动到底部
  scrollToBottom();

  //设置请求表示
  requestFlag.value = true;
  isLoaing.value = true;

  const curIndex = massageList.value.length;

  // const url = "/api/streamTextChat";
  const url = "/api/multiRoundsStreamTextChat";
  fetchStreamData(url, {
    content
  }, {
    onMessage: (data) => {
      isLoaing.value = false;

      const curMeaasge = massageList.value[curIndex];
      if (curMeaasge) {
        curMeaasge.content += data;
      } else {
        massageList.value.push({
          role: 'assistant',
          content: data
        })
      }

      //滚动到底部
      scrollToBottom();
    },
    onDone: () => {
      requestFlag.value = false;
    },
    onError: (err) => {
      console.log('onError', err);
    }
  });
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