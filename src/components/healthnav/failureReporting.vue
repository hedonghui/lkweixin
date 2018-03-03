<template>
  <div class="report-wrap">
    <textarea class="text-report" v-model="reportVal" placeholder="请您描述大致的故障情况，我们会及时排查"></textarea>
    <button class="report-btn" @click="sendReport()">提交</button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      reportVal: '',
      apiReport: '/geo/malfunction',
      eId: this.$route.params.eId
    }
  },
  mounted () {

  },
  methods: {
    sendReport () {
      if (!this.reportVal) {
        return false
      }
      this.$http({
        url: this.apiReport,
        method: 'POST',
        params: {
          eId: this.eId,
          describe: this.reportVal
        }
      }).then((response) => {
        if (response.body.result) {
          console.log(response.body)
          alert('提交成功')
        }
      })
    }
  }
}
</script>

<style scoped>
  .report-wrap {
    width: 100%;
    padding: 22px 30px 0;
  }
  .text-report {
    width: 100%;
    height: 324px;
    padding: 20px 25px;
    font-size: 28px;
    color: #131313;
    letter-spacing: 1.56px;
    background: #FFFFFF;
    border: none;
    resize: none;
    outline: none;
    border-radius: 4px;
  }
  .report-btn {
    display: block;
    width: 640px;
    height: 90px;
    margin: 50px auto 0;
    font-size: 36px;
    color: #FFFFFF;
    text-align: center;
    line-height: 90px;
    letter-spacing: 2px;
    background: #0CBB8D;
    border-radius: 8px;
  }
</style>
