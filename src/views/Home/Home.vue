<template>
  <div class="flex flex-col h-full">
    <header class="text-center bg-[#ddd] h-[45px] leading-[45px]">我的AI应用</header>
    <div ref="chatContainer" class="flex-1 overflow-y-auto py-[20px]">

      <div v-for="(item, index) in messageList" :key="index">
        <UserInfo v-if="item.role === 'user'" :content="item.content" />
        <SystemInfo v-else :content="item.content" />
      </div>
      <Loading v-if="isLoaing" />

    </div>
    <footer class="h-[100px] bg-[#ddd] flex p-[20px]">
      <el-input type="textarea" :rows="4" @keyup.enter.prevent="handleSend" placeholder="请输入聊天消息"
        class="flex-1 h-[100px]" v-model="inputValue" />
      <el-button type="primary" class="ml-[20px]" :disabled="requestStreamFinish" @click="handleSend">发送</el-button>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick, } from 'vue';
import UserInfo from '@/components/UserInfo.vue';
import SystemInfo from '@/components/SystemInfo.vue';
import { getUserDetail, userLogin, textChat } from "@/api/common";
import { fetchStreamData } from "@/utils/fetchStream";
import { marked } from 'marked'

const chatContainer = ref<HTMLElement | null>(null);
const inputValue = ref();
const requestStreamFinish = ref(false);  // 请求流结束标识
const isLoaing = ref(false);  // 响应标识
const messageList = ref([]);


//测试get接口
getUserDetail({ id: "111" }).then((res) => {
  console.log('res:', res);
})
//测试post接口
userLogin({ name: "username" }).then((res) => {
  console.log('res:', res);
})


const handleSend = () => {
  if (requestStreamFinish.value) {
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
  requestStreamFinish.value = true;
  isLoaing.value = true;


  //简单请求
  doRequestSimple(content);

  //请求流式输出 单轮对话接口
  // doRequestStream(content, false);
  
  //请求流式输出 多轮对话的接口
  // doRequestStream(content, true);
}



const doRequestSimple = (content) => {
  textChat({ content: content }).then((res) => {
    // console.log('11:', res);
    messageList.value.push({
      role: 'assistant',
      // content: res.data.choices[0].message.content,
      content: marked(res.data.choices[0].message.content),
    });
  }).catch((error) => {
    console.error('Error fetching weather data:', error);
  }).finally(() => {
    isLoaing.value = false;
    requestStreamFinish.value = false;
  })
}

const doRequestStream = (content, isMultiRounds = false) => {
  const curIndex = messageList.value.length;

  // const url = "/api/streamTextChat";   //单轮流式输出
  const url = isMultiRounds ? "/api/multiRoundsStreamTextChat" : "/api/streamTextChat";

  fetchStreamData(url, {
    content
  }, {
    onMessage: (data) => {
      isLoaing.value = false;

      const curMeaasge = messageList.value[curIndex];
      if (curMeaasge) {
        curMeaasge.oriContent += data;
        curMeaasge.content = marked(curMeaasge.oriContent);
      } else {
        messageList.value.push({
          role: 'assistant',
          content: data,
          oriContent: data,
        })
      }

      //滚动到底部
      scrollToBottom();
    },
    onDone: () => {
      requestStreamFinish.value = false;
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