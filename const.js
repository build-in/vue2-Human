export const UPLOAD_TYPE = '.png,.jpeg,.gif,.pdf,.jpg,.JPG,.xls,.xlsx,.csv,.doc,.docx,.txt,.mp4,.avi,.mkv,.wmv,.zip,.rar'
export const IMAGE_UPLOAD_TYPE = '.png, .jpeg, .gif, .gif, .jpg, .JPG, .JPEG'
export const FILE_UPLOAD_TYPE = '.pdf,.xls,.xlsx,.csv,.doc,.docx,.txt,.mp4,.avi,.mkv,.wmv,.zip,.rar'
export const DEFAULT_UPLOAD_IMAGE = 'https://sg-pay-private-ap-southeast-1.s3.ap-southeast-1.amazonaws.com/src/mmc/test/upload/workOrder/20240530/07ba4e3ca69e4d75928dac6fddd3229a/file2.png'

export const MAXLength = 200
export function getTimeWithTimeZone(time) {
  // 获取当前浏览器所在的时区
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  // 创建一个表示当前时间的 Date 对象
  const now = new Date(time)
  // 定义时间格式化选项
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: timezone
  }
  // 创建一个格式化器实例
  const formatter = new Intl.DateTimeFormat(undefined, options)
  // 格式化时间
  const formatted = formatter.format(now).replace(/\//g, '-').replace(',', '')
  return {
    timezone: timezone,
    formattedTime: formatted
  }
}
