<template>
    <div class='container'>
      <van-nav-bar
        :title="q + ' 的搜索结果'"
        fixed
        left-arrow
        @click-left="$router.back()"
      />
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        >
        <van-cell
          v-for="item in searchList"
          :key="item.aut_id"
          :title="item.title"
        >
          <div slot="label">
            <van-grid :border="false" :column-num="3">
              <van-grid-item v-for="(img, index) in item.cover.images" :key="index">
                <van-image height="80" :src="img" />
              </van-grid-item>
            </van-grid>
            <div class="article-info">
              <div class="meta">
                <span>{{ item.aut_name }}</span>
                <span>{{ item.comm_count }}评论</span>
                <span>{{ item.pubdate | relativeTime }}</span>
              </div>
            </div>
          </div>
        </van-cell>
      </van-list>
    </div>
</template>

<script>
import { getSearchResult } from '@/api/search'
export default {
  name: 'searchResult',
  props: ['q'],
  data () {
    return {
      searchList: [],
      loading: false,
      finished: false,
      page: 1,
      per_page: 10
    }
  },

  methods: {
    async onLoad () {
      const { data } = await getSearchResult({
        q: this.q,
        page: this.page,
        per_page: this.per_page
      })
      console.log(data)
      const { results } = data.data
      this.searchList.push(...results)
      if (!results.length) {
        // 设置全部加载结束状态
        this.finished = true
      } else {
        // 页码加1 用于下次请求
        this.page++
      }
      this.loading = false
    }
  }
}
</script>

<style scoped lang='less'>
.van-list {
    margin-top: 46px;
}
.van-icon-arrow-left {
    color: #fff!important;
}
</style>
