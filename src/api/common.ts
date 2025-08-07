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


export const streamTextChat = (data) => {
    return request({
        method: "post",
        url: "/api/streamTextChat",
        data,
        // responseType: 'blob'
    });
};


export const textChat = (data) => {
    return request({
        method: "post",
        url: "/api/textChat",
        data,
    });
};


export async function fetchStreamData(url, params, { onMessage, onDone, onError }) {
    let reader;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
        });

        reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');

        while (true) {
            try {
                const { done, value } = await reader.read();

                if (done) {
                    console.log('流传输完成');
                    onDone && onDone();
                    break;
                }

                // 解码获取到的数据
                const chunk = decoder.decode(value, { stream: true });
                console.log('chunk:', chunk);

                // 处理每一行数据
                const lines = chunk.split('\n\n').filter(line => line.trim());
                lines.forEach(line => {
                    if (line.startsWith('data:')) {
                        const data = line.slice(5);
                        // 解析出具体内容
                        onMessage && onMessage(JSON.parse(data).content);
                    }
                });
            } catch (readError) {
                onError && onError(readError);
                // 在循环内部捕获读取错误，确保能退出循环
                throw readError;
            }
        }
    } catch (error) {
        // 确保在发生错误时调用 onError 回调
        console.error('请求异常:', error);
        onError && onError(error);
    } finally {
        // 确保释放资源
        if (reader) {
            try {
                reader.releaseLock();
            } catch (e) {
                console.warn('释放读取器时出错:', e);
            }
        }
    }
}