<template>
  <div id="app">
    <NavBar></NavBar>
    <router-view></router-view>
    <Footer></Footer>
    <LogDrawer></LogDrawer>
  </div>

</template>

<script>

  import NavBar from "@/components/commons/NavBar";
  import LogDrawer from "@/components/commons/LogDrawer";
  import Footer from "@/components/commons/Footer";

  export default {
    name: 'app',
    components: {
      NavBar,
      LogDrawer,
      Footer,
    }
  }
</script>

<style>

</style>
