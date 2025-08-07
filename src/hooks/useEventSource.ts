// composables/useEventSource.ts
import { ref, onUnmounted } from 'vue'

interface UseEventSourceOptions {
  withCredentials?: boolean  
  autoConnect?: boolean
}

export function useEventSource(
  url: string, 
  options: UseEventSourceOptions = {}
) {
  const { withCredentials = false, autoConnect = false } = options
  
  const data = ref<string>('')
  const event = ref<string>('')
  const lastEventId = ref<string>('')
  const readyState = ref<number>(EventSource.CONNECTING)
  const error = ref<Event | null>(null)
  
  let eventSource: EventSource | null = null
  
  const connect = () => {
    if (eventSource) {
      return
    }
    
    eventSource = new EventSource(url, { withCredentials })
    
    eventSource.onopen = () => {
      readyState.value = eventSource!.readyState
    }
    
    eventSource.onmessage = (e) => {
      data.value = e.data
      event.value = e.type
      lastEventId.value = e.lastEventId
      readyState.value = eventSource!.readyState

      console.log('1', e);
    }
    
    eventSource.onerror = (e) => {
      error.value = e
      readyState.value = eventSource!.readyState
    }
  }
  
  const close = () => {
    if (eventSource) {
      eventSource.close()
      eventSource = null
    }
    readyState.value = EventSource.CLOSED  
  }
  
  if (autoConnect) {
    connect()
  }
  
  onUnmounted(() => {
    close()
  })
  
  return {
    data,
    event,
    lastEventId,
    readyState,
    error,
    connect,
    close
  }
}