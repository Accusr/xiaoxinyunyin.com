import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';
import qs from 'qs';

axios.defaults.baseURL = 'https://xxyy.curryting.com/';
// axios.defaults.baseURL = 'http://localhost:6010';
axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
// 防止ie缓存
//拦截器
axios.interceptors.request.use(config => {
    config.headers.Authorization = localStorage.getItem('authorization');
    config.timeout = 10000;
    // NProgress.start()
    return config;
}, err => {
    alert("请求错误！")
    return Promise.reject(err)
});
axios.interceptors.response.use(config => {
    return config;
}, err => {
    console.dir(err)
    if (err.message === "Network Error") alert("网络错误，请检查网络是否通畅！")
    if(err.response.data === "AUTHORIZATION_EXPIRED") this.logout();
    return Promise.reject(err.response)
})


Vue.use(Vuex)
export default new Vuex.Store({

    state: {
        //登陆模块
        logDrawerState: false,
        payModelState: false,
        COMState: true,
        directive: '',
        userInfo: {
            id: '0',
        },
        orderDetail: {},
    },

    mutations: {
        //开关登陆面板
        changeLogDrawerState: (state,directive) => {
            state.directive = directive;
            return state.logDrawerState = !state.logDrawerState;
        },
        changeCOMState: state => state.COMState = !state.COMState,
        payModelState: state => {
            state.payModelState = !state.payModelState;
            state.orderDetail = null;

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
            localStorage.removeItem('authorization')
            return state.userInfo = {id: '0', nickname: '游客', avatar: ''};
        },
        error: (state, payload) => {
            return state.error = payload;
        },
        payOrder: (state, payload) => {
            state.payModelState = !state.payModelState;
            state.orderDetail = null;
            state.orderDetail = payload;
        }
    },

    actions: {
        payModelState: ({commit}) => {
            commit('payModelState')
        },
        getUser({commit}) {
            console.log("Action---getUser!")
            if (localStorage.getItem('authorization')) {
                axios('https://auth.xiaoxinyy.com/account-service/user/get').then(res => commit('updateUser', res.data)).catch(err =>
                    commit('logout'))
            } else {
                console.log("Action---拿不到authorization或者为空")
            }
        },
        updateUserInfo({commit}, userInfo) {
            return new Promise((resolve, reject) => axios.put('https://auth.xiaoxinyy.com/account-service/user/update', userInfo
                ).then(res => resolve(res.data)).catch(err => reject(err))
            )
        },
        socialBind({commit}, payload) {
            return new Promise((resolve, reject) => axios('https://auth.xiaoxinyy.com/account-service/user/binding/wechat', qs.stringify(payload)
                ).then(res => resolve(res.data)).catch(err => reject(err))
            )
        },
        isFirstSuccessOrder(){
            return new Promise((resolve, reject) => axios('file-service/order/isFirstSuccessOrder'
                ).then(res => resolve(res.data)).catch(err => reject(err))
            )
        },

        //更新订单状态
        updateOrder({commit}, order) {
            return new Promise((resolve, reject) => axios.put('file-service/order/update', order
            ).then(res => resolve(res)).catch(err => reject(err)))
        },
        login({commit}, payload) {
            return new Promise((resolve, reject) => axios("https://auth.xiaoxinyy.com/account-service/user/login", {params: payload}).then(res => {
                    if (res.data.code === '1') {
                        commit('saveAuthorization', res.data.result)
                    }
                    resolve(res.data);
                }).catch(err => reject(err.data))
            )
        },
        register({commit}, payload) {
            return new Promise((resolve, reject) => {
                axios.post("https://auth.xiaoxinyy.com/account-service/user/register", qs.stringify(payload)).then(res => resolve(res.data)).catch(err => {
                    reject(err.data);

                })
            })
        },
        insetStudentIdAction({commit}, payload) {
            return new Promise((resolve, reject) => {
                axios.post("https://auth.xiaoxinyy.com/account-service/user/studentId/inset", qs.stringify(payload)).then(res => resolve(res.data)).catch(err => {
                    reject(err.data);

                })
            })
        },

        upStoreFile({commit}, file) {
            return new Promise((resolve, reject) => axios.post('file-service/file/up', qs.stringify(file)).then(res => {
                    resolve(res.data)
                    console.log(res.data);
                }).catch(err => alert(err))
            )
        },
        listFilePrivate() {
            return new Promise((resolve, reject) => {
                axios('file-service/file/list').then(res => {
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })

        },
        removeFilePrivate({commit}, id) {
            return new Promise((resolve, reject) => {
                axios.delete('file-service/file/delete', {params: {id: id}}).then(res => resolve(res.data)
                ).catch(err => reject(err.data))
            })
        },
        removeOrder({commit}, id) {
            return new Promise((resolve, reject) => {
                axios.delete('file-service/order/delete', {
                    params: {id: id}
                }).then(res => {
                    resolve(res.data)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        createOrderAction({commit}, payload) {
            return new Promise((resolve, reject) => axios.post('file-service/create', {
                    fileList: payload.fileList,
                    order: payload.order
                }).then(res => {
                    commit('payOrder', res.data);
                    resolve(res.data)
                }).catch(err => reject(err.data))
            )
        },
        payOrder({commit}, order) {
            return new Promise((resolve, reject) => axios('file-service/payOrder', {params: {orderId: order.id}}).then(res => {
                    commit('payOrder', res.data)
                }).catch(err => reject(err))
            )
        },
        listOrder({c}, pageInfo) {
            return new Promise((resolve, reject) => {
                axios('file-service/listOrderByPage', {
                    params: pageInfo
                }).then(res => resolve(res.data)).catch(err => reject(err.data))
            })
        },
        listCoupon() {
            return new Promise((resolve, reject) => {
                axios('file-service/coupon/list').then(res => resolve(res.data)).catch(err => reject(err.data))
            })
        },
        getOrderCount() {
            return new Promise((resolve, reject) => {
                axios('file-service/getOrderCount',).then(res => resolve(res.data)).catch(err => reject(err))
            })
        },
        insetAddr({commit}, addr) {
            return new Promise((resolve, reject) => {
                axios.post('https://auth.xiaoxinyy.com/account-service/addr/inset',qs.stringify( addr)).then(res => resolve(res.data)).catch(err => reject(err.data))
            })

        },
        listAddr() {
            return new Promise((resolve, reject) => {
                axios('https://auth.xiaoxinyy.com/account-service/addr/list').then(res => resolve(res.data)
                ).catch(err => reject(err.data))
            })

        },
        getUserSocialInfo() {
            return new Promise((resolve, reject) => {
                axios('https://auth.xiaoxinyy.com/account-service/user/getSocialInfo').then(res => resolve(res.data)).catch(err => reject(err.response.data))
            })

        },

        loginByWechat: ({commit}, code) => {
            return new Promise((resolve, reject) => {
                axios('https://auth.xiaoxinyy.com/account-service/user/login/wechat', {params: {code: code}}).then(res => {
                    commit('saveAuthorization', res.data.result)
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        computedPage({commit}, fileId) {
            return new Promise((resolve, reject) => {
                axios('file-service/file/getPageCount', {params: {fileId: fileId}}).then(res => {
                    resolve(res.data)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        getSchoolAddrData({commit}, schoolId) {
            return new Promise((resolve, reject) => {
                axios('https://register-1258643517.cos.ap-chengdu.myqcloud.com/s' + schoolId + '/addr.json').then(res => {
                    resolve(res.data)
                }).catch(err => reject(err.data))
            })
        },
        getOrderAddr({commit}, addrId) {
            return new Promise((resolve, reject) => {
                axios('https://auth.xiaoxinyy.com/account-service/addr/get', {params: {id: addrId}}).then(res => resolve(res.data)).catch(err => reject(err))
            })
        },
        //即使获得订单状态
        getPayStatus({commit}, orderId) {
            return new Promise((resolve, reject) => axios('file-service/getPayStatus', {params: {orderId: orderId}}).then(res =>
                    resolve(res.data)
                ).catch(err => reject(err))
            )
        },
        alipay({commit}, orderId) {
            return new Promise((resolve, reject) => axios('file-service/alipay', {params: {orderId: orderId}}).then(res =>
                    resolve(res.data)
                ).catch(err => reject(err))
            )
        },


    }
})
