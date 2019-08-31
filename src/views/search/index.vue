<template>
  <div class='container'>
    <!-- 搜索框 -->
    <form action="/">
      <van-search
        v-model="searchText"
        placeholder="请输入搜索关键词"
        show-action
        @search="onSearch(searchText)"
        @cancel="onCancel"
        autofocus
      />
    </form>
    <!-- /搜索框 -->

    <!-- 联想建议 -->
    <van-cell-group v-if="suggestions.length">
      <van-cell
        icon="search"
        v-for="item in suggestions"
        :key="item"
        @click="onSearch(item)"
      >
        <!-- 纯文本输出 -->
        <!-- <div slot="title">{{ item }}</div> -->

        <!-- html 输出 -->
        <!--
          过滤只能用于 {{}} 和 v-bind
         -->
        <div slot="title" v-html="highLight(item)"></div>
      </van-cell>
    </van-cell-group>
    <!-- /联想建议 -->

    <!-- 历史记录 -->
    <van-cell-group v-else>
      <van-cell title="历史记录">
        <div v-show="isDeleteShow">
          <span style="margin-right: 10px;" @click="serachHistories = []">全部删除</span>
          <span @click="isDeleteShow = false">完成</span>
        </div>
        <van-icon
          v-show="!isDeleteShow"
          slot="right-icon"
          name="delete"
          style="line-height: inherit;"
          @click="isDeleteShow = true"
        />
      </van-cell>
      <van-cell :title="item" v-for="(item, index) in serachHistories" :key="item">
        <van-icon
          v-show="isDeleteShow"
          slot="right-icon"
          name="close"
          style="line-height: inherit;"
          @click="serachHistories.splice(index, 1)"
        />
      </van-cell>
    </van-cell-group>
    <!-- /历史记录 -->
  </div>
</template>

<script>
import { getSuggestions } from '@/api/search'
import { debounce } from 'lodash'
export default {
  name: 'searchIndex',
  data () {
    return {
      searchText: '',
      suggestions: [],
      serachHistories: JSON.parse(window.localStorage.getItem('search-results')) || [],
      isDeleteShow: false
    }
  },
  methods: {
    onSearch (q) {
      if (!q.trim().length) {
        return
      }
      // 如果历史记录中没有就新添加，有就不添加
      if (!this.serachHistories.includes(q)) {
        this.serachHistories.unshift(q)
        this.saveHistory()
      }
      // 跳转到搜索结果页
      this.$router.push({
        name: 'searchResult',
        params: {
          q
        }
      })
    },
    saveHistory () {
      window.localStorage.setItem('search-results', JSON.stringify(this.serachHistories))
    },
    onCancel () {},
    highLight (str) {
      const searchText = this.searchText
      // 根据用户输入的内容创建一个动态的正则表达式
      const reg = new RegExp(searchText, 'gi')
      return str.replace(reg, `<span style="color: red;">${searchText}</span>`)
    }
  },
  watch: {
    searchText: debounce(async function (newValue) {
      if (!newValue.trim().length) {
        this.suggestions = []
      } else {
        const { data } = await getSuggestions(newValue)
        this.suggestions = data.data.options
      }
    }, 400),
    serachHistories () {
      this.saveHistory()
    }
  }
}
</script>

<style scoped lang='less'>

</style>
