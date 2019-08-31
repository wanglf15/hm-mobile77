import Dayjs from 'dayjs'

import 'dayjs/locale/zh-cn'
import rTime from 'dayjs/plugin/relativeTime'
Dayjs.locale('zh-cn')
Dayjs.extend(rTime)

export const relativeTime = time => {
  return Dayjs().from(Dayjs(time))
}
