<template>
    <div class="userInfo">
        <div class="anchor-wrapper">
            <!--            <Anchor show-ink-->
            <!--            >-->
            <!--                <AnchorLink href="#userInfo" title="个人信息"/>-->
            <!--                <AnchorLink href="#my-order" title="我的订单"/>-->
            <!--                <AnchorLink href="#API" title="其他">-->
            <!--                    <AnchorLink href="#Anchor_props" title="我的文档"/>-->
            <!--                    <AnchorLink href="#Anchor_events" title="其他"/>-->
            <!--                    <AnchorLink href="#AnchorLink_props" title="AnchorLink props"/>-->
            <!--                </AnchorLink>-->
            <!--            </Anchor>-->
        </div>


        <Modal
                v-model="editMadal"
                title="我的信息"
                @on-ok="updateUser">
            <div>
                昵称：<Input v-model.lazy="userInfo.nickname"/>
<!--                班级：<Input v-model.lazy="userInfo.class"/>-->
                职务：<Input v-model.lazy="userInfo.part"/>
                个性签名：<Input v-model.lazy="userInfo.info"/>

            </div>


        </Modal>
        <div class="userInfo-detail">
            <div class="avatar-block clearFloat" id="userInfo">
                <div class="circle-avatar">
                    <img :src="userInfo.avatar" alt="" class="avatar">
                </div>
                <div class="userInfo-tab">
                    <div class="nickName clearFloat">
                    <span style="font-size: 30px; color: #ffffff">
                    {{userInfo.nickname}}
                        <img v-if="userInfo.gender===true" src="../assets/man.png" alt="">
                        <img v-else src="../assets/female.png" alt="">
                    </span>
                        <i style="font-size: 13px; font-family: 'Times New Roman'; color: pink; border:1px solid #a7a7a7;border-radius:10px; padding: 0 6px 0 6px;margin-left: 20px">
                            Lv. {{userInfo.level}} </i>
                        <Button @click="sign" ghost type="warning" size="small" style="float: right; margin: 10px">
                            <Icon type="ios-ribbon" size="17"/>
                            签到
                        </Button>
                        <Button style="float: right; margin: 10px" ghost @click="editMadal = true" type="info"
                                size="small">
                            <Icon type="md-create" size="15"/>
                            编辑
                        </Button>
                    </div>
                    <div class="clearFloat" style="margin-top: 20px">
                        <div style="float: left; width: 40%">
                            <p>所在学校：{{userInfo.schoolId}}</p>
                            <p v-if="userSocialInfo.student_id" >我的学号：{{userSocialInfo.student_id}}</p>
                            <p v-else @click="insetStudentId"  style="cursor: pointer;color: deeppink">我的学号：未设置</p>
                            <p>我的职责：{{userInfo.part===0?'学生':'班干部'}}</p>
                            <p>所在地区：{{userInfo.country}}.{{userInfo.province}}.{{userInfo.city}} </p>
                            <p>创建时间：{{userInfo.createTime | dateFormat}}</p>

                        </div>
                        <div style="float: left;width: 40%">
                            <p>积分：{{userInfo.gain}}</p>
                            <p>个性签名：{{userInfo.info}}</p>

                            <!--                            <p>学号：{{1?'111':'未设置'}}</p>-->
                            <Poptip placement="right">
