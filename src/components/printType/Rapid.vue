<template>
    <div class="main">
        <div class="msg">
            加急功能正在日夜赶工，敬请期待。。。

        </div>


    </div>
</template>


<script>
    import Upload from '../../upload/upload'
    import {mapState, mapMutations, mapActions} from 'vuex';



    class CreateOrder {
        constructor(addrId, serviceFee, packingFee, printFee, coupon, totalFee, postScript) {
            this.addrId = addrId;
            this.orderType = 1;
            this.serviceFee = serviceFee;
            this.packingFee = packingFee;
            this.printFee = printFee;
            this.coupon = coupon;
            this.totalFee = totalFee;
            this.postScript = postScript;
        }
    }

    class FinishOrder {
        constructor(payType, transactionId, payTime, paySuccessTime, status) {
            this.payType = payType;
            this.transactionId = transactionId;
            this.payTime = payTime;
            this.paySuccessTime = paySuccessTime;
            this.status = status;
        }
    }

    class UserAddrItem {
        constructor(label, value) {
            this.value = value;
            this.label = label
        }

    }

    class OrderFile {
        constructor() {
        }
    }

    export default {
        name: "Rapid",
        components: {Upload},

        data() {
            return ({
                uploadedList: [],
                tmpList: [],
                defaultList: [],
                storeFileList: [],
                priceRatio: {
                    paperPrice: '0.2',
                    serviceFee: '0',
                    packingFee: '0',
                    printFee: '0',

                },
                createOrderData: {
                    totalFee: 0,
                    postScript: '',
                    addId: '',
                    modal: false,
                },
                extraData: {
                    Host: 'xxyy-1258643517.cos.ap-chengdu.myqcloud.com',
                },
                uploadOption: {
                    format: ["xlsx", "xls", "docx", "doc", "pdf", "ppt", "pptx", "rar"],
                },
                selectedAddr: '',
                userAddrList: [],
                tmpAddr: {
                    detailAddress: '',
                    phone: '',
                    userId: '',
                },

                schoolAddrData: [
                    {
                        value: '东区',
                        label: '东区',
                        children: [{
                            value: '11#',
                            label: '11#',
                            children: [{
                                value: '101',
                                label: '101',

                            }, {
                                value: '403',
                                label: '403',
                            }]
                        }]
                    }
                ],


            })
        },
        methods: {
            ...mapMutations(['changeLogDrawerState']),
            ...mapActions(['upStoreFile', 'listFilePrivate', 'removeFilePrivate', 'createOrderAction', 'addAddr', 'getAddrList','computedPage']),
            // parseFileName(){
            //     return"test1.docx";
            // },
            //上传时
            onProg(event, file, fileList) {
                // console.log(file.showProgress === true);

            },
            //上传前
            beforeUpload(file) {
                const check = this.uploadedList.length < 20;
                if (!check) {
                    this.$Notice.warning({
                        title: '订单文件过多，请先删除不需要的文件！'
                    })
                }

                //根据返回值上传与否
            },
            //上传成功后
            upSuccess(res, file, fileList,resHeader,callback) {
                console.log("文件信息---id"+file.id)
                this.computedPage(file.id).then(res=>{
                    callback(res.data.count)
                    console.log("获取页码成功---"+res.data.count)
                }).catch(err=>{
                    alert('页码获取失败'+err)
                })
                console.log("返回参数---"+resHeader.toString())



            },
            //文件被删除狗子
            onRemove(file, fileList) {
                this.removeFilePrivate(file.id).then(res => {
                    // eslint-disable-next-line no-empty
                    if (res.data === "success") {
                    } else alert("文件删除失败，请重试" + res.data)
                }).catch(err => {
                    alert("文件删除失败，请重试" + err)
                });
            },
            // 计数
            Count(arg, file) {
                if (file.count > 1) {
                    file.count += arg;
                } else if (file.count === 1 && arg === -1) {
                    arg = 0;
                    file.count += arg;
                } else {
                    file.count += arg;
                }
                // this.$forceUpdate();
            },
            //处理提交
            handleSubmit() {
                this.createOrderData.modal = true;
                this.getAddrList().then(res => {
                    if (res.data !== '') {
                        this.userAddrList = []
                        res.data.forEach(item => {
                            this.userAddrList.push(new UserAddrItem(item.detailAddress + item.phone, item.id))
                        })
                        console.log(res.data)

                    }
                }).catch(err => {
                    alert(err)
                })
            },

            handleError(error) {
                this.$Notice.warning({
                    title: '上传失败',
                    desc: '上传失败，我们已经收到反馈',
                    duration: 0,
                });
            },
            //文件格式
            formatNotice() {
                this.$Notice.error({
                    title: '不支持的格式',
                    desc: '仅支持pdf,doc,docx,xls,xlsx,ppt,pptx文件',
                    top: 100,
                    duration: 0,
                });
            },
            //文件过大
            handleMaxSize(file, fileList) {
                this.$Notice.warning({
                    title: '文件过大',
                    desc: file.name + '文件过大，请不要超过10M',
                    duration: 0,
                });
            },
            casSelect(value, selectedData) {
                this.tmpAddr.detailAddress = selectedData.map(o => o.label).join(', ');
            },
            //提交订单
            ok() {
                this.tmpAddr.userId = this.userInfo.id;
                console.log(this.tmpAddr.userId)
                if (this.selectedAddr !== '' || this.tmpAddr.addrText !== '') {
                    this.addAddr(this.tmpAddr).then(res => {
                        if (res.data > 0) {
                            var payload = {};
                            payload.fileList = this.uploadedList;
                            payload.order = new CreateOrder(this.createOrderData.addId, this.priceRatio.serviceFee, this.priceRatio.packingFee,
                                this.priceRatio.printFee, 1, this.createOrderData.totalFee, this.createOrderData.postScript);
                            this.createOrderAction(payload).then(res => {
                                alert("订单已提交！");
                            }).catch(err => {
                                alert(err)
                            })
                        }
                    }).catch(err => {
                        alert(err)
                    })

                    this.$Notice.info({title: '订单已经提交！'});
                } else {
                    alert("内容有误")
                }
            },
            cancel() {
                this.$Notice.error({title: '您取消了订单！'});
            }
        },

        mounted() {
            if (localStorage.getItem('authorization')) {
                this.listFilePrivate().then(res => {
                    res.data.forEach(item => {
                        if (item.id !== '') {
                            item.status = 'finished';
                            item.percentage = 100;
                            item.side = "单面";
                            item.color = "黑白";
                            item.paperSize = "A4";
                            item.count = 1;
                            item.fileTotalPrice = 0;
                            console.log("下载文件列表---"+item)
                            this.uploadedList.push(item);
                        }
                    })
                }).catch(err => {
                    alert(err)
                })
            } else {
                this.$router.push({name: 'home'})
                this.changeLogDrawerState()
            }


            this.uploadedList = this.$refs.upload.fileList;
        },

        computed: {
            ...mapState(['userInfo']),

            // 计算总价
            sCreateOrderData() {
                let i = 0;
                this.uploadedList.forEach(item => {
                    i += Number(item.fileTotalPrice)
                });
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                this.createOrderData.totalFee = parseFloat(i).toFixed(2);
                return this.createOrderData;

            },
        },

        filters: {
            dateFormat(timeStamp) {
                var dt = new Date(timeStamp)
                // console.log(timeStamp)
                if (timeStamp === undefined) {
                    dt = new Date();
                }
                let y = dt.getFullYear();
                let m = dt.getMonth() + 1;
                let d = dt.getDate();

                return `${y}-${m}-${d}`
            },

        }

    }
</script>

<style scoped>
    .main {
        width: 1200px;
        margin: 0 auto;
    }

    .msg{
        text-align: center;
    }

    .file-upload {
        margin: 10px auto;
        /*width: 300px;*/
    }

    .file-title {
        font-size: larger;
        padding: 5px 0 0 10px;
        height: 25px;
        background-color: #14181b;
    }

    .percent {
        float: right;
        margin-right: 30px;
    }

    .closeFile {
        cursor: pointer;
        margin-right: 5px;
        transition: 0.5s;
    }

    .closeFile:hover {
        color: red;
        transform: rotate(180deg);
    }

    .file-detail {
        /*border: 1px solid grey;*/
        margin: 20px auto;
        background-color: whitesmoke;
        width: 850px;
        height: 90px;
        color: whitesmoke;
    }

    .option {
        margin: 15px 15px 0 0;
    }

    .radio-item, .btn-item {
        margin: 0 0 0 20px;
    }

    .order {
        /*margin: 0 auto;*/
        /*width: 1200px;*/
        /*height: 150px;*/
        /*background-color: whitesmoke;*/
        /*box-shadow: 10px 10px 10px grey;*/
        /*transform:skew(30deg);*/
        /*padding: 20px 0 0 70%;*/
    }

    .order-item {
        text-align: center;

    }

    /*.order-item span {*/
    /*    font-size: large;*/
    /*    font-family: 微软雅黑;*/
    /*}*/

</style>
