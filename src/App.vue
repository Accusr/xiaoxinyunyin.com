<template>
  <div id="app">
    <NavBar></NavBar>
    <router-view></router-view>
    <Footer></Footer>
    <LogDrawer></LogDrawer>
    <PayModel></PayModel>

  </div>

</template>

<script>

  import NavBar from "@/components/commons/NavBar";
  import LogDrawer from "@/components/commons/LogDrawer";
  import Footer from "@/components/commons/Footer";
  import PayModel from "@/components/commons/PayModel";

  export default {
    name: 'app',
    components: {
      NavBar, LogDrawer, Footer, PayModel,
    },
    mounted(){
        this.$Notice.config({top:100,})
    },

  }
</script>

<style>
  .clearFloat {
    zoom: 1
  }

  .clearFloat:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0
  }
  * {
      margin: 0;
      padding: 0;
      list-style: none;
      text-decoration: none;
  }
</style>
