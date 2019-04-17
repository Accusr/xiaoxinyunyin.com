<template>
    <div>

        <Drawer title="登录注册" :closable="true" v-model="logDrawerState">
            <div>
                <Input @on-blur="isAllowed" v-model.lazy="user.username" prefix="md-person"  placeholder="请输入手机号" style="width: 185px"><Icon v-show="isNameEmpty" type="ios-alert-outline" slot="suffix" style="color: red" /></Input>
                <Input @on-blur="isAllowed" v-model.lazy="user.password" class="pwd" prefix="md-key" placeholder="请输入密码" @on-enter="isLogin(user)"
                       style="width: 185px"><Icon v-show="isPwdEmpty" type="ios-alert-outline" slot="suffix" style="color: red"/></Input>
                <Input @on-blur="isAllowed" v-show="isRegister" v-model.lazy="user.password" class="pwd" prefix="md-key" placeholder="请确认密码" @on-enter="isLogin(user)"
                       style="width: 185px"><Icon v-show="isPwdEmpty" type="ios-alert-outline" slot="suffix" style="color: red"/></Input>
                <Checkbox v-model="user.rememberMe" v-show="!isRegister" class="checkRemember">记住我</Checkbox>
                <Button type="primary" class="login" @click="isLogin(user)">{{isRegister? "注册":"登录"}}</Button>
                <Button v-show="isRegister" class="backToLogin" @click="changeRegisterState" type="dashed">返回登录</Button>
                <Divider>微信登录</Divider>
                <div class="wechat" @click="loginByWechat">
                    <img src="../../assets/wechat.jpg" width="100px" alt="">
                </div>
                <span>请仔细阅读隐私协议等，登录就代表您同意该协议</span>
            </div>

        </Drawer>
    </div>
</template>


<script>
    import {mapMutations, mapActions, mapState} from 'vuex';

    export default {
        data() {
            return {
                user: {
                    username: '110',
                    password: '000000',
                    rememberMe: true,
                },
                isRegister: false,
                isNameEmpty: false,
                isPwdEmpty: false,
            }
        },
        methods: {
            ...mapActions(['login', 'loginByWechat', 'updateUser','register']),
            ...mapMutations(['changeLogDrawerState']),

            isAllowed(){
                if(this.user.username === ''){
                    this.isNameEmpty = !this.isNameEmpty;
                    return false;
                }else if(this.user.password === ''){
                    this.isPwdEmpty = !this.isPwdEmpty
                    return false;
                }else {
                    this.isNameEmpty = false;
                    this.isPwdEmpty = false;
                    return true;
                }
            },

            isLogin(user) {
                if(this.user.username === '' ||this.user.password === ''){
                    alert("用户名或密码不能为空！"); return;}

                var _this = this;

                if(this.isRegister === false){
                this.login(user).then(function (res) {
                    console.log("登陆函数action的返回---"+res);
                    if (res.data.status === '200') {
                        console.log("登陆面板--关闭面板")
                        _this.changeLogDrawerState();
                        setTimeout(()=>_this.updateUser(),500)
                        console.log("登陆面板--登陆完成进入更新")
                    } else {
                        alert("未注册或密码错误！")
                        _this.changeRegisterState();
                    }

                }).catch(function (error) {
                    alert("网络错误"+error)
                })}else {

                    this.register(user).then(function (res) {
                        if(res.data.status === '200'){

                            /////////////////////////////登陆
                            _this.login(user).then(function (res) {
                                console.log("注册函数action的返回---"+res);
                                if (res.data.status === '200') {
                                    console.log("登陆面板--关闭面板")
                                    _this.changeLogDrawerState();
                                    _this.updateUser();
                                    console.log("登陆面板--登陆完成进入更新")
                                } else {
                                    _this.changeRegisterState();
                                }

                            }).catch(function (error) {
                                alert("网络错误" + error);
                            })

                            /////////////////////////////
                        }else {
                            alert(res.data.msg);
                        }
                    }).catch(function (error) {
                        alert("注册方法出错！"+error);
                    })
                }
            },

            changeRegisterState() {
                return this.isRegister = !this.isRegister;
            },

        },
        computed: {
            ...mapState(['userInfo']),



            logDrawerState: {
                get() {
                    return this.$store.state.logDrawerState;
                },
                set(logDrawerState) {
                    this.$store.dispatch('logDrawerState', logDrawerState)
                }
            },

        },
    }
</script>


<style scoped>
    .pwd {
        margin-top: 20px;
    }

    .login, .checkRemember {
        text-align: center;
        display: block;
        margin: 18px auto;
    }

    .backToLogin {
        margin: 0 30%;
    }

    .wechat {
        margin-top: 80px;
        text-align: center;
        cursor: pointer;
    }

</style>