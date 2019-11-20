<template>
    <div>
        <!--        <transition-group name="ease"   >-->
        <div id="file-detail" v-for="(file,index) in fileList" :key="index" @click="handlePreview(file,index)">
            <div class="file-title">
                <p style="text-overflow: ellipsis; width: 410px; white-space: nowrap;overflow: hidden; display: inline-block">
                    {{file.name}}
                    <Tooltip content="双面打印文件中需要单面打印可以用空白页面代替 " placement="top-end" :transfer=true max-width="200">
                        <Icon type="ios-help-circle-outline"/>

                    </Tooltip>
                </p>


                <Icon class="right closeFile" type="md-close" @click="handleRemove(file)"/>

                <span class="percent">{{file.createTime|dateFormat}}</span>
                <span v-if="file.percentage<1" class="percent">上传{{parseInt(file.percentage)}}%</span>
                <span v-if="file.filePages===0" class="percent">正在分析文件数据...</span>
                <span v-else class="percent">{{file.filePages}}页</span>
                <span class="percent"> {{parseFloat(file.fileSize/1048576).toFixed(2)}}MB</span>

            </div>
            <div class="option">
                <RadioGroup class="radio-item" v-model="file.side" type="button">
                    <Radio :label= 0 >单面</Radio>
                    <Radio :label= 1 >双面</Radio>
                </RadioGroup>
                <RadioGroup class="radio-item" v-model="file.paperSize" type="button">
                    <Radio :label=1>A4</Radio>
                    <Radio :label=2 disabled>A3</Radio>
                    <Radio :label=3 disabled>A5</Radio>
                    <Radio :label=4 disabled>B5</Radio>
                </RadioGroup>
                <RadioGroup class="radio-item" v-model="file.color" type="button">
                    <Radio :label=0>黑白</Radio>
                    <Radio :label=1>彩色</Radio>
                </RadioGroup>
                <ButtonGroup shape="circle" type="primary" size="default" class="btn-item">
                    <Button @click="Count(-1,file)">-</Button>
                    <Button>￥{{ file.printFee |formatPrice}} /
                        <Icon type="ios-paper-outline" size="17"/>
                        {{file.count}}
                    </Button>
                    <Button @click="Count(1,file)">+</Button>
                </ButtonGroup>
<!--                <Button :to="'https://pc.xiaoxinyy.com/file-service/file/word2pdf?fileId='+file.id" target="_blank"-->
<!--                        class="btn-item" type="info" ghost>预览-->
<!--                </Button>-->
                <Button v-if="!file.isShare" size="small" class="btn-item" type="error" @click="shareFile(file)" ghost>页数误差正在改进<br>且不影响打印效果</Button>
                <Button v-else class="btn-item" type="default" @click="unShareFile(file)" ghost>取消共享</Button>
            </div>
            <transition name="fade">
                <i-progress
                        v-if="file.showProgress"
                        :stroke-width="2"
                        :percent="parsePercentage(file.percentage)"
                        :status="file.status === 'finished' && file.showProgress ? 'success' : 'normal'"></i-progress>
            </transition>
        </div>
        <!--        </transition-group>-->


    </div>
</template>
<script>
    import iProgress from './progress/progress.vue';

    const prefixCls = 'ivu-upload';

    export default {
        name: 'UploadList',
        components: {iProgress},
        props: {
            files: {
                type: Array,
                default() {
                    return [];
                }
            }
        },
        data() {
            return {
                // prefixCls: prefixCls,
                priceRatio: {
                    base: 10,
                    sSide: 2,
                    dSide: 1.5,
                    sColor: 1,
                    mColor: 5,
                    A4: 1,
                    A3: 1,
                },
            };
        },
        methods: {

            // handleClick (file) {
            //     this.$emit('on-file-click', file);
            // },
            handlePreview(file) {
                this.$emit('on-file-preview', file);
            },
            handleRemove(file) {
                this.$emit('on-file-remove', file);
            },
            parsePercentage(val) {
                return parseInt(val, 10);
            },
            shareFile(file) {
                file.isShare = true;
            },
            unShareFile(file) {
                file.isShare = false;
            },
            //文件计数
            Count(arg, file) {
                if (file.count > 1) {
                    file.count += arg;
                } else if (file.count === 1 && arg === -1) {
                    arg = 0;
                    file.count += arg;
                } else {
                    file.count += arg;
                }
            },
        },

        computed: {
            fileList() {
                return this.files.filter(file => {
                        file.printFee = this.priceRatio.base * file.filePages * file.count *
                            (file.side == 0 ? this.priceRatio.sSide : this.priceRatio.dSide) *
                            (file.color == 0 ? this.priceRatio.sColor : this.priceRatio.mColor) *
                            (file.size == 1 ? this.priceRatio.A4 : this.priceRatio.A3);
                        //filter只收录返回true的
                        return true;
                    }
                );
            },
        }
    };
</script>
<style scoped>
    .right {
        float: right
    }

    .file-title {

        font-size: larger;
        padding: 5px 0 0 10px;
        height: 25px;
        /*background-color: #858585;*/
    }


    .percent {
        float: right;
        margin-right: 25px;
    }

    .closeFile {
        cursor: pointer;
        margin-top: 2px;
        margin-right: 5px;
        transition: 0.5s;
    }

    .closeFile:hover {
        color: red;
        transform: rotate(180deg);
    }

    #file-detail {
        transition: all 0.5s;
        /*display: inline-block;*/
        /*border: 1px solid grey;*/
        margin: 20px auto;
        background-color: #e2e2e2;
        width: 860px;
        height: 90px;
        color: #222222;
        border-radius: 3px;
    }

    .option {
        margin: 15px 15px 0 0;
    }

    .radio-item, .btn-item {
        margin: 0 0 0 20px;
    }


    /*.flip-list-item {*/
    /*    list-style-type: none;*/
    /*    !***/
    /*     * 可以在v-enter-active和v-move中分别用transition过渡，也可以在item中用transition，包含了这两项*/
    /*     * 要用all不用transform，有可能是因为splice删除效果不是transform*/
    /*     *!*/
    /*    !* transition: all 1s; *!*/
    /*}*/
    /*.flip-list-enter-active,.flip-list-leave-active {*/
    /*background-color: #ffa39e;*/
    /*        transition: all 0.5s;*/
    /*    }*/
    /*    .flip-list-move {*/
    /*        transition: all 1s;*/
    /*    }*/
    /*.flip-list-enter,.flip-list-leave {*/
    /*    background-color: #8c0776;*/
    /*    !*opacity:0;*!*/
    /*    !*transform: translateY(-50px);*!*/
    /*}*/
    /*.flip-list-enter-to,.flip-list-leave-to {*/
    /*    background-color: olivedrab;*/
    /*    !*opacity:0;*!*/
    /*    !*transform: translateY(-50px);*!*/
    /*}*/


</style>
