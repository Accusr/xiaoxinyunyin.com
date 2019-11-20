<template>
    <div class="main">


            <Upload
                    ref="upload"
                    :data="extraData"
                    :before-upload="beforeUpload"
                    :on-error="handleError"
                    :on-format-error="formatNotice"
                    :on-exceeded-size="handleMaxSize"
                    :on-progress="onProg"
                    :on-success="upSuccess"

                    :format="uploadOption.format"
                    :max-size="10000"
                    multiple
                    type="drag"
                    action="https://xxyy-1258643517.cos.ap-chengdu.myqcloud.com">

                <div style="padding: 20px 0; ">
                    <Icon type="ios-cloud-upload" size="52" style="color: #1b1b1b"></Icon>
                    <p>点击或者拖拽文件到此上传</p>
                </div>
            </Upload>
        <div class="order-detail" style="text-align: center;margin: 20px " v-if="uploadedList.length!==0">
            <span>订单详情： </span>
            <span>文件：{{uploadedList.length}} 个 </span>
            <span>打印费：{{this.comPrintFee |formatPrice}} 元 </span>
            <span>配送费：{{this.fee.expressFee|formatPrice}} 元 </span>
            <span>其他：{{ this.fee.otherFee|formatPrice}} </span>
            <span>总计费用：{{ this.comTotalFee |formatPrice}} 元 </span>
        </div>
        <COModal v-if="uploadedList.length!==0" :uploadedList="uploadedList" :fee="fee"></COModal>


    </div>
</template>


<script>
    import Upload from '../../upload/upload'
    import COModal from "@/components/commons/COModal";

    import {mapState, mapMutations, mapActions} from 'vuex';
       export default {
        name: "Primary",
        components: {Upload, COModal,},

        data() {
            return ({
                uploadedList: [],
                fee: {
                    printFee: 1,
                    expressFee: 0,
                    otherFee: 0,
                    totalFee: 0,
                },

                extraData: {
                    Host: 'xxyy-1258643517.cos.ap-chengdu.myqcloud.com',
                },
                uploadOption: {
                    format: ["docx", "doc", "pdf", "ppt", "pptx", "rar"],
                },


            })
        },
        methods: {
            ...mapMutations(['changeLogDrawerState', 'changeCOMState']),
            ...mapActions(['upStoreFile', 'listFilePrivate', 'removeFilePrivate', 'createOrderAction', 'addAddr', 'computedPage']),
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
            //上传成功后获取页码数据
            upSuccess(res, file, fileList, resHeader, callback) {
                console.log("文件信息---id" + file.id);
                this.computedPage(file.id).then(data => callback(data.result)).catch(err => alert('页码获取失败' + err));
                console.log("返回参数---" + resHeader.toString())


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



        },

        mounted() {
            if (localStorage.getItem('authorization')) {
                this.listFilePrivate().then(res => {
                    res.data.forEach(item => {
                        if (item.id !== '') {
                            item.status = 'finished';
                            item.percentage = 100;
                            item.side = 0;
                            item.color = 0;
                            item.paperSize = 1;
                            item.count = 1;
                            item.printFee = 0;
                            console.log("下载文件列表---" + item);
                            this.uploadedList.push(item);
                        }
                    })
                }).catch(err => {
                    alert(err)
                });
            } else {
                this.$router.push({name: 'home'});
                this.changeLogDrawerState()
            }


            this.uploadedList = this.$refs.upload.fileList;
        },

        computed: {
            ...mapState(['userInfo']),

            // 计算总价
            comPrintFee() {
                let i = 0;
                this.uploadedList.forEach(item => {
                    i += Number(item.printFee)
                });
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                this.fee.printFee = i;
                return i;
            },
            comTotalFee() {
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                return this.fee.totalFee = this.fee.expressFee + this.fee.otherFee + this.fee.printFee;
            }

        },
    }
</script>

<style scoped>
    .main {
        width: 1200px;
        margin: 0 auto;
    }
</style>
