import request from "@/utils/request";

export const getWeather = (params) => {
    return request({
        method: "get",
        url: "/api/weather",
        params,
    });
};

export const sendMsg = (data) => {
    return request({
        method: "post",
        url: "/send-msg",
        data,
    });
};

 
//单轮文字对话
export const textChat = (data) => {
    return request({
        method: "post",
        url: "/api/textChat",
        data,
    });
};



//调用工具接口
export const textChatUseTool = (data) => {
    return request({
        method: "post",
        url: "/api/textChatUseTool",
        data,
    });
};



