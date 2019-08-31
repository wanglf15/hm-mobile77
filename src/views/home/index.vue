<template>
  <div class='container'>
    <van-nav-bar title="" fixed />
    <van-button class="btn" icon="search" @click="onSearch" >请输入搜索内容</van-button>
    <van-tabs v-model="active">
        <van-tab v-for="channel in channels" :title="channel.name" :key="channel.id">
          <van-pull-refresh v-model="channel.pullLoading" @refresh="onRefresh">
            <van-list
              v-model="channel.loading"
              :finished="channel.finished"
              finished-text="没有更多了"
              @load="onLoad"
            >
              <van-cell
                v-for="article in channel.articles"
                :key="article.art_id.toString()"
                :title="article.title"
              >
              <div slot="label">
                <van-grid :border="false" :column-num="3">
                  <van-grid-item v-for="(img, index) in article.cover.images" :key="index">
                    <van-image height="80" :src="img" />
                  </van-grid-item>
                </van-grid>
                <div class="article-info">
                  <div class="meta">
                    <span>{{ article.aut_name }}</span>
                    <span>{{ article.comm_count }}评论</span>
                    <span>{{ article.pubdate | relativeTime }}</span>
                  </div>
                  <van-icon name="close" @click="openDialog(article)"/>
                </div>
              </div>
              </van-cell>
            </van-list>
          </van-pull-refresh>
        </van-tab>
        <div slot="nav-right" class="wap-nav">
          <van-icon name="wap-nav" size="24" @click="isChannelEditShow = true" />
        </div>
    </van-tabs>
    <moreAction
      v-model="isShow"
      :article="currentArticle"
      @dislike-success="removeArticle"
      @add-blackList-success="onAddBlackListSuccess"
    ></moreAction>
    <MyChannels
      v-model="isChannelEditShow"
      :mychannels="channels"
      :active-index="active"
      @update-active="active = $event"
    >
    </MyChannels>
  </div>
</template>

<script>
import { getDefaultOrUserChannels } from '@/api/channel'
import { getArticles } from '@/api/articles'
import moreAction from './components/more-action'
import MyChannels from './components/channel'
import { mapState } from 'vuex'
export default {
  name: 'home',
  components: {
    moreAction,
    MyChannels
  },
  data () {
    return {
      active: 0,
      articles: [],
      channels: [],
      isShow: false,
      currentArticle: {},
      isChannelEditShow: false
    }
  },
  computed: {
    ...mapState(['user']),
    currentChannel () {
      // 获取当前激活的频道
      return this.channels[this.active]
    }
  },
  methods: {
    onSearch () {
      this.$router.push('/search')
    },
    onAddBlackListSuccess () {
      this.channels.forEach(channel => {
        const articles = channel.articles
        for (var i = 0; i < articles.length; i++) {
          if (articles[i].aut_id === this.currentArticle.aut_id) {
            articles.splice(i, 1)
            i--
          }
        }
      })
      // 关闭弹窗
      this.isShow = false
      this.$toast.success('拉黑成功')
    },
    // 对文章不喜欢成功，移除文章
    removeArticle () {
      const articles = this.currentChannel.articles
      const index = articles.findIndex(article => {
        return article.art_id.toString() === this.currentArticle.art_id.toString()
      })

      if (index !== -1) {
        articles.splice(index, 1)
      }
    },
    // 打开弹出层
    openDialog (article) {
      this.isShow = true
      this.currentArticle = article
    },
    // 下拉刷新
    async onRefresh () {
      const { currentChannel } = this
      const { data } = await getArticles({
        channel_id: currentChannel.id,
        timestamp: Date.now(), // 下拉刷新传递当前最新时间戳
        with_top: 1
      })
      // console.log(data)
      // 下拉刷新，将每次拿到的数据放到当前频道的文章列表顶部
      currentChannel.articles.unshift(...data.data.results)

      // 数据加载完毕，将当前频道的下拉刷新 loading 关闭
      currentChannel.pullLoading = false

      this.$toast('刷新成功')
    },
    async loadChannels () {
      let channels = []
      // 如果是已登录状态
      if (this.user) {
        channels = (await getDefaultOrUserChannels()).data.data.channels
      } else {
        // 未登录状态，去本地存储拿频道列表
        const localChannels = JSON.parse(window.localStorage.getItem('my-Channels'))
        if (localChannels) {
          channels = localChannels
        } else {
          channels = (await getDefaultOrUserChannels()).data.data.channels
        }
      }
      channels.forEach(channel => {
        channel.articles = []
        channel.loading = false
        channel.finshed = false
        channel.pullLoading = false
        channel.timestamp = null // 存储当前频道加载下一页数据的时间戳标志（页码）
      })
      this.channels = channels
    },
    async onLoad () {
      const { currentChannel } = this

      const { data } = await getArticles({
        timestamp: currentChannel.timestamp || Date.now(),
        channel_id: currentChannel.id,
        with_top: 1
      })
      // console.log(data)
      // const { results } = data.data
      currentChannel.articles.push(...data.data.results)

      // 如果本次请求的数据中没有pre_timestamp
      if (!data.data.pre_timestamp) {
        currentChannel.finished = true
      } else {
        // 将 pre_timestamp 存起来，用于加载下一次的数据列表请求参数
        currentChannel.timestamp = data.data.pre_timestamp
      }

      // 设置本次加载结束，才能开始下一次加载
      currentChannel.loading = false
    }
  },
  created () {
    this.loadChannels()
  }

}

</script>

<style scoped lang='less'>
.btn {
    position: fixed;
    top: 0;
    width: 95%;
    height: 40px;
    line-height: 40px;
    background-color: #f8f8f8;
    border: 1px solid rgb(35, 146, 250);
    z-index: 2;
    border-radius: 20px;
    margin-top: 3px;
    margin-left: 10px;
}
.van-tabs /deep/ .van-tabs__wrap {
  position: fixed;
  top: 46px;
  z-index: 2;
  left: 0;
  right: 15px;
}

.van-tabs /deep/ .van-tabs__content {
  margin-top: 90px;
  margin-bottom: 50px;
}

.wap-nav {
  position: sticky;
  right: 0;
  display: flex;
  align-items: center;
  background-color: #fff;
  opacity: 1;
}
</style>
