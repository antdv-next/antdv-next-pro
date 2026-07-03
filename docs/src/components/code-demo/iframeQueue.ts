// 全局 iframe 加载队列，确保同一时间只有一个 iframe 在加载
type LoadCallback = () => void

const queue: LoadCallback[] = []
let isLoading = false
let timeoutId: ReturnType<typeof setTimeout> | null = null

// 超时时间：如果一个 iframe 在 15 秒内没有加载完成，自动继续下一个
const LOAD_TIMEOUT = 15000

export function enqueueIframeLoad(callback: LoadCallback) {
  queue.push(callback)
  processQueue()
}

function processQueue() {
  if (isLoading || queue.length === 0) {
    return
  }
  isLoading = true
  const next = queue.shift()
  next?.()

  // 设置超时，防止队列卡住
  timeoutId = setTimeout(() => {
    console.warn('[iframe-queue] Load timeout, proceeding to next')
    onIframeLoaded()
  }, LOAD_TIMEOUT)
}

export function onIframeLoaded() {
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
  isLoading = false
  // 延迟一下再加载下一个，给浏览器喘息时间
  setTimeout(processQueue, 100)
}
