<template>
    <div class="home">
<!--        <a :href="'http://feedback.xiaoxinyunyin.com?feedback='+userInfo.id" target="_blank">-->
                <img class="feedback" src="@/assets/feedback.png" width="280px" alt="">
<!--        </a>-->
        <Cooldog></Cooldog>

        <div class="print-type">
            <Row type="flex" justify="space-around">

                <router-link to="/type/rapid">
                    <div class="type-item clearFloat">
                        <div class="circle-icon">

                            <Icon class="dock-icon" size="40" type="ios-cart-outline"/>
                        </div>
                        <h2>加急打印</h2>
                        <p>10分钟到手</p>
                        <p style="color: red">超时可领88元
                        </p>
                    </div>
                </router-link>

                <Divider style="height: 60px;" type="vertical"/>
                <router-link to="/type/primary">
                    <div class="type-item">
                        <div class="circle-icon">

                            <Icon class="dock-icon" size="40" type="ios-print-outline"/>
                        </div>
                        <h2>批送打印</h2>
                        <p>分批配送</p>
                        <p style="color: red;" >距派送时间 {{countTime |endTimeFormat}}</p>
                    </div>
                </router-link>
                <Divider style="height: 60px;" type="vertical"/>
                <router-link to="/type/photo">
                    <div class="type-item">
                        <div class="circle-icon">

                            <Icon class="dock-icon" size="40" type="ios-image-outline"/>
                        </div>
                        <h2>照片打印</h2>
                        <p>全彩过塑<br>价格优惠
                        </p>
                    </div>
                </router-link>
            </Row>
        </div>


        <transition name="ease">
            <router-view></router-view>
        </transition>
        <div style="height: 200px;"></div>
    </div>
</template>

<script>
    import {mapState} from 'vuex';
    import Cooldog from "@/components/commons/Cooldog";

    export default {
        name: 'home',
        components: {Cooldog},
        data() {
            return ({
                endline1: 'Jun 1, 2022 18:00:00',   //这里设置日期倒计时间
                endline2: 'Jun 1, 2022 12:00:00',   //这里设置日期倒计时间
                countTime: 0,
                expired: false,
                carImage1: "url('https://xxyycom-1258643517.cos.ap-chengdu.myqcloud.com/schoolRegister/1001/banner1.jpg')",
                carImage2: "url('https://xxyycom-1258643517.cos.ap-chengdu.myqcloud.com/schoolRegister/1001/banner2.jpg')",
                carImage3: "url('https://xxyycom-1258643517.cos.ap-chengdu.myqcloud.com/schoolRegister/1001/banner3.jpg')",
            })
        },

        methods: {},
        computed: {
            ...mapState(['userInfo']),

        },
        mounted() {
            const current = new Date();
            const t12 = current.setHours(12,0,0,0);
            const t18 = current.setHours(18,0,0,0);

            setInterval(() => {
                if (t12 - current.getTime() > 0) {
                    this.countTime = t12 - new Date().getTime();
                } else {
                    this.countTime = t18 - new Date().getTime();
                }
            }, 1000)
        },
        filters: {
            endTimeFormat(millisecond) {
                // tdays = Math.floor(millisecond / (1000 * 60 * 60 * 24)),
                let h = Math.floor((millisecond % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                let min = Math.floor((millisecond % (1000 * 60 * 60)) / (1000 * 60));
                let sec = Math.floor((millisecond % (1000 * 60)) / 1000);
                if(millisecond>0){
                return `${h}:${min}:${sec}`;

                }else return '今日配送已结束';
            }
        }
    }
</script>
<style scoped>
    .home {
        margin: 0 auto;
    }

    .print-type {
        padding: 10px;
        height: 130px;
        /*border: 1px red dashed;*/
        margin: 0 auto;
        width: 1200px;
    }


    .circle-icon {
        vertical-align: center;
        display: inline;
        margin: 3px 20px;
        padding: 9px;
        float: left;
        height: 60px;
        width: 60px;
        border: 1px #ffa39e solid;
        border-radius: 50%;
    }


    .dock-icon {
        display: inline;
        text-align: center;
        color: red;
        transition: 0.5s;
    }


    .type-item {
        cursor: pointer;
        width: 250px;
    }

    .type-item h2 {
        font-size: large;
        font-family: "等线";
        font-weight: 700;
        color: #1b1b1b;
    }

    .type-item p {
        color: #7b7e7c;
    }


    .banner {

        width: 1200px;
        margin: 0 auto;
        text-align: center;
    }


    .carousel1 {
        height: 400px;
        background-color: #939393;
    }

    .carousel2 {
        height: 400px;
        background-color: #939393;
    }

    .carousel3 {
        height: 400px;
        background-color: #939393;
    }

    .carousel4 {
        height: 400px;
        background-color: #939393;
    }

    .feedback {
        cursor: pointer;
        background-color: #e2e2e2;
        position: fixed;
        right: -190px;
        bottom: 50px;
        transition: 0.5s ease;
    }

    .feedback:hover{
        right: 0px;
        bottom: 50px;
    }
</style>
