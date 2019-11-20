<template>
    <div id="Cooldog" ref="coolHeight">

        <div class="slider ">
                <li :class="itemClass[index]" v-for="(item, index) in slider" :key="index">
                    <img :src="item" ref="itemRef" alt="slider加载失败请刷新" >
                </li>
        </div>

        <div class="pointer">
            <li v-for="(item, index) in pointer" :key="index" @click="replace(false,index+1)"></li>
        </div>

    </div>


</template>

<script>
    export default {
        name: "Cooldog",
        data() {
            return {
                xx:'380px',
                itemClass:['p1','p2','p3','p4','p5'],
                slider: [
                    'https://register-1258643517.cos.ap-chengdu.myqcloud.com/1001/banner1.jpg',
                    'https://register-1258643517.cos.ap-chengdu.myqcloud.com/1001/banner2.jpg',
                    'https://register-1258643517.cos.ap-chengdu.myqcloud.com/1001/banner3.jpg',
                    'https://register-1258643517.cos.ap-chengdu.myqcloud.com/1001/banner2.jpg',
                    'https://register-1258643517.cos.ap-chengdu.myqcloud.com/1001/banner3.jpg',
                ],
                pointer: 0,
            }
        },
        updated() {
            let h = (window.innerHeight );
            // if(h<280)
            h = h*h*0.0006;

            this.$refs.coolHeight.style.height = h +'px';
        },
        mounted() {
            let h = (window.innerHeight );
            // if(h<280)
            h = h*h*0.0006;

            this.$refs.coolHeight.style.height = h +'px';
        },
        created() {

            // 设置定时器；
            setInterval(() => {
                let pop = this.itemClass.pop();
                this.itemClass.unshift(pop);
            }, 3000)
        },
        methods: {
            getClass(i){
                return 'p'+i;
            },
            btn_next(){

            }
        },
    }
</script>

<style scoped>
    #Cooldog {
        /*min-width: 800px;*/
        /*max-width: 1920px;*/
        /*width: 40%;*/
        /*height: 300px;*/
        margin: auto;
        min-height: 310px;
        max-height: 400px;
        /*position: relative;*/
        /*overflow: hidden;*/
    }


    .slider {
        /*border: 2px blue solid;*/
        text-align: center;
        margin: auto;
        /*background-color: #8c0776;*/
        /*position: absolute;*/
        width: 60%;
        max-width: 1200px;
        min-width: 760px;
        /*top: 0;*/
        /*left: 50%;*/
        /*margin-left: -249px;*/
    }

    .slider li {
        list-style-type:none;
        /*border: 1px red solid;*/
        margin: 20px auto;
        position: absolute;
        min-width: 760px;
        width: 60%;
        /*display: inline-block;*/
        /*float: left;*/

        transition: all 0.5s cubic-bezier(0.25,0.1,0.25,1);
    }
    .slider img {
        max-width: 1000px;
        width: 100%;
        /*height: 100%;*/
        border-radius: 3px;
    }


    .pointer {
        display: flex;
        justify-content: center;
        font-size: 20px;
        line-height: 20px;
        color: gray;
        cursor: pointer;
    }


    .p1 {
        transform: translate(-360px) scale(0.71);
        /*opacity: 0.6;*/
        z-index: 2;
    }

    .p2 {
        transform: translateX(-250px) scale(0.81);
        opacity: 1;
        z-index: 3;
    }

    .p3 {
        /*transform: translate3d(0px, 0, 0) scale(1);*/
        /*opacity: 1;*/
        z-index: 4;
    }

    .p4 {
        transform: translateX(250px) scale(0.81);
        opacity: 1;
        z-index: 3;
    }

    .p5 {
        transform: translateX(360px) scale(0.71);
        /*opacity: 0.6;*/
        z-index: 2;
    }







</style>
