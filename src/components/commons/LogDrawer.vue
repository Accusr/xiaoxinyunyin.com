<template>
    <div>

        <Drawer title="登录注册" :closable="true" v-model="logDrawerState" width="317">
            <div style="text-align: center">
                <div class="loginBasic" v-if="!spinState">
                    <p class="tip">{{tip.username}}</p>
                    <Input  v-model.lazy="user.username" prefix="md-person" placeholder="请输入学号"
                           style="width: 200px;" type="number">
                    </Input>
                    <p v-show="isRegister" class="tip">注意：学号一旦设置不可更改</p>
                    <p class="tip">{{tip.password}}</p>
                    <Input  v-model.lazy="user.password" prefix="md-key" type="password"
                           placeholder="请输入密码"
                           @on-enter="isLogin(user)"
                           style="width: 200px;">
                    </Input>
                    <p v-show="isRegister" class="tip">{{tip.password}}</p>
                    <Input  v-show="isRegister" v-model.lazy="passwordCheck" type="password"
                           prefix="md-key"
                           placeholder="请确认密码" @on-enter="isLogin(user)"
                           style="width: 200px;">
                    </Input>
                    <Checkbox v-model="user.isRememberMe" v-show="!isRegister" class="checkRemember">记住我</Checkbox>
                    <Button type="primary" class="login" @click="isLogin(user)">{{isRegister? "注册":"登录"}}</Button>
                    <Button v-show="isRegister && !directive" class="backToLogin" @click="changeRegisterState" type="dashed">返回登录
                    </Button>
                </div>
                <div class="spin-container" v-else>
                    <Spin fix></Spin>
                </div>
                <div v-if="!directive">
                <Divider>微信登录</Divider>
                <div class="wechat" @click="loginByWechatHandler">
                    <img src="../../assets/wechat.jpg" width="100px" alt="">
                </div>
                <span>请仔细阅读隐私协议等，登录就代表您同意该协议</span>
                <div id="wechatCodeImage" style="overflow: hidden"></div>
                </div>
            </div>

        </Drawer>
    </div>
</template>


<script>
    import {mapMutations, mapActions, mapState} from 'vuex';
    // import wechatImage from "@/assets/wechatImage.css";

    export default {
        data() {
            return {
                isRegister: false,
                spinState: false,
                passwordCheck: '',
                user: {
                    username: '',
                    password: '',
                    isRememberMe: true,
                },
                tip: {
                    username: '',
                    password: '',
                }
            }
        },
        methods: {
            ...mapActions(['login', 'loginByWechat', 'getUser', 'register','insetStudentIdAction']),
            ...mapMutations(['changeLogDrawerState']),





            isLogin(user) {
                this.tip = {};
                if (this.user.username == '' || this.user.password == '' ) {
                    this.tip.username = '用户名或密码不能为空！'
                    return;
                }else if (this.user.username.length !==10 ||this.user.username.substring(0,1) >2) {
                    this.tip.username = '学号无效请联系管理员！'
                    return;
                }else if(this.isRegister && this.user.password !== this.passwordCheck){
                    this.tip.password = '密码不一致！'
                    return;
                }


                if (!this.isRegister) {
                    this.spinState = true;
                    this.doLogin(user)
                } else {
                    //进入加载状态
                    this.spinState = true;
                    if(this.directive){
                        this.insetStudentIdAction(user).then(data=>{
                            this.spinState = false;
                            this.doLogin(user);

                    }).catch(data=>{
                            this.spinState = false;
                            switch (data.message) {
                                case 'AUTH_EXIST':
                                    this.tip.username = '学号已设置密码'
                                    break;
                            }
                        })
                    }else this.register(user).then(data => {
                        this.spinState = false;
                        //注册成功登陆
                        this.doLogin(user)

                    }).catch(data => {
                        this.spinState = false;
                        switch (data.message) {
                            case 'AUTH_EXIST':
                                this.tip.username = '学号已设置密码'
                                break;
                            case 'USER_EMPTY':
                                this.tip.username = '该学号未设置密码，请先设置密码'
                                this.changeRegisterState();
                                break;

                        }

                    })
                }
            },
            doLogin(user) {
                //初始化提示
                this.tip = {};
                this.login(user).then(data => {
                    //判断结果是否符合
                    if (data.code === '1') {
                        this.spinState = false;
                        this.changeLogDrawerState();
                        setTimeout(() => this.getUser(), 500)
                    }

                }).catch(data => {
                    this.spinState = false;
                    switch (data.message) {
                        case 'PASSWORD_ERROR':
                            this.tip.password = '密码错误'
                            break;
                        case 'USER_EMPTY':
                            this.tip.username = '该学号未设置密码，请先设置密码'
                            this.changeRegisterState();
                            break;
                    }
                })
            },

            changeRegisterState() {
                return this.isRegister = !this.isRegister;
            },
            loginByWechatHandler() {

                // eslint-disable-next-line no-undef
                let sss = new WxLogin({
                    // self_redirect:true,
                    id: "wechatCodeImage",
                    appid: "wxb8d36cd45a4a048f",
                    scope: "snsapi_login",
                    redirect_uri: encodeURI("https://xiaoxinyunyin.com"),
                    state: "8888",
                    style: "black",
                    href: 'https://xxyycom-1258643517.cos.ap-chengdu.myqcloud.com/wechatImage.css',
                });

                // this.loginByWechat()
            },

        },
        computed: {
            ...mapState(['userInfo','directive']),


            logDrawerState: {
                get() {
                    return this.$store.state.logDrawerState;
                },
                set() {
                    //初始化提示
                    this.tip = {};
                    this.changeLogDrawerState();
                }
            },

        },
        updated(){
            if(this.directive){
                this.isRegister = true;
            }
        },
        mounted() {
            const Wxlogin = document.createElement('script')
            Wxlogin.type = 'text/javascript'
            Wxlogin.src = 'https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js'
            document.body.appendChild(Wxlogin)
        },
    }
</script>


<style scoped>


    .tip {
        height: 20px;
        color: red;
        text-align: left;
        line-height: 25px;
        margin-left: 40px;
    }

    .login, .checkRemember {
        text-align: center;
        display: block;
        margin: 18px auto;
    }

    .backToLogin {
        /*text-align: center;*/
        /*margin: 0 auto;*/
    }

    .wechat {
        margin-top: 50px;
        text-align: center;
        cursor: pointer;
    }

    .spin-container {
        height: 100px;
        background-color: darkcyan;
        position: relative;
        display: inline-block;
    }
</style>
