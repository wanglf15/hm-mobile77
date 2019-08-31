<template>
    <div class='container'>
      <van-dialog
        :value="value"
        @input="$emit('input', $event)"
        :show-cancel-button="false"
        :show-confirm-button="false"
        close-on-click-overlay
        >
        <van-cell-group v-if="!isReportShow">
        <van-cell icon="location-o" title="不感兴趣" @click="onDislike"/>
        <van-cell icon="location-o" title="反馈垃圾内容" is-link @click="isReportShow = true" />
        <van-cell icon="location-o" title="拉黑作者" @click="onAddBlackList"/>
        </van-cell-group>

        <van-cell-group v-else>
        <van-cell icon="arrow-left" @click="isReportShow = false" />
        <van-cell
          icon="location-o"
          :title="item.title"
          v-for="item in repotTypes"
          :key="item.type"
          @click="ReportArticles(item.type)"
        />
        </van-cell-group>
      </van-dialog>
    </div>
</template>

<script>
import { dislikeArticle, reportArticle } from '@/api/articles'
import { addBlackList } from '@/api/user'
export default {
  name: 'moreAction',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    article: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isReportShow: false,
      repotTypes: [
        { title: '标题夸张', type: 1 },
        { title: '低俗色情', type: 2 },
        { title: '错别字多', type: 3 },
        { title: '旧闻重复', type: 4 },
        { title: '广告软文', type: 5 },
        { title: '内容不实', type: 6 },
        { title: '涉嫌违法犯罪', type: 7 },
        { title: '侵权', type: 8 },
        { title: '其他问题', type: 0 }
      ]
    }
  },
  methods: {
    // 对文章不喜欢
    async onDislike () {
      await dislikeArticle(this.article.art_id.toString())
      this.$emit('input', false)
      this.$toast('操作成功！！！')
      this.$emit('dislike-success')
    },

    // 拉黑作者
    async onAddBlackList () {
      await addBlackList(this.article.aut_id)
      this.$emit('add-blackList-success')
    },
    // 举报文章
    async ReportArticles (type) {
      try {
        await reportArticle({
          articleId: this.article.art_id.toString(),
          type
        })
        this.$toast.success('举报成功')
        this.$emit('input', false)
      } catch (err) {
        if (err) {
          this.$toast('您已举报过该文章')
          this.$emit('input', false)
        }
      }
    }
  }
}
</script>

<style scoped lang='less'>

</style>
