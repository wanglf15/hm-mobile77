import request from '@/utils/request'

// 获取联想建议列表
export const getSuggestions = q => {
  return request({
    method: 'GET',
    url: '/app/v1_0/suggestion',
    params: {
      q
    }
  })
}

// 获取搜索结果列表
export const getSearchResult = ({
  q,
  page = 1,
  perpage = 10
}) => {
  return request({
    method: 'GET',
    url: '/app/v1_0/search',
    params: {
      q,
      page,
      per_page: perpage
    }
  })
}
