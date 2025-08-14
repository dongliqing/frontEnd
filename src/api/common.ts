import request from "@/utils/request";

export const getUserDetail = (params) => {
    return request({
        method: "get",
        url: "/api/getUserDetail",
        params,
    });
};

export const userLogin = (data) => {
    return request({
        method: "post",
        url: "/api/userLogin",
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



//调用工具接口并格式化数据
export const textChatUseToolFormat = (data) => {
    return request({
        method: "post",
        url: "/api/textChatUseToolFormat",
        data,
    });
};
