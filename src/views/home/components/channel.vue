<template>
  <div class='container'>
    <van-popup
      :style="{ height: '95%' }"
      :value="value"
      @input="$emit('input', $event)"
      position="bottom"
      round
    >
    <van-cell icon="cross" @click="$emit('input', false)" />
    <van-cell title="我的频道" label="点击进入频道">
      <van-button
        v-if="!isEdit"
        round
        plain
        type="info"
        size="mini"
        @click="isEdit = !isEdit"
        icon="edit"
        style="padding: 0 10px;"
      >编辑</van-button>
      <van-button
        v-else
        round
        plain
        type="info"
        size="mini"
        @click="isEdit = !isEdit"
      >完成</van-button>
    </van-cell>
    <van-grid :gutter="10" >
      <van-grid-item
        v-for="(channel, index) in mychannels"
        :key="channel.id"
        :text="channel.name"
        @click="onAddrecommend(index, channel.id)"
      >
        <span class="grid-text" :class="{ active: index === activeIndex }">{{ channel.name }}</span>
        <van-icon
          class="close-icon"
          name="close"
          v-show="isEdit"
        />
      </van-grid-item>
    </van-grid>

    <van-cell title="推荐频道" label="点击添加频道" />
    <van-grid :gutter="10">
      <van-grid-item
        v-for="channel in recommendChannels"
        :key="channel.id"
        :text="' + ' + channel.name"
        @click="onAddChannel(channel)"
      />
    </van-grid>
  </van-popup>
  </div>
</template>

<script>
import { getAllChannels, deleteUserChannel, addUserChannel } from '@/api/channel'
import { mapState } from 'vuex'
export default {
  name: 'MyChannels',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    mychannels: {
      type: Array,
      default: () => []
    },
    activeIndex: {
      type: Number
    }
  },
  data () {
    return {
      allChannels: [],
      isEdit: false
    }
  },
  computed: {
    ...mapState(['user']),
    // 剩余推荐频道
    recommendChannels () {
      const channels = this.allChannels.filter(item => {
        const ret = this.mychannels.find(channel => {
          return item.id === channel.id
        })
        return !ret
      })
      return channels
    }

  },
  created () {
    this.loadAllChannels()
  },
  methods: {
    // 获取所有频道
    async loadAllChannels () {
      const { data } = await getAllChannels()
      const { channels } = data.data
      channels.forEach(channel => {
        channel.articles = []
        channel.loading = false
        channel.finshed = false
        channel.pullLoading = false
        channel.timestamp = null
      })
      this.allChannels = channels
    },
    // 点击添加到我的频道
    async onAddChannel (channel) {
      this.mychannels.push(channel)
      if (this.user) {
        // 登录状态，发请求将数据保存到后台
        await addUserChannel(channel.id, this.mychannels.length)
      } else {
        // 非登录状态，存储到本地
        this.saveMyUser()
      }
    },
    // 从我的频道移除
    async onAddrecommend (index, channelId) {
      // 编辑状态，进行删除操作
      if (this.isEdit) {
        this.mychannels.splice(index, 1)
        // 如果为登录状态，发请求给后台删除数据
        if (this.user) {
          await deleteUserChannel(channelId)
        } else {
          // 非登录状态，则将数据保存到本地
          this.saveMyUser()
        }
      } else {
        // 非编辑状态，进行跳转操作
        this.$emit('update-active', index)
        // 关闭弹窗
        this.$emit('input', false)
      }
    },
    // 讲频道持久化存储到本地
    saveMyUser () {
      window.localStorage.setItem('my-Channels', JSON.stringify(this.mychannels))
    }
  }
}
</script>

<style scoped lang='less'>
.close-icon {
  position: absolute;
  right: -5px;
  top: -5px;
}
.van-grid-item {
  margin-right: 20px;
  margin-left: 10px;
  margin-top: 10px;
  padding-right: 0px!important;
  height: 38px;
  border: 1px solid rgb(238, 229, 229)!important;
  border-radius: 10px!important;
}
.van-grid-item__content {
  border: 1px solid rgb(180, 179, 179);
}
.grid-text {
  color: #7d7e80;
  font-size: 12px;
}

.active {
  color: rgb(14, 145, 252);
}
</style>
