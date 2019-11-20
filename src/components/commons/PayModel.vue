<template>
    <div class="payModel">
        <Modal
                v-model="payModelState"
                :closable=false
                :mask-closable="false">
            <p slot="header" style="color:#f60;text-align:center;font-size: 14px">
                <Icon type="md-checkmark-circle-outline"/>
                <span> 收银台   请在{{endSec}}秒内完成支付</span>
            </p>
            <div class="payOrder" v-if="orderDetail">
                <div class="orderDetail">
                    <p>订单类型：{{orderDetail.orderType===2? '小程序订单':'PC网页订单'}}</p>
                    <p>订单编号：{{orderDetail.orderId}}</p>
                    <p>创建时间：{{orderDetail.createTime |dateFormat}}</p>
                    <p>应付金额：{{orderDetail.totalFee|formatPrice}}</p>
                </div>
                <div class="clearFloat">
                    <div v-if="orderDetail.wepayCode" class="codeItem">
                        <QR :text="orderDetail.wepayCode" :size="200" :dotScale="1"></QR>
                        <img style="width: 100px;display: block; margin: auto" src="../../assets/WePayLogo.png" alt="">
                    </div>
                    <div v-if="orderDetail.alipayCode" class="codeItem">
                        <!--                        <QR :text="orderDetail.wechatPay.alipayUrl" :size="200" :dotScale="1"></QR>-->
                        <div>暂不可用</div>
                        <img style="width: 90px; height: 30px; display: block; margin: auto"
                             src="../../assets/alipay.png" alt="">
                    </div>

                </div>
                <div v-if="orderDetail.msg">{{orderDetail.msg}}</div>


            </div>
            <p slot="footer" style="height: 0;"></p>

        </Modal>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex';
    import QR from 'vue-qr';

    export default {
        name: "PayModel",
        components: {QR},
        data() {
            return {
                endSec: 0,
                x: {},
            }
        },
        methods: {
            ...mapActions(['getPayStatus', 'updateOrder', 'alipay']),
            ok() {
                this.$Notice.info({title: '支付被取消！'});
                clearInterval(this.x);
                this.orderDetail.wechatPay = {};

            },
            cancel() {
                this.$Notice.error({title: '支付被取消！'});
                clearInterval(this.x);
                this.orderDetail.wechatPay = {};

            },
            alipay(o) {
                this.alipay(o)
            }


        },
        computed: {
            ...mapState(['orderDetail']),
            payModelState: {
                get() {
                    return this.$store.state.payModelState
                },
                set(payModelState) {
                    this.$store.dispatch('payModelState', payModelState)
                }
            },
        },
        watch: {
            payModelState(val, oldval) {
                if (val === true) {
                    this.endSec = 50;
                    this.x = setInterval(() => {
                        this.endSec--;
                        this.getPayStatus(this.orderDetail.orderId).then(data => {
                            // this.$Notice.error({title: data.result + '---' + this.endSec});
                            //模糊匹配
                            if (data.result == 3 || this.endSec === 0) {
                                this.payModelState = false;
                                if (data.result == 3) {
                                    this.$Notice.success({title: '支付成功！'});
                                    this.$router.push({name: 'userInfo'})
                                } else {
                                    this.$Notice.error({
                                        title: '支付失败！',
                                        desc: '如果您已支付请查看我的订单！',
                                        duration: 0,
                                    })
                                    this.$router.push({name: 'userInfo'})
                                }
                                clearInterval(this.x);
                            }
                        }).catch(data => {
                            if (this.endSec === 0) clearInterval(this.x);
                            this.$Notice.success({
                                title: '无法获得支付状态，请到我的订单查看详情！',
                                desc: data.message
                            })
                        })

                    }, 1000);

                }
            }
        },

    }
</script>

<style scoped>
    .payModel {
        text-align: center;
    }

    .orderDetail {
        padding: 20px;
        background-color: whitesmoke;
        height: 100px;
    }

    .codeItem {
        margin: 0 auto;
        float: left;
        text-align: center;
        width: 50%;
    }


</style>
