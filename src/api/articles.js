import request from '@/utils/request'

// 获取文章列表
export const getArticles = data => {
  return request({
    method: 'GET',
    url: '/app/v1_1/articles',
    params: {
      channel_id: data.channel_id,
      timestamp: data.timestamp,
      with_top: 1
    }
  })
}
// 对文章不喜欢
export const dislikeArticle = articleId => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/dislikes',
    data: {
      target: articleId
    }
  })
}
// 举报文章
export const reportArticle = ({ articleId, type, remark }) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/reports',
    data: {
      target: articleId,
      type,
      remark
    }
  })
}
