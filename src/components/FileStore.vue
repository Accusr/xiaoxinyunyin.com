<template>
    <div class="fileStore">
        <div class="toolbar">
            <Input type="text" :autofocus="true" style="width: 500px; margin: 0 auto" search enter-button placeholder="Enter something..." />
        </div>
    <Table :data="fileData" :columns="columns">

    </Table>

    </div>
</template>

<script>
    export default {
        name: "FileStore",
        data() {
            return {
                fileData: [
                    {
                        title:"文件1"
                    }
                ],
                columns: [
                    {
                        title: "文件名称",
                        key: 'title',
                    },
                    {
                        title: "文件大小",
                        key: 'title',
                    },
                    {
                        title: "文件名称",
                        key: 'title',
                    },
                ]
            }
        },
    }
</script>

<style scoped>
    .fileStore {
        margin: 0 auto;
        width: 1000px;
    }

    .toolbar{
        padding-top: 100px;
        height: 300px;
        margin: 0 auto;
    }
</style>