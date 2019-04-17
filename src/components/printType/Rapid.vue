<template>
    <div class="main">
<!--        <h1>加急打印</h1>-->
        <div class="file-upload">
            <Tooltip  placement="right" content="加急文件打印上传" :delay="200" >
            <Upload
                    ref="upload"
                    :data="extraData"
                    :headers="headers"
                    :before-upload="beforeUpload"
                    :on-error="handleError"
                    :on-format-error="formatNotice"
                    :on-exceeded-size="handleMaxSize"
                    :on-progress="onProg"
                    :on-success="upSuccess"
                    :show-upload-list="false"
                    :format="uploadOption.format"
                    :max-size="10000"
                    :default-file-list="defaultList"
                    multiple
                    type="drag"
                    action="https://xxyy-1258643517.cos.ap-chengdu.myqcloud.com">

                <div style="padding: 20px 0; width:300px">
                    <Icon type="ios-cloud-upload" size="52" style="color: #1b1b1b"></Icon>
                    <p>点击或者拖拽文件到此上传</p>
                </div>
            </Upload>
            </Tooltip>
        </div>

        <div class="file-detail" v-for="(file,index) in uploadedList" :key="file.uid" >
            <div class="file-title">{{file.name}}
                <Icon class="right closeFile" type="md-close" @click="handleRemove(index)" />
                <span class="percent" >{{parseInt(file.percentage)}}%</span>
            </div>
            <div class="option">
                <RadioGroup class="radio-item" v-model="file.side" @on-change="computePrice(file)" type="button">
                    <Radio label="单面"  ></Radio>
                    <Radio label="双面"  ></Radio>
                </RadioGroup>
                <RadioGroup class="radio-item" v-model="file.pageSize" @on-change="computePrice(file)" type="button">
                    <Radio label="A4"></Radio>
                    <Radio label="A3"></Radio>
                    <Radio label="B5"></Radio>
                    <Radio label="A5"></Radio>
                </RadioGroup>
                <RadioGroup class="radio-item" v-model="file.color" @on-change="computePrice(file)" type="button">
                    <Radio label="彩色" ></Radio>
                    <Radio label="黑白" ></Radio>
                </RadioGroup>
                <ButtonGroup shape="circle" type="primary" size="default" @on-change="computePrice(file)" class="btn-item">
                <Button @click="Count(-1,file)">-</Button>
                <Button >￥{{ file.paperPrice}} / <Icon type="ios-paper-outline" size="17"/>  {{file.count}}</Button>
                <Button @click="Count(1,file)">+</Button>
                </ButtonGroup>
                <Button class="btn-item" type="info"  ghost>预览</Button>
                <Button class="btn-item" type="error"  ghost>共享</Button>
            </div>
        </div>

        <div class="order" v-if="uploadedList.length!==0">
            <div class="order-item">
            <span>总计：123.00 元</span>
            <Button type="error" @click="submitOrder">提交订单</Button>
            </div>
        </div>




    </div>
</template>

<script>
    import {mapState, mapMutations, mapActions} from 'vuex';

    class StoreFile {
        constructor(fileName, fileSuffix, fileSize, userId, isShare,) {
                this.fileName = fileName;
                this.fileSuffix = fileSuffix;
                this.fileSize = fileSize;
                this.userId = userId;
                this.isShare = isShare;
        }

    }

    export default {
        name: "rapid",
        data () {
            return ({
                uping:{},
                uploadedList:[],
                defaultList: [{
                    name: '已上传',
                    side: '单面',
                    pageSize: 'A4',
                    color: '黑白',
                    bind: '钉好',
                    count: 1,
                    url:'',
                    uid: '',
                    percentage: '',
                    status: '',
                    pages: '',
                    paperPrice: '0.2',

                }],
                storeFileList:[],
                priceRatio:{
                    base: '0.1',
                    sside: '1',
                    dside: '1.5',
                    scolor: '1',
                    mcolor: '5',
                    A4: '1',
                    A3: '2',
                },
                filePara: {
                    name: '',
                    side: '单面',
                    color: '黑白',
                    size: 'A4',
                    bind: '钉好',
                    count: 8888,
                    url:'',
                    uid: '',
                    percentage: '',
                    status: '',
                    pages: '',
                    paperPrice: '0.2',
                },
                headers:{
                    'Access-Control-Allow-Origin' : '*'
                },
                extraData:{
                    key: '',
                    Host: 'xxyy-1258643517.cos.ap-chengdu.myqcloud.com',
                },
                uploadOption: {
                    format: ["xlsx","xls", "docx","doc","pdf","ppt","pptx","rar" ],
                },



            })
        },
        methods: {
            ...mapMutations(['changeLogDrawerState']),
            ...mapActions(['upStoreFile']),
            parseFileName(){
                return"test1.docx";
            },
            //上传时
            onProg(event,file,fileList){
                // console.log(file.showProgress === true);
                // this.uping = file;

            },
            //上传前
            beforeUpload(file){
                //生成文件名前缀:时间戳+校园id+4位随机
                let tmpname = new Date().getTime().toString() +"T"+ this.userInfo.schoolId.toString()+"S" + parseInt(Math.random()*10000).toString();
                //获取.的索引
                let index = file.name.indexOf('.', -4);
                //获取后缀
                let suffix = file.name.slice(index)
                //生成新文件名
                let fileName = tmpname + suffix;
                this.extraData.key = this.tmpname;

                   var storeFile = new StoreFile(fileName, suffix, "100", this.userInfo.id, "false");

                this.upStoreFile(storeFile);


                const check = this.uploadedList.length < 50;
                if (!check) {
                    this.$Notice.warning({
                        title: '订单文件过多，请先删除不需要的文件！文件在个人文档中仍会保留。'
                    });
                }
                //根据返回值上传与否
                return check;
            },
            //上传成功后
            upSuccess(response,file,fileList){
                file = Object.assign({}, file, {
                    side: '单面',
                    color: '黑白',
                    pageSize: 'A4',
                    bind: '钉好',
                    pages: '',
                    count: 1,
                    paperPrice: this.priceRatio.base,

                })
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1,file);





            },
            //删除
            handleRemove (index) {
                this.$refs.upload.fileList.splice(index, 1);
            },
            //计数
            Count(arg, file){
                if(file.count > 1){
                    file.count += arg;
                }else if(file.count === 1 && arg === -1){
                    arg = 0;
                    file.count += arg;
                }else{
                    file.count += arg;
                }
                this.$forceUpdate();
                // console.log(count)
            },
            //提交订单
            submitOrder(){
                if(this.user.userName === ""){
                    this.changeLogDrawerState();
                }else{
                    alert("订单已提交！");
                }
            },
            //计算价格
            computePrice(file){
                console.log(file)
                file.paperPrice =parseFloat(this.priceRatio.base * (file.side ==='单面'? this.priceRatio.sside : this.priceRatio.dside)*
                                (file.color ==='黑白'? this.priceRatio.scolor : this.priceRatio.mcolor)*
                                (file.size ==='A4'? this.priceRatio.A4 : this.priceRatio.A3)).toFixed(1)
            },
            handleError(error){
                this.$Notice.warning({
                    title: '上传失败',
                    desc: '上传失败，我们已经收到反馈',
                    duration: 0,
                });
            },
            //文件格式
            formatNotice( ){
                this.$Notice.error({
                    title:'不支持的格式',
                    desc: '仅支持pdf,doc,docx,xls,xlsx,ppt,pptx文件',
                    top: 100,
                    duration: 0,
                });
            },
            //文件过大
            handleMaxSize (file,fileList) {
                this.$Notice.warning({
                    title: '文件过大',
                    desc: file.name + '文件过大，请不要超过10M',
                    duration: 0,
                });
            },


        },

        mounted() {
            this.uploadedList = this.$refs.upload.fileList;
        },

        computed:{
            ...mapState(['userInfo']),
            // computedPrice(){
            //     return function (file) {
            //         console.log(file)
            //         return file.paperPrice *= (file.side ==='单面'? this.priceRatio.sside : this.priceRatio.dside)*
            //                 (file.color ==='黑白'? this.priceRatio.scolor : this.priceRatio.mcolor)*
            //                 (file.size ==='A4'? this.priceRatio.A4 : this.priceRatio.A3)
            //     }
            // }

        },

    }
</script>

<style scoped>
    .main{
        width: 1200px;
        /*background-color: #ccffec;*/
        margin: 0 auto;
    }
    .right{float: right}
    .file-upload{
        margin: 10px auto;
        width: 300px;
    }
    .file-title{
        font-size: larger;
        padding: 5px 0 0 10px;
        height: 25px;
        background-color: #14181b;
    }
    .percent{
        float: right;
        margin-right: 30px;
    }
    .closeFile{
        cursor: pointer;
        margin-right: 5px;
        transition: 0.5s;
    }
    .closeFile:hover{
        color: red;
        transform: rotate(180deg);
    }
    .file-detail{
        /*border: 1px solid grey;*/
        margin: 20px auto;
        background-color: whitesmoke;
        width: 850px;
        height: 90px;
        color: whitesmoke;
    }
    .option{
        margin: 15px 15px 0 0;
    }
    .radio-item, .btn-item{
        margin: 0 0 0 20px;
    }

    .order{
        margin: 0 auto;
        width: 1200px;
        height: 80px;
        /*background-color: whitesmoke;*/
        /*box-shadow: 10px 10px 10px grey;*/
        /*transform:skew(30deg);*/
        padding: 20px 0 0 70%;
    }
    .order-item{
        /*transform:skew(-30deg);*/
    }
    .order-item span{
        margin-right: 100px;
        font-size: large;
        font-family: 微软雅黑;
    }

</style>