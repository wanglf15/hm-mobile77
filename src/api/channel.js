import request from '@/utils/request'

// 获取默认频道列表
export const getDefaultOrUserChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/channels'
  })
}

// 获取全部频道列表
export const getAllChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/channels'
  })
}

// 删除用户频道列表
export const deleteUserChannel = (channelId) => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/channels/${channelId}`
  })
}

// 添加用户频道列表
export const addUserChannel = (id, seq) => {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/channels',
    data: {
      channels: [
        {
          id,
          seq
        }
      ]
    }
  })
}
