<template>
  <div class="rank">
    <div class="banner">
      <div class="best">
        <div class="best-item"><span class="value">1</span><span>st</span></div>
        <div class="best-item avatar">
          <div>
            <div id="champion"></div>
            <div id="avatar-image">
              <img :src="firstRank.lkpic" alt="">
            </div>
            <div><p class="championName">{{firstRank.nickname}}</p></div>
          </div>
        </div>
        <div class="best-item">
          <span class="value">{{firstRank.scores | Round}}</span>
          <span>分</span>
        </div>
      </div>
      <div id="myself" v-if="showMy">
          <div class="ranking" >{{myRank.rank}}</div>
          <div class="image"><img :src="myRank.lkpic" alt=""></div>
          <div class="name">{{myRank.nickname}}</div>
          <div class="score"><span>{{myRank.scores | Round}}</span>分</div>
      </div>
    </div>
      <ul id="leaderboards">
        <li v-for="item in list">
          <div class="ranking" v-ranking="item.rank"></div>
          <div class="image"><img :src="item.lkpic"  alt=""></div>
          <div class="name">{{item.nickname}}</div>
          <div class="score"><span>{{item.scores | Round}}</span>分</div>
        </li>
      </ul>
  </div>
</template>
<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      championName: 'Marie Byrd',
      championAvatar: '../assets/images/rank/Bitmap.png',
      list: [],
      firstRank: {nickname:"--",scores:"--"},
      apiUrl: '/data/getRank',
      defaultRankPic: require('@/assets/images/common/baseList.png'),
      showMy: false,
      myRank: {}
    }
  },
  mounted () {
    this.getRanking()
  },
  directives: {
    ranking: {
      inserted: function (el, binding) {
        switch (binding.value) {
          case 1: el.innerHTML = '<img src="./static/img/first.png" style="display: inline-block; vertical-align: middle; width: 25px; height: 25px" alt="err">'; break;
          case 2 : el.innerHTML = '<img src="./static/img/second.png" style="display: inline-block; vertical-align: middle; width: 25px; height: 25px" alt="err">'; break;
          case 3 : el.innerHTML = '<img src="./static/img/third.png" style="display: inline-block; vertical-align: middle; width: 25px; height: 25px" alt="err">'; break;
          default:el.innerHTML = binding.value
        }
      }
    }
  },
  filters: {
    Round: function (value) {
      if( value === "--"){
        return value
      }else{
        return Math.ceil(value)
      }
    }
  },
  methods: {
    loadTop () {
      this.getRanking()
      this.$refs.loadmore.onTopLoaded()
    },
    getRanking: function () {
      this.$http.get(this.apiUrl).then(function (response) {
        this.list = response.data.data.list
        for (let i = 0, max = this.list.length; i < max; i++) {
          if (!this.list[i].lkpic) {
            this.list[i].lkpic = this.defaultRankPic
          }
          if (!this.list[i].nickname) {
            this.list[i].nickname = '临时用户'
          }
        }
        this.firstRank = this.list[0]
        if (response.data.data.myRank) {
          this.showMy = true
          this.myRank = response.data.data.myRank
          if (!this.myRank.lkpic) {
            this.myRank.lkpic = this.defaultRankPic
          }
          if (!this.myRank.nickname) {
            this.myRank.nickname = '临时用户'
          }
        }
      }).catch(function (res) {
        console.log(res)
      })
    }
  }
}
</script>
<style scoped>
  .rank {
    background: rgb(243,243,243);
  }
  .banner {
    width: 100%;
    background: #fff url("../../assets/images/rank/RectangleBG.png") 0 -26px no-repeat;
    background-size: 100%  408px;
  }
  .best {
    height: 360px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 20px;
  }
  .best-item {
    min-width: 160px;
    max-width: 200px;
    height: 160px;
    line-height: 160px;
    margin: 10px;
    font-size: 40px;
    text-align: center;
    color: #FFFFFF;
    white-space:nowrap;
    text-overflow:ellipsis;
    overflow: hidden;
  }
  .best-item span {
    color: #FFFFFF;
  }
  .avatar {
    height: 250px;
    line-height: 40px;
  }
  #champion {
    position: relative;
    z-index: 1;
    height:56px;
    margin-bottom: -10px;
    background: url("../../assets/images/rank/Bitmap.png") 50% 10% no-repeat;
    background-size: 92px 54px;
  }
  #avatar-image {
    display: block;
    margin: 0 auto;
    border-radius: 50%;
    width: 130px;
    height: 130px;
  }
  #avatar-image img {
    border-radius: 50%;
    width: 100%;
    height: 100%;
  }
  .championName{
    font-size: 28px;
    color: #FFFFFF;
    margin: 16px 0;
  }
  .value{
    font-size: 80px;
    color: #FFFFFF;
  }
  #myself{
    display: flex;
    width: 100%;
    height: 130px;
    box-sizing: border-box;
    padding:20px 40px 32px;
  }

  .ranking{
    width:10%;
    font-size: 40px;
    color: #666666;
    line-height: 64px;
    text-align: center;
    margin-right: 5px;
  }
  .ranking > img {
    display: block;
    margin: 0 auto;
  }
  .image{
    width: 72px;
    height: 72px;
    margin-right: 30px;
  }
  .image > img {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  .name{
    width: 55%;
    box-sizing: border-box;
    line-height: 64px;
    font-size: 32px;
    color: #222222;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .score{
    width: 20%;
    text-align: right;
    line-height: 64px;
    white-space:nowrap;
    text-overflow:ellipsis;
    overflow: hidden;
  }
  .score>span{
    font-family: PingFangSC-Regular;
    font-size: 48px;
    color: #222222;
    line-height: 50px;
  }
  #leaderboards{
    background-color: #FFFFFF;
    margin-top: 20px;
    -webkit-padding-start: 0;
    -moz-padding-start: 0;
    padding:0;
  }
  #leaderboards > li {
    width: 100%;
    height: 130px;
    box-sizing: border-box;
    padding:32px 40px 32px 30px;
    display: flex;
    border-bottom: 4px rgb(243,243,243) solid;
    list-style-type: none;
  }
</style>