<!--                                <p @click="changeSocial(userSocialInfo.wechat)" style="cursor: pointer;color: deeppink">-->
<!--                                    社交绑定：{{userSocialInfo.wechat?"解绑微信":"绑定微信"}}</p>-->
                                <div class="band-wechat" slot="content">
                                    <div id="wechatCodeImage"></div>
                                </div>
                            </Poptip>
                        </div>

                    </div>
                </div>
            </div>

            <div class="myOrder">
                <div class="myOrder-title">
                    <p style="font-weight: 900; font-size: 14px">我的订单</p>
                </div>
                <div v-for="(item,index) in orderList" :key="item.id" class="myOrder-item">
                    <div class="item-title">
                        {{item.createTime | dateFormat}} 订单编号：{{item.id}} 订单类型：{{item.orderType |orderTypeFormat}}
                    </div>
                    <div class="clearFloat">
                        <div class="item-opt" style="width: 100px;">
                            <img src="../assets/runner.png" alt="">

                        </div>
                        <div class="item-opt">
                            <!--                            <p>谢勇 19973818305</p>-->
                            <p>备注： {{item.postscript}}</p>
                        </div>
                        <div class="item-opt clearFloat">
                            <div style="float: left; margin-right: 20px">
                                <p>打印费 {{item.printFee |formatPrice}}元</p>
                                <p>配送费 {{item.serviceFee |formatPrice}}元</p>
                                <p>其他 {{item.otherFee |formatPrice}}元</p>
                            </div>
                            <div style="float: left; margin-right: 20px">
                                <p>其中</p>
                                <p>已优惠{{item.coupon |formatPrice}} 元</p>
                                <p>总费用 {{item.totalFee|formatPrice}}元</p>
                            </div>


                        </div>
                        <div class="item-opt">
                            <p>订单状态：{{item.status | formatOrderStatus}}</p>
                            <p>状态提醒：{{item.status | formatOrdertip}}</p>
                            <p v-if="item.status === 1 || item.status === 2" style="color: red">
                                您的订单将在{{item.createTime|endTimeFormat}}小时后关闭,请尽快支付！</p>

                        </div>
                        <div class="item-opt" style="padding: 10px 0 0 50px">
                            <Button @click="orderInfo(item)" type="info" ghost>查看详情</Button>
                            <Button @click="orderOpt(item)" type="warning">{{item.status | formatButton}}</Button>
                        </div>
                    </div>
                </div>
                <div class="page clearFloat">
                    <Page @on-change="changePageIndex" @on-page-size-change="changePageSize" :page-size=5
                          :total=parseInt(orderCount) :page-size-opts="[5,10]" size="small" show-elevator show-sizer
                          show-total
                          style="margin: 10px; float: right"/>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    import {mapMutations, mapState, mapActions} from "vuex";

    export default {
        name: "UserInfo",
        data() {
            return ({
                orderCount: 0,
                orderList: [],
                editMadal: false,
                userSocialInfo: {},
                pageInfo: {
                    pageIndex: 1,
                    pageSize: 5,
                },

            })
        },
        methods: {
            ...mapActions(['listOrder', 'getOrderCount', 'updateUserInfo', 'getUserSocialInfo', 'removeOrder', 'payOrder', 'getOrderAddr', 'getUser', 'socialBind','changeLogDrawerState']),
            updateUser() {
                this.updateUserInfo(this.userInfo).then(data => this.editMadal = false).catch(err => alert(err))
            },
            orderInfo(order) {
                this.getOrderAddr(order.addrId).then(data => this.$Notice.info({
                    title: '订单详情',
                    desc: "收件人" + data.contactName + data.detailAddress + data.phone
                })).catch(err => alert(err))
            },
            insetStudentId(){
                this.changeLogDrawerState('insetStudentId')
            },
            changeSocial(wechat) {
                let state = 'unbind'
                if (wechat) state = 'bind';
                // eslint-disable-next-line no-undef
                let sss = new WxLogin({
                    // self_redirect:true,
                    id: "wechatCodeImage",
                    appid: "wxb8d36cd45a4a048f",
                    scope: "snsapi_login",
                    redirect_uri: encodeURI("https://xiaoxinyunyin.com/userInfo"),
                    state: state,
                    style: "black",
                    href: 'https://xxyycom-1258643517.cos.ap-chengdu.myqcloud.com/wechatImage.css',
                });

            },
            changePageIndex(i) {
                this.pageInfo.pageIndex = i;
                this.listOrder(this.pageInfo).then(data => this.orderList = data).catch(err => alert(err))

            },
            changePageSize(s) {
                this.pageInfo.pageSize = s;
                this.listOrder(this.pageInfo).then(data => this.orderList = data).catch(err => alert(err))
            },
            // sign() {
            sign() {
                this.$Notice.info({
                    title: '恭喜！签到成功'
                })
            },
            // },
            orderOpt(order) {

                switch (order.status) {
                    case -1:
                        this.removeOrder(order.id).then(data => {
                            if (data.code == 1) {
                                this.orderList.splice(this.orderList.findIndex(item => item.id === order.id), 1)
                                this.$Notice.success({title: '订单已删除！'})
                            }
                        }).catch(err => alert(err));
                        break;
                    case 1:
                        this.payOrder(order).catch(err => alert(err));
                        break;
                    case 2:
                        this.payOrder(order).catch(err => alert(err));
                        break;
                    case 3:
                        this.$Notice.success({title: '订单' + order.id + '正在配送！'})
                        break;
                    case 4:
                        this.$Notice.success({title: '正在配送！'})
                        break;
                    case 5:
                        this.$Notice.success({title: '已确认收货！'})
                        break;
                    case 6:
                        return '评价订单';
                    case 9:
                        this.removeOrder(order.id).then(data => {
                            if (data.code == 1) {
                                this.orderList.splice(this.orderList.findIndex(item => item.id === order.id), 1)
                                this.$Notice.success({title: '订单已删除！'})
                            }
                        }).catch(err => alert(err));
                        break;
                }
            }
        },
        computed: {
            ...mapState(['userInfo', 'payModelState']), ...mapMutations(['changeLogDrawerState'])
        },
        watch: {
            //监控支付面板，一旦改变更新数据
            payModelState(val) {
                if (val === false) this.listOrder(this.pageInfo).then(data => this.orderList = data).catch(err => alert(err))
            }
        },
        mounted() {
            let state = localStorage.getItem('authorization');
            if (!state) {
                this.$router.push({name: 'home'});
            } else {
                if (this.$route.query.code !== undefined) {
                    let payload;
                    payload.state = this.$route.query.state;
                    payload.code = this.$route.query.code;
                    this.socialBind(payload).then(alert("绑定成功")).catch(alert("绑定失败"))
                } else this.getUserSocialInfo().then(data => this.userSocialInfo = data).catch(data => alert(data))
                this.getOrderCount().then(data => this.orderCount = data.result).catch(err => alert(err))
                this.listOrder(this.pageInfo).then(data => this.orderList = data).catch(data => {
                    if (data.message !== 'ORDER_EMPTY') alert(data.message)
                })

            }

            if (this.$route.query.code !== undefined && this.$route.query.state === '9999') {
                this.loginByWechat(this.$route.query.code).then(res => {
                    this.$router.push({name: 'userInfo'});
                    this.getUser();
                }).catch(err => {
                    alert("网络开小差了！" + err);
                    this.$router.push({name: 'home'});
                })
                //正常登陆
            } else this.getUser();


        },
        filters: {
            formatButton(status) {
                switch (status) {
                    case -1:
                        return '删除订单';
                    case 1:
                        return '支付订单';
                    case 2:
                        return '支付订单';
                    case 3:
                        return '查看物流';
                    case 4:
                        return '查看物流';
                    case 5:
                        return '确认收货';
                    case 6:
                        return '评价订单';
                    case 9:
                        return '删除订单';
                }
            },
            formatOrdertip(status) {
                switch (status) {
                    case -1:
                        return '订单已超时关闭，需要打印请重新创建订单！';
                    case 1:
                        return '订单待支付！';
                    case 2:
                        return '您取消了支付等待再次支付！';
                    case 3:
                        return '订单正在出库！';
                    case 4:
                        return '订单正在快马加鞭地配送！';
                    case 5:
                        return '商品配送完成等待确认收货！';
                    case 6:
                        return '订单已确认收货等待评价！';
                    case 9:
                        return '订单已经完成并赠送20积分';
                }
            },
            endTimeFormat(date) {
                let d = new Date(date).getTime() + 24 * 60 * 60 * 1000 - new Date().getTime();
                return parseFloat(d / 1000 / 60 / 60).toFixed(2);
            },
            orderTypeFormat(type) {
                switch (type) {
                    case 0:
                        return '未支付订单';
                    case 2:
                        return '微信小程序订单';
                    case 11:
                        return '网页端加急文件打印';
                    case 12:
                        return '网页端批送文件打印';
                    case 13:
                        return '照片打印';
                }
            }
        }

    }
</script>

<style scoped>
    .userInfo {
        background-color: #e5e5e5;
        padding-top: 20px;
    }

    .userInfo-detail {
        width: 1200px;
        margin: 0 auto;
    }

    .avatar-block {
        margin: 0 auto;
        background-image: url("../assets/profile.jpg");
        width: 98%;
        border-radius: 6px;
        padding-top: 30px;
        height: 250px;
    }


    .circle-avatar {
        /*background-color: aquamarine;*/
        float: left;
        width: 290px;
        height: 100%;

    }

    .avatar {
        border-radius: 50%;
        margin: 20px auto auto 60px;
        /*border: 1px solid gray;*/
        background-color: gainsboro;
        width: 150px;
        padding: 2px;

    }

    .userInfo-tab {
        background-color: rgba(50, 50, 50, 0.5);
        border-radius: 6px;
        width: 800px;
        height: 190px;
        float: left;
        color: #ffffff;
        padding: 20px;
    }

    .userInfo-tab img {
        width: 20px;
        height: 20px;
        vertical-align: top;
    }

    .band-wechat {
        color: #222222;
        width: 300px;
        height: 320px;
        text-align: center;
        margin: auto;
        overflow: hidden;
        /*background-color: #8c0776;*/
    }

    .myOrder {
        margin: 0 auto;
        /*height: 1000px;*/
    }

    .myOrder-title {
        background-color: white;
        height: 50px;
        width: 98%;
        border-radius: 6px;
        margin: 10px;
        padding: 15px;
    }

    .myOrder-item {
        height: 110px;
        background-color: white;
        width: 98%;
        border-radius: 6px;
        margin: 10px;
        padding: 10px;
    }

    .item-title {
        font-weight: 700;
        height: 20px;
    }

    .item-opt {
        padding: 10px;
        height: 100%;
        float: left;
        width: 260px;
    }

    .item-opt Button {
        margin-left: 20px;
    }

    .anchor-wrapper {
        float: left;
        margin-left: 5%;
        width: 1300px;
        /*position: relative;*/

    }

</style>
