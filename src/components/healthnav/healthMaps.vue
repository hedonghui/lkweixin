<template>
  <div class="wrap">
    <router-link to="/rank">
      <header class="rank-header">
        <p>健康综合得分排行榜</p>
        <div class="rank-wrap">
          <div class="rank-portrait">
            <div class="rank-img" v-for="rankPic in rankList"
                 :class="{
                    'rank-one': rankPic.classType == 1,
                    'rank-two': rankPic.classType == 2,
                    'rank-three': rankPic.classType == 3
                  }">
              <img :src="rankPic.pic" alt="">
              <span class="icon-border"></span>
            </div>
            <!--<div class="rank-img rank-two">-->
              <!--<img :src="icon.url" alt="">-->
            <!--</div>-->
            <!--<div class="rank-img rank-three">-->
              <!--<img :src="icon.url" alt="">-->
            <!--</div>-->
          </div>
          <i class="rank-arrow"></i>
        </div>
      </header>
    </router-link>
    <div id="allmap" class="map"></div>
  </div>
</template>

<script>
import mapApi from '@/assets/scripts/mapApi'

export default {
  data () {
    return {
      apiUrl: '/geo/findAroundEquipment',
      apiRank: '/data/getRank',
      ak: 'WU6tLQtDRjjikFGtKLjgLm6c',
      icon: {
        url: require('@/assets/images/map/station.png'),
        size: {width: 38, height: 38}
      },
      locationIcon: {
        url: require('@/assets/images/map/location.png'),
        size: {width: 22, height: 22}
      },
      clickIcon: {
        url: require('@/assets/images/map/station_s.png'),
        size: {width: 50, height: 50}
      },
      locationControl: {
        offset: {horizontal: 30, direction: 130},
        icon: {
          url: require('@/assets/images/map/location_control.png'),
          size: {width: 54, height: 54}
        }
      },
      repairControl: {
        offset: {horizontal: 30, direction: 194},
        icon: {
          url: require('../../assets/images/map/fix.png'),
          size: {width: 54, height: 54}
        },
        routerUrl: 'failureReporting'
      },
      searchRouter: 'searchSite',
      infoRouter: 'info',
      rankList: [],
      rankPic: require('@/assets/images/common/baseList.png')
    }
  },
  mounted () {
    mapApi.init({
      ak: this.ak,
      icon: this.icon,
      locationIcon: this.locationIcon,
      apiUrl: this.apiUrl,
      clickIcon: this.clickIcon,
      locationControl: this.locationControl,
      repairControl: this.repairControl,
      searchRouter: this.searchRouter,
      infoRouter: this.infoRouter,
      mapZIndex: 16
    })
    this.getRankHeard()
  },
  methods: {
    getRankHeard () {
      this.$http({
        url: this.apiRank,
        method: 'POST'
      }).then((response) => {
        if (response.body.result) {
          let rank = response.body.data.list
          let rankArr = []
          for(let i = 0, max = 6; i < max; i++) {
            switch (parseInt(rank[i].rank)) {
              case 1 : rankArr.push({pic: rank[i].lkpic ? rank[i].lkpic : this.rankPic, classType: 1}); break
              case 2 : rankArr.push({pic: rank[i].lkpic ? rank[i].lkpic : this.rankPic, classType: 2}); break
              case 3 : rankArr.push({pic: rank[i].lkpic ? rank[i].lkpic : this.rankPic, classType: 3}); break
              case 4 : rankArr.push({pic: rank[i].lkpic ? rank[i].lkpic : this.rankPic, classType: 0}); break
              case 5 : rankArr.push({pic: rank[i].lkpic ? rank[i].lkpic : this.rankPic, classType: 0}); break
              case 6 : rankArr.push({pic: rank[i].lkpic ? rank[i].lkpic : this.rankPic, classType: 0}); break
              default: break
            }
          }
          this.rankList = this.rankList.concat(rankArr)
        }
      })
    }
  }
}
</script>
<style>
  .wrap {
    width: 100%;
    height: 100%;
  }
  .map {
    width: 100%;
    height: 100%;
  }
  .seach-control {
    display: flex;
    left: 50%!important;
    width: 92%;
    height: 100px;
    margin-left: -46%;
    font-family: MicrosoftYaHei;
    font-size: 34px;
    color: #7B7B7B;
    line-height: 100px;
    letter-spacing: 0.94px;
    background-color: #fff;
    z-index: 31!important;
    box-shadow: 0 2px 15px 0 rgba(0,0,0,0.10);
    border-radius: 16px;
    *zoom: 1;
  }
  .seach-control span {
    width: 100px;
    height: 100px;
    background-color: #fafafa;
    background: url("../../assets/images/map/search.png") center center no-repeat;
    background-size: 44% 44%;
  }
  .info-control {
    display: flex;
    justify-content: space-between;
    left: 50%!important;
    width: 92%;
    height: 200px;
    padding: 40px 3%;
    margin-left: -46%;
    font-family: MicrosoftYaHei;
    background-color: #fff;
    z-index: 31!important;
    box-shadow: 0 2px 15px 0 rgba(0,0,0,0.10);
    border-radius: 16px;
    *zoom: 1;
  }
  .info-img {
    width: 120px;
    height: 120px;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
  }
  .info-img img{
    width: 100%;
    height: 100%;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
  }
  .wrap-info {
    width: 65%;
    height: 120px;
  }
  .info-control p {
    overflow: hidden;
    width: 100%;
    margin: 0;
    margin-bottom: 24px;
    font-family: MicrosoftYaHei;
    font-size: 34px;
    color: #131313;
    letter-spacing: 0.94px;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .info-div {
    overflow: hidden;
    width: 100%;
    font-family: MicrosoftYaHei;
    font-size: 28px;
    line-height: 32px;
    color: #999999;
    letter-spacing: 0.46px;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .location-icon {
    float: left;
    width: 25px;
    height: 32px;
    margin-right: 24px;
    background: url("../../assets/images/map/distance.png") center center no-repeat;
    background-size: 100% 100%;
  }
  .icon-arrow {
    width: 23px;
    height: 120px;
    background: url("../../assets/images/common/more.png") center center no-repeat;
    background-size: 100%;
  }
  .rank-header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 150px;
    padding: 25px 30px 15px;
    background-color: #fff;
    box-shadow: 0 4px 7px 0 rgba(0,7,45,0.25);
  }
  .rank-header p {
    margin-bottom: 10px;
    font-size: 20px;
    color: #222222;
  }
  .rank-wrap {
    display: flex;
    justify-content: space-between;
  }
  .rank-portrait {
    display: flex;
    justify-content: space-around;
    width: 80%;
  }
  .rank-portrait .rank-img {
    position: relative;
    width: 75px;
    height: 75px;
  }
  .rank-img img {
    display: block;
    width: 100%;
    height: 100%;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
  }
  .rank-arrow {
    width: 23px;
    height: 75px;
    background: url("../../assets/images/common/more.png") center top no-repeat;
    background-size: 100%;
  }
  .rank-one .icon-border {
    background: url("../../assets/images/map/rank_one.png") center center no-repeat;
    background-size: 100% 100%;
  }
  .rank-two .icon-border {
    background: url("../../assets/images/map/rank_two.png") center center no-repeat;
    background-size: 100% 100%;
  }
  .rank-three .icon-border {
    background: url("../../assets/images/map/rank_three.png") center center no-repeat;
    background-size: 100% 100%;
  }
  .rank-one img, .rank-two img,.rank-three img {
    border: 0;
  }
  .icon-border {
    position: absolute;
    top: 0;
    left:0;
    display: block;
    width: 100%;
    height: 100%;
  }
</style>
