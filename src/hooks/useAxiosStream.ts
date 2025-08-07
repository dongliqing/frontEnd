// composables/useAxiosStream.ts
import { ref, onUnmounted } from 'vue'
import axios, { AxiosRequestConfig } from 'axios'

interface StreamResponse {
    data: string
    chunks: string[]  // 存储所有数据块
    loading: boolean
    error: string | null
    start: () => void
    stop: () => void
    clear: () => void
}

export function useAxiosStream(url: string, config: AxiosRequestConfig = {}): StreamResponse {
    const data = ref('')
    const chunks = ref<string[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    let abortController: AbortController | null = null

    const start = async () => {
        if (loading.value) return

        loading.value = true
        error.value = null
        chunks.value = []

        abortController = new AbortController()

        try {
            let accumulatedData = ''

            const response = await axios({
                url,
                method: 'POST',
                responseType: 'text', // 使用 stream 响应类型
                signal: abortController.signal,
                ...config,
                onDownloadProgress: (progressEvent) => {
                    console.log("🚀 ~ start ~ progressEvent:", progressEvent)
                    
                    // 处理逐步到达的数据
                    if (progressEvent.currentTarget) {
                        const newData = progressEvent.currentTarget.response
                        const newChunk = newData.substring(accumulatedData.length)

                        if (newChunk) {
                            accumulatedData = newData
                            data.value = newData
                            chunks.value.push(newChunk)
                        }
                    }

                    // 调用用户提供的进度回调
                    if (config.onDownloadProgress) {
                        config.onDownloadProgress(progressEvent)
                    }
                }
            })

            data.value = response.data
        } catch (err: any) {
            if (err.name !== 'AbortError') {
                error.value = err.message || '请求失败'
            }
        } finally {
            loading.value = false
        }
    }

    const stop = () => {
        if (abortController) {
            abortController.abort()
        }
        loading.value = false
    }

    const clear = () => {
        data.value = ''
        chunks.value = []
        error.value = null
    }

    onUnmounted(() => {
        stop()
    })

    return {
        data: data.value,
        chunks: chunks.value,
        loading: loading.value,
        error: error.value,
        start,
        stop,
        clear
    }
}