<template>
    <Menu mode="horizontal" theme="light" active-name="1">
        <MenuItem name="1" to="/" class="home">
            <Icon type="md-cloud-outline" />
            首页
        </MenuItem>
        <MenuItem name="2" to="/Campus">
            <Icon type="md-school"/>
            校园动态
        </MenuItem>
        <Submenu name="3">
            <template slot="title">
                <Icon type="ios-stats"/>
                公共文库
            </template>
                <MenuItem name="3-1" to="/FileStore">实用文档</MenuItem>
                <MenuItem name="3-2">最新上传</MenuItem>
                <MenuItem name="3-3">综合类目</MenuItem>
        </Submenu>


        <Row type="flex" justify="end">
            <Col span="7">
                <MenuItem name="5" class="user" >
                <Tooltip   placement="bottom-end"  :delay="100" theme="light">
                    <div slot="content" v-if="userInfo.id !== '0'">
                        你好！{{userInfo.nickname}}
                        <Button size="small" @click="goLogout">退出</Button>
                    </div>
                    <div v-else slot="content" >你好！你还未登录</div>
                <div @click="goUserInfo()">
                <Badge dot :offset=[18,8]>
                    <Icon v-if="userInfo.id ==='0'" type="ios-contact-outline" size="40" />
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
    import {mapMutations, mapState,mapActions} from 'vuex';

    export default {
        name: "NavBar",
        computed: {
            ...mapState(['userInfo'])
        },
        methods: {
            ...mapMutations(['changeLogDrawerState']),
            ...mapActions(['updateUser','logout']),
            goUserInfo(){
                // console.log(this.userInfo.id)
                if(this.userInfo.id === '0'){
                    this.changeLogDrawerState();
                }else{
                    this.$router.push({name:'userInfo'});
                }

            },
            goLogout(){
                this.logout();
                this.$router.push({name:'home'});
            },


        },
        mounted(){
            this.updateUser();
        }
    }
</script>

<style scoped>
    .user{
       margin-left: auto;
    }
    .home{
        margin-left: 100px;
    }
</style>