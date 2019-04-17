import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';
import qs from 'qs';

// axios.defaults.baseURL = 'http://localhost:6011';
//
// axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('authorization');
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';


Vue.use(Vuex)
export default new Vuex.Store({

    state: {
        //登陆模块
        logDrawerState: false,
        userInfo: {
            id: '0',
            nickname: '游客',
            avatar: '',
            state: {
                // 读取token
                authorization: localStorage.getItem('authorization') ? localStorage.getItem('authorization') : ''
            },

        }
    },

    mutations: {
        //开关登陆面板
        changeLogDrawerState: (state) => {
            return state.logDrawerState = !state.logDrawerState;
        },
        //更新用户信息
        updateUser: (state, payload) => {
            if (payload.status === true)
                console.log('mutations---updateUser' + payload);
            return state.userInfo = payload;
        },

        //保存token
        saveAuthorization: (state, payload) => {
            localStorage.setItem('authorization', payload);
            return true;
        },
        //退出
        logout: (state) => {
            console.log('/logout')
            localStorage.removeItem('authorization', '')
            return state.userInfo = {id: '0', nickname: '游客', avatar: ''};

        },
    },

    actions: {
        logDrawerState: ({commit}) => {
            //只提交抽屉状态
            commit('changeLogDrawerState');
        },
        updateUser({commit} ) {
            console.log("Action---updateUser!")
            if (localStorage.getItem('authorization')) {
                axios('/account/user/getUserDetail').then(function (res) {
                    console.log("Action---成功返回user")
                    commit('updateUser', res.data);
                }).catch(function (error) {
                    alert(error)
                })
                // end
            } else {
                console.log("Action---拿不到authorization或者为空")

            }

        },
        login({commit}, payload) {
            return new Promise((resolve, reject) => {
                console.log("执行Action---login");
                axios.post("/account/user/login", qs.stringify({
                    username: payload.username,
                    password: payload.password
                })).then(function (response) {
                    console.log("login---发出请求获得status：" + response.data.status)
                    if (response.data.status === '200') {
                        commit('saveAuthorization', response.data.jwtToken)
                        console.log("已经获取token并提交")
                    }
                    resolve(response);

                }).catch(function (error) {
                    reject(error);
                    alert("login---"+error);
                    // return false;
                })
            })
        },
        register({commit},payload){
            return new Promise((resolve, reject) =>{
                axios.post("/account/user/register", qs.stringify({
                    username: payload.username,
                    password: payload.password
                })).then(function (response) {
                    console.log("注册请求成功返回")
                    resolve(response);
                }).catch(function (error) {
                    reject(error);
                    console.log("注册请求失败"+error)

                })
            })
        },
        logout: ({commit}) => {
            axios.get('/user/logout').then(function () {

                commit('logout');

            }).catch(function (error) {
                commit('logout');
            })
        },

        upStoreFile({commit},storeFile){


            axios.post('/file/up').then(res => {

            console.log(res.data);

            }).catch(function (error) {
            })

        },


        loginByWechat: ({commit}) => {

        },
    }
})
