<template>
  <div class="info">
    <div id="site">
      <img src="../../assets/images/common/defaultBanner.png" alt="">
    </div>
    <div class="banner">
        <div>
          <p class="station">{{infoText.name}}</p>
          <!--<span class="icon share" @click="share"></span>-->
        </div>
        <div>
          <span class="anchor"></span>
          <p class="address">{{infoText.address}}</p>
        </div>
    </div>
    <div class="machine">
      <img :src="infoText.pic" alt="">
    </div>
    <!--<mt-popup-->
      <!--v-model="popupVisible"-->
      <!--position="bottom">-->
      <!--生活就像海洋-->
    <!--</mt-popup>-->

  </div>
</template>
<script>
export default {
  name: 'info',
  data () {
    return {
      popupVisible: false,
      apiInfo: '/geo/findEquipmentById',
      eId: this.$route.params.eId,
      infoText: {},
      defaultPic: require('@/assets/images/info/tijianzhan.png')
    }
  },
  mounted () {
    this.getInfo()
  },
  methods: {
    share () {
      this.popupVisible = !this.popupVisible;
    },
    getInfo () {
      this.$http({
        url: this.apiInfo,
        method: 'POST',
        params: {eId: this.eId}
      }).then((response) => {
        if (response.body.result) {
          this.infoText = response.body.equipment
          if (!this.infoText.pic) {
            this.infoText.pic = this.defaultPic
          }
        }
      })
    }
  }
}
</script>
<style scoped>
  .info {
    background: rgb(243,243,243);
  }
  #site {
    width: 100%;
    border-radius: 2px;
    background-color: #ccc;
  }
  #site>img {
    width: 100%;
  }
  .banner {
    width: 750px;
    height: 180px;
    background-color: #FFFFFF;
    padding: 35px 40px;
  }
  .banner div {
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    width: 100%;
    line-height: 45px;
    margin-bottom: 15px;
  }
  .station {
    display: inline-block;
    font-size: 34px;
    color: #131313;
    letter-spacing: 0.94px;
  }
  .address {
    font-size: 26px;
    color: #999999;
    letter-spacing: 0.43px;
    line-height: 45px;
    display: inline-block;
  }
  .icon {
    display: inline-block;
    width: 30px;
    height: 30px;
  }
  .share {
    display: inline-block;
    width: 30px;
    height: 30px;
    background-image: url("../../assets/images/info/share.png");
    background-size: 30px 30px;
    vertical-align: middle;
  }
  .anchor {
    float: left;
    width: 45px;
    height: 45px;
    background: url("../../assets/images/info/placeholder.png") left center no-repeat;
    background-size: 24px 28px;
    vertical-align: middle;
  }
  .machine {
    margin-top: 10px;
  }
  .machine > img {
    display: block;
    width: 100%;
  }
</style>
