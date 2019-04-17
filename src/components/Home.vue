<template>
  <div class="home">
      <div class="banner"></div>
    <div class="cover-dock" >
      <div class="dock clearFloat" >
        <Row type="flex" justify="space-around">

          <router-link to="/type/rapid" >
          <div class="dock-div" >
            <Icon class="dock-icon" size="30"  type="ios-timer" />
              <h2>加急打印</h2>
              <p>10分钟到手</p>
              <p style="color: crimson">超时可领88元
              </p>
          </div>
          </router-link>

          <Divider style="height: 60px;" type="vertical"/>
          <router-link to="/type/primary">
          <div class="dock-div">
            <Icon class="dock-icon" size="30"  type="ios-paper-plane" />
            <h2>批送打印</h2>
            <p>分批配送</p>
            <p style="color: crimson">距派送时间 00：30：45
            </p>
          </div>
          </router-link>
          <Divider style="height: 60px;" type="vertical" />
          <router-link to="/type/photo">
          <div class="dock-div">
            <Icon class="dock-icon" size="30"  type="ios-images" />
            <h2>照片打印</h2>
            <p>全彩过塑<br>价格优惠
            </p>
          </div>
          </router-link>
        </Row>
      </div>
    </div>

    <transition name="fade">
      <router-view ></router-view>
    </transition>
    <div id="anchor"></div>
  </div>
</template>

<script>
import {mapState} from 'vuex';

  export default {
    name: 'home',
    components: {
    },

    methods: {
      anchorFun(){
        // alert("dddd");
        // this.console.log("wqe");
        // this.scrollTo(500,0);
      }
    },
    computed:{
      ...mapState(['user'])
    }
  }
</script>
<style scoped >
  /*.home{*/
  /*  height: 900px;*/
  /*}*/
  .banner{
    height: 500px;
    background-image: url("../assets/banner.jpg");
    background-size: cover;
  }
  .cover-dock{
    height: 100px;
    border: 1px solid white;
  }
  .dock{
    padding: 20px 0 50px 0;
    margin: -48px auto;
    width: 1000px;
    height: 100px;
    /*border: 1px solid black;*/
    background-color: #d6ddde;
    box-shadow: 5px 10px 10px rgba(123, 126, 124, 0.57);
    transition: 0.5s;
  }
  .dock:hover{
    margin: -53px auto;
    box-shadow: 10px 15px 20px #a5a3a1;
  }
  .dock h2{
    font-size: large;
    font-family: "微软雅黑",serif;
    font-weight: 700;
    color: darkcyan;
  }
  .dock-icon{
    color: grey;
    margin: 10px 20px;
    float: left;
  }
  .dock-div:hover .dock-icon{
    color: darkcyan;
  }
  .dock-div{
    cursor: pointer;
    width: 200px;
    height: 60px;
  }
  .dock p{
    color: #888987;
  }



  .clearFloat {
    zoom:1
  }
  .clearFloat:after {
    display:block;
    clear:both;
    content:"";
    visibility:hidden;
    height:0
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
