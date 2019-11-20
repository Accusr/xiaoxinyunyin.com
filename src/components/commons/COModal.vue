<template>
    <div class="COModal">

        <Button type="error" @click="handleSubmit" style="width: 500px; " shape="circle">提交订单</Button>

        <Modal
                v-model="COMState"
                title="订单设置"
                @on-cancel="cancel"
                :mask-closable="false">
            <div class="order">
                <Spin v-if="loadAddr" style="margin-left: 45%"></Spin>
                <p v-if="userAddrList.length===0 && !loadAddr"
                   style="color: gray;text-align: center;vertical-align: center">
                    地址空空如也...</p>
                <RadioGroup v-model="createOrderData.addId" vertical style="margin: 5px 0 5px 20px;">
                    <Radio v-for="(item,index) in userAddrList" :key="index" :label="item.id">
                        <span>{{item.contactName+' \t'+ item.detailAddress +' \t'+item.phone}}</span>
                    </Radio>

                </RadioGroup>

                <div>
                    <Cascader :data="schoolAddrData" @on-change="casSelect">
                        <a style="margin-left: 40px" href="javascript:void(0)">
                            <Button v-if="!tmpAddr.detailAddress && !loadAddr" type="primary" size="small">
                                {{userAddrList.length>5?"地址过多！":"新增我的地址"}}
                            </Button>
                        </a>

                    </Cascader>
                    <div v-if="tmpAddr.detailAddress " class="order-addr" style="margin: 5px 0 5px 20px">
                        <div class="addr-item"><span>地址</span> {{tmpAddr.detailAddress}}</div>
                        <div class="addr-item"><span>收货人</span> <input class="time-opt"
                                                                       v-model.lazy="tmpAddr.contactName" type="text"
                                                                       :placeholder="contactNamePlaceholder"></div>
                        <div class="addr-item"><span>手机号码</span> <input class="time-opt" v-model.lazy="tmpAddr.phone"
                                                                        autofocus="autofocus" type=number
                                                                        :placeholder="phonePlaceholder"></div>
                        <Button style="margin-left: 75px" type="primary" size="small" @click="goAddAddr()">添加到我的地址
                        </Button>
                    </div>

                    <Divider>配送设置</Divider>
                    <span style="margin-left: 20px">配送时间：</span>
                    <select class="time-opt" v-model="deliveryTimeId">
                        <option value="2327">下午 12：00-14：00</option>
                        <option value="3539" selected="selected">下午 18：00-20：00</option>
                    </select>


                    <Divider>其他需求</Divider>
                    <Checkbox class="other-opt" v-model="createOrderData.goods[0]"> 装钉好用文件袋密封 - 免费</Checkbox>
                    <Checkbox class="other-opt" v-model="createOrderData.goods[1]"> 透明抽杆夹/文件夹 - 2元</Checkbox>
                    <Checkbox class="other-opt" v-model="createOrderData.goods[2]"> 透明文件袋 - 2元</Checkbox>
                    <Checkbox v-for="(item,index) in coupon" :key="index" class="other-opt"
                              v-model="coupon[index].status">{{item|couponFormat}}
                    </Checkbox>
                    <p v-if="isFirstOrder" style="color: red">您是新用户首单自动优惠5元以下只需支付一分钱，5元以上直减5元!</p>
                    <p style="color: red">推荐打印得一元红包 请加QQ78223337!</p>
                </div>
                <div class="order-ps">

                </div>
            </div>
            <div slot="footer">

                <input v-model="createOrderData.postScript" placeholder="备注(128字以内)" class="ps-input"/>
                <Button @click="ok" type="primary" :loading="loading">完成</Button>

            </div>


        </Modal>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex';

    class CreateOrder {
        constructor(addrId, expressFee, printFee, otherFee, coupon, totalFee, postscript, orderType, deliveryTimeId) {
            this.addrId = addrId;
            this.orderType = orderType;
            this.expressFee = expressFee;
            this.printFee = printFee;
            this.otherFee = otherFee;
            this.coupon = coupon;
            this.totalFee = totalFee;
            this.postscript = postscript;
            this.deliveryTimeId = deliveryTimeId;
        }
    }

    class tmpAddr {
        locationAddress;

        constructor(schoolId, contactName, phone, detailAddress, locationAddress) {
            this.contactName = contactName;
            this.schoolId = schoolId;
            this.phone = phone;
            this.detailAddress = detailAddress;
            this.locationAddress = locationAddress;
        }

    }

    export default {

        name: "COModal",
        props: {
            uploadedList: {
                type: Array,
                default() {
                    return [];
                }
            },
            fee: {
                type: Object,
                default() {
                    return {
                        fee: {
                            totalFee: 0,
                            printFee: 0,
                            expressFee: 0,
                            otherFee: 0,
                        }
                    };
                }
            },
        },
        data() {
            return {
                loading: false,
                loadAddr: true,
                COMState: false,
                isFirstOrder: false,
                userAddrList: [],
                schoolAddrData: [],
                coupon: [],
                phonePlaceholder: '',
                deliveryTimeId: 3539,
                contactNamePlaceholder: '',
                tmpAddr: {
                    schoolId: 0,
                    locationAddress: '',
                    detailAddress: '',
                    phone: '',
                    contactName: '',
                },
                createOrderData: {
                    deliveryTimeId: 0,
                    goods: [true, false, false],
                    coupon: 0,
                    totalFee: 0,
                    printFee: 0,
                    postScript: '',
                    addId: '',
                    modal: false,
                },

            }
        },
        methods: {
            ...mapActions(['listAddr', 'listCoupon', 'getSchoolAddrData', 'insetAddr', 'createOrderAction', 'isFirstSuccessOrder']),
            //处理提交
            handleSubmit() {
                this.loading = false;
                this.COMState = true;
                this.listUserAddr();
                this.getSchoolAddrData(1001).then(data => this.schoolAddrData = data);
                this.listCoupon().then(data => this.coupon = data);
                this.isFirstSuccessOrder().then(data => {
                    if (data.result == 0)this.isFirstOrder = true;
                });
            },

            //提交订单
            ok() {
                if (this.createOrderData.addId) {
                    this.loading = true;
                    let payload = {};
                    payload.fileList = this.uploadedList.filter(file => {
                        file.filePrivateId = file.id;
                        delete file.status;
                        delete file.id;
                        return true;
                    });
                    let _otherFee = this.fee.otherFee;
                    let _totalFee = this.fee.totalFee;
                    let _couponFee = this.createOrderData.coupon;
                    let ps = this.createOrderData.postScript;
                    this.createOrderData.goods.forEach((item, index) => {
                        switch (index) {
                            case 0:
                                item ? ps += " - 装订并密封免费" : undefined;
                                break;
                            case 1:
                                if (item) {
                                    ps += "+透明抽杆夹2元";
                                    _otherFee += 200;
                                }
                                break;
                            case 2:
                                if (item) {
                                    ps += "+透明文件袋2元";
                                    _otherFee += 200;
                                }
                                break;
                        }
                    })
                    this.coupon.forEach((item, index) => {
                        if (item.status) {
                            switch (item.couponType) {
                                case 1:
                                    console.log(_totalFee)
                                    _couponFee = _totalFee * (1 - item.couponContent);
                                    _totalFee *= item.couponContent;
                                    console.log(_totalFee+"优惠"+_couponFee)
                                    break;
                            }
                        }
                    })

                    //检测是否新用户
                    if (this.isFirstOrder === true && _totalFee < 500) {
                        _couponFee += _totalFee - 1;
                        _totalFee = 1;
                    }else if(this.isFirstOrder === true){
                        _couponFee += 500;
                        _totalFee -= 500;
                    }

                    //添加其他费用
                    _totalFee += _otherFee;
                    payload.order = new CreateOrder(this.createOrderData.addId, this.fee.expressFee, this.fee.printFee,
                        _otherFee, parseInt(_couponFee), parseInt(_totalFee), ps, '12', this.deliveryTimeId);
                    this.createOrderAction(payload).then(res => {
                        this.COMState = false;
                    });


                    //清空费用数据
                    // _totalFee = 0;
                } else {
                    alert("未选择地址")
                }
            },
            cancel() {
                this.$Notice.error({title: '您取消了订单！'});
            },
            listUserAddr() {
                this.listAddr().then(data => {
                    this.userAddrList = [];
                    this.userAddrList = data;
                    this.loadAddr = false;
                }).catch(err => alert(err))
            },

            goAddAddr() {
                if (this.tmpAddr.contactName && this.tmpAddr.phone.length === 11 && this.tmpAddr.detailAddress) {
                    let addr = new tmpAddr(this.userInfo.schoolId, this.tmpAddr.contactName, this.tmpAddr.phone, this.tmpAddr.detailAddress, this.tmpAddr.locationAddress);
                    this.insetAddr(addr).then(data => {
                        if (data.result) this.listUserAddr();
                        this.tmpAddr.detailAddress = null;
                    }).catch(data => alert(data.message))
                } else {
                    this.contactNamePlaceholder = '收件人不能为空';
                    this.phonePlaceholder = '手机号码不能为空'
                }
            },
            casSelect(value, selectedData) {
                this.tmpAddr.detailAddress = selectedData.map(o => o.label).join(', ');
                this.tmpAddr.locationAddress = selectedData.map(o => o.value).join('|');
            },

        },
        computed: {
            ...mapState(["userInfo"])
        },
        mounted() {


        },

        filters: {
            couponFormat(item) {
                let type;

                switch (item.couponType) {
                    case 1:
                        type = '班级优惠';
                        break;
                }


                return ` ${type} ${item.couponContent * 10}` + '折';
            }
        },

    };
</script>

<style scoped>
    .COModal {
        text-align: center;
    }

    .order-addr span {
        float: left;
        width: 75px;
    }

    .addr-item {
        margin: 10px 0 10px 0;
    }

    .addr-item input {
        height: 20px;
        width: 180px;
    }

    .other-opt {
        display: block;
        margin: 0 0 10px 20px;

    }

    .time-opt {
        outline: none;
        border-top: none;
        border-right: none;
        border-left: none;
        border-bottom: 1px gray solid;
        height: 20px;
    }

    .ps-input {
        float: left;
        margin: 10px 0 0 0;
        outline: none;
        border-top: none;
        border-left: none;
        border-right: none;
        border-bottom: 1px gray solid;
        height: 20px;
        width: 200px;
    }
</style>
