<template>
    <Menu mode="horizontal" theme="light" active-name="1">
        <MenuItem name="1" to="/" class="mitem">
            <img src="../../assets/logo.png" alt="" width="32px" style="vertical-align:middle">
            小新云印
        </MenuItem>
        <MenuItem name="2" to="https://campus.xiaoxinyunyin.com" target="_blank">
            <Icon type="md-school"/>
            校园动态 测试中
        </MenuItem>

        <MenuItem name="3" to="https://library.xiaoxinyunyin.com" target="_blank">
            <Icon type="ios-paper" />
            文库
        </MenuItem>
        <MenuItem name="4" to="http://jwmis.hhtc.edu.cn" target="_blank">
            <Icon type="md-ionic" />
            怀院教务网
        </MenuItem>


        <Row type="flex" justify="end">
            <Col span="7">
                <MenuItem name="5" class="user">
                    <Tooltip placement="bottom-end" :delay="100" theme="light">
                        <div slot="content" v-if="userInfo.id !== '0'">
                            你好！{{userInfo.nickname}}
                            <Button size="small" @click="goLogout">退出</Button>
                        </div>
                        <div v-else slot="content">你好！你还未登录</div>
                        <div @click="goProfile()">
                            <Badge dot :offset=[18,8]>
                                <Icon v-if="userInfo.id ==='0'" type="ios-contact-outline" size="40"/>
                                <Avatar v-else :src="userInfo.avatar" size="large"/>
                            </Badge>

                        </div>
                    </Tooltip>
                </MenuItem>
            </Col>
        </Row>
    </Menu>

</template>

<script>
    import {mapMutations, mapState, mapActions} from 'vuex';

    export default {
        name: "NavBar",
        data() {
            return ({})
        },
        computed: {
            ...mapState(['userInfo'])
        },
        methods: {
            ...mapMutations(['changeLogDrawerState', 'logout']),
            ...mapActions(['getUser', 'loginByWechat']),
            goProfile() {
                // console.log(this.userInfo.id)
                if (this.userInfo.id === '0') {
                    this.changeLogDrawerState();
                } else {
                    this.$router.push({name: 'userInfo'});
                }

            },
            goLogout() {
                this.logout();
                this.$router.push({name: 'home'});
            },


        },
        mounted() {

            if (this.$route.query.code !== undefined && this.$route.query.state === '8888') {
                this.loginByWechat(this.$route.query.code).then(res => {
                    this.$router.push({name: 'home'});
                    this.getUser();
                }).catch(err => {
                    alert("网络开小差了！" + err);
                    this.$router.push({name: 'home'});
                })
                //正常登陆
            } else this.getUser();

        }
    }
</script>

<style scoped>
    .user {
        margin-left: auto;
    }

    .mitem {
        margin-left: 100px;
    }
</style>
