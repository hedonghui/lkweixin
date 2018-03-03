<template>
  <div class="site-wrap" :style="{'-webkit-overflow-scrolling': scrollMode}">
      <header class="search-bar">
        <div class="search-entry">
          <input id="searchInput" @blur="getBlurCancelShow()" @focus="getCancelShow()" v-model="searchName" type="text" placeholder="请输入地址或站点名称">
          <button class="search-icon"  @click="getFindEquip(searchName)"></button>
        </div>
        <button class="cancel-text" v-show="cancelShow" @click="cancelBtn()">取消</button>
      </header>
      <div class="region-search">
        <h6 class="sub-text">区域搜索</h6>
        <ul class="region-grid">
          <li v-for="region in regionGrid" @click="getFindEquip(region.name)"><span>{{region.name}}</span></li>
        </ul>
      </div>
      <div class="region-site">
        <h6 class="sub-text">{{subText}}</h6>
        <p v-show="emptyShow" class="empty-text">未搜索到体验站</p>
      </div>
      <div class="page-loadmore-wrapper" ref="wrapper" :style="{height: wrapperHeight + 'px'}">
        <mt-loadmore v-show="listShow" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange" :auto-fill="false" ref="loadmore" :bottom-all-loaded="allLoaded">
          <ul class="site-list">
            <li class="site-item" v-for="listItem in list" @click="justGo(listItem.eId)">
              <div class="site-img">
                <img src="../../assets/images/common/baseList.png" alt="体检站" >
              </div>
              <div class="site-info">
                <p>{{listItem.eName}}</p>
                <span class="site-distance">
                <i class="site-address"></i>
                <span>距离{{listItem.distance}} km</span>
              </span>
              </div>
              <i class="site-arrow"></i>
            </li>
          </ul>
          <div slot="bottom" class="mint-loadmore-bottom">
            <span v-show="bottomStatus !== 'loading'" :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span>
            <span v-show="bottomStatus === 'loading'">
            <mt-spinner type="snake"></mt-spinner>
          </span>
          </div>
        </mt-loadmore>
      </div>
  </div>
</template>

<script>
export default {
  name: 'searchsite',
  data () {
    return {
      scrollMode: 'auto',
      apiEquip: '/geo/findAroundEquipment',
      totalPage: 0,
      allLoaded: false,
      bottomStatus: '',
      wrapperHeight: 0,
      list: [],
      paramsVal: {
        longitude: this.$route.params.lng,
        latitude: this.$route.params.lat,
        pageNumber: 1,
        pageSize: 5
      },
      searchName: '',
      city: this.$route.params.city,
      apiCity: '/geo/findCountyByCity',
      regionGrid: [],
      cancelShow: false,
      emptyShow: false,
      listShow: true,
      subText: '附近体检站'
    }
  },
  mounted () {
    this.getByCity()
    this.getByEquip()
  },
  updated() {
  },
  methods: {
    handleBottomChange (status) {
      this.bottomStatus = status
    },
    loadBottom () {
      this.paramsVal.pageNumber = this.paramsVal.pageNumber + 1
      if (this.paramsVal.pageNumber >= this.totalPage) {
        this.allLoaded = true
      }
      this.getByEquip()
      this.$refs.loadmore.onBottomLoaded()
    },
    getByCity () {
      this.$http({
        url: this.apiCity,
        method: 'POST',
        params: {city: this.city}
      }).then((response) => {
        if (response.body.result) {
          this.regionGrid = response.body.countyList
          this.$nextTick(function () {
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top
          })
        }
      })
    },
    getByEquip () {
      this.$http({
        url: this.apiEquip,
        method: 'POST',
        params: this.paramsVal
      }).then((response) => {
        if (response.body.result) {
          this.totalPage = response.body.totalPage
          if (this.totalPage === this.paramsVal.pageNumber) {
            this.allLoaded = true
          }
          this.list = this.list.concat(response.body.locationsList)
          if (response.body.locationsList.length > 0) {
            this.listShow = true
            this.emptyShow = false
          } else {
            this.listShow = false
            this.emptyShow = true
          }
          this.$nextTick(function () {
            this.scrollMode = 'touch'
          })
        }
      })
    },
    getFindEquip (searchName) {
      this.subText = '搜索结果'
      this.paramsVal.name = searchName
      this.paramsVal.pageNumber = 1
      this.allLoaded = false
      this.searchName = searchName
      if (!searchName) {
        delete this.paramsVal.name
      }
      this.list = []
      this.$http({
        url: this.apiEquip,
        method: 'POST',
        params: this.paramsVal
      }).then((response) => {
        if (response.body.result) {
          this.totalPage = response.body.totalPage
          if (this.totalPage === this.paramsVal.pageNumber) {
            this.allLoaded = true
          }
          this.list = this.list.concat(response.body.locationsList)
          if (response.body.locationsList.length > 0) {
            this.listShow = true
            this.emptyShow = false
          } else {
            this.listShow = false
            this.emptyShow = true
          }
        }
      })
    },
    cancelBtn () {
      let inputEle = document.getElementById('searchInput')
      this.cancelShow = false
      this.searchName = ''
      inputEle.blur()
    },
    getCancelShow () {
      this.cancelShow = true
    },
    getBlurCancelShow () {
      if (!this.searchName) {
        this.cancelShow = false
      }
    },
    justGo (eId) {
      this.$router.push({name: 'info', params: {eId: eId}})
    }
  }
}
</script>

<style scoped>
  .site-wrap {
    background-color: #fff;
  }
  .site-wrap > div {
    width: 100%;
    overflow-x: hidden;
  }
  .search-bar {
    display: flex;
    justify-content: space-between;
    width: 100vw;
    height: 110px;
    padding: 20px 30px;
    background-color: #0CBB8D;
  }
  .search-entry {
    position: relative;
    width: 594px;
    height: 70px;
    background-color: #FFFFFF;
    border-radius: 100px;
  }
  .search-entry input {
    width: 100%;
    height: 100%;
    padding: 10px 80px 10px 32px;
    border: none;
    font-size: 30px;
    line-height: 50px;
    background-color: rgba(0, 0, 0, 0);
    border-radius: 100px;
  }
  .search-icon {
    position: absolute;
    top: 0;
    right: 0;
    width: 80px;
    height: 70px;
    background: url("../../assets/images/map/search_small.png") left center no-repeat;
    background-size: 38px 38px;
  }
  .cancel-text {
    font-size: 32px;
    color: #FFFFFF;
    letter-spacing: 1px;
    line-height: 70px;
    background-color: transparent;
  }
  .sub-text {
    font-weight: normal;
    font-size: 28px;
    color: #333333;
    padding-left: 40px;
    letter-spacing: 0.88px;
  }
  .region-search {
    margin-top: 26px;
  }
  .region-grid {
    display: flex;
    flex-flow: row wrap;
    align-items: stretch;
    margin-top: 10px;
    padding: 0 40px;
  }
  .region-grid li {
    width: 25%;
    height: 60px;
    margin-top: 20px;
    font-size: 24px;
    color: #666666;
    letter-spacing: 0.75px;
    line-height: 60px;
  }
  .region-grid li span {
    overflow: hidden;
    display: block;
    width: 146px;
    height: 60px;
    font-size: 24px;
    color: #666666;
    letter-spacing: 0.75px;
    line-height: 60px;
    text-align: center;
    background-color: #F5F5F5;
    border-radius: 2px;
  }
  .region-site {
    width: 100%;
    margin-top: 50px;
  }
  .site-list {
    width: 100%;
    padding-bottom: 20px;
  }
  .site-item {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 200px;
    margin-top: 20px;
    padding: 40px;
    background: #FFFFFF;
    box-shadow: 0 2px 25px 0 rgba(0,0,0,0.10);
    border-radius: 16px;
  }
  .site-img {
    display: block;
    width: 120px;
    height: 120px;
    border-radius: 50%;
  }
  .site-img img {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  .site-info {
    width: 65%;
  }
  .site-info p {
    overflow: hidden;
    width: 100%;
    font-size: 34px;
    color: #131313;
    letter-spacing: 0.94px;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .site-distance {
    display: block;
    width: 100%;
    margin-top: 24px;
    font-size: 26px;
    color: #999999;
    letter-spacing: 0.46px;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .site-address {
    float: left;
    width: 25px;
    height: 32px;
    margin-right: 24px;
    background: url("../../assets/images/map/distance.png") center center no-repeat;
    background-size: 100% 100%;
  }
  .site-arrow {
    width: 23px;
    height: 100%;
    background: url("../../assets/images/common/more.png") center center no-repeat;
    background-size: 100%;
  }
  .mint-loadmore-bottom span {
    display: inline-block;
    transition: .2s linear;
    vertical-align: middle;
  }
  .is-rotate {
    transform: rotate(180deg);
  }
  .page-loadmore-wrapper {
    overflow: scroll;
    margin-top: -1px;
  }
  .mint-loadmore {
    padding: 0 40px;
    overflow: hidden;
  }
  .empty-text {
    width: 100%;
    font-size: 28px;
    color: #666666;
    letter-spacing: 0.75px;
    text-align: center;
    margin-top: 130px;
  }
</style>
