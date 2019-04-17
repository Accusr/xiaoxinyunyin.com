<template>
    <div class="userInfo">{{userInfo}}</div>
</template>

<script>
    import {mapMutations, mapState} from "vuex";

    export default {
        name: "UserInfo",
        computed:{
        ...mapState(['userInfo']), ...mapMutations(['changeLogDrawerState'])
        },
        mounted(){
            if(this.userInfo.id === '0'){
             alert("请刷新或登录！");
             this.$router.push({name:'home'});
            }


        }

    }
</script>

<style scoped>
.userInfo{
    width: 1200px;
    /*background-color: #ccffec;*/
    margin: 0 auto;
}
</style>