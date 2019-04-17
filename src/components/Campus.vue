<template>
    <div class="campus">
        <div style="background-color: #e2e2e2">
        <div class="board">
            <div v-for="item in 12" :key="item.id" class="paper-001" :style="RandomColor(item)">
                <div class="msg">
                <span>{{paper[0].msg}}</span>
                </div>
                <div class="paper-info">
                    <Icon type="ios-person" size="18" style="margin: 0 0 3px 5%"/>{{paper[0].author}}
                    <div style="margin-left: 5%">
                        {{paper[0].createTime}}
                        <span><Icon type="ios-easel" style="margin: 0 3px 2px 20px"/>{{paper[0].comment}}</span>
                        <span><Icon type="md-flower" style="margin: 0 2px 2px 20px"/>{{paper[0].flower}}</span>
                    </div>
                </div>
            </div>

        </div>
            <div>{{test}}</div>
            <Input v-model="test" style="width: 100px;"/>
        </div>


    </div>
</template>

<script>
    export default {
        name: "Campus",
        data() {
            return {
                paper:[{
                    msg:'如果服务器认为这个请求可以接受，就在 Access-Control-Allow-Origin 头部中回发相同的源信息这是一条消息!这是一条消息!这是一条消息!这是一条消息!这是一条消息!',
                    author:'八级大狂风',
                    createTime:'2019-04-07',
                    flower:'337',
                    comment:'999+',
                }],
                test:'',
            }
        },
        // methods:{
        //     notice( ){
        //         this.$Notice.error({
        //             title:'不支持该类型的文件！',
        //             desc: '仅支持jpg,doc,docx,excel,ppt文件',
        //             duration: 0,
        //             top:48
        //         });
        //     }
        // },
        methods: {
            RandomColor() {
                let r, g, b,c;
                r = Math.floor(Math.random() * 210);
                g = Math.floor(Math.random() * 210);
                b = Math.floor((Math.random()+0.3) * 156);
                c = 0.9;
                return {
                    background: 'rgb(' + r + ',' + g + ',' + b + ','+c+')'
                };
            }
        },

    }
</script>

<style scoped>
    .campus {
        margin: 0 auto;
    }
    .board{
        height: 800px;
        width: 1200px;
        margin: 0 auto;
    }
    .paper-001{
        color: whitesmoke;
        width: 230px;
        height: 150px;
        /*background-color: #e9e6d1;*/
        box-shadow: 2px 2px 2px gray;
        margin: 30px;
        float: left;
    }
    .msg{
        /*width: 200px;*/
        height: 110px;
        padding: 10px;
        cursor: pointer;
    }
    .paper-info{
        height: 30%;
    }
    .paper-info span:hover{
        color: hotpink;
        cursor: pointer;
    }
</style>