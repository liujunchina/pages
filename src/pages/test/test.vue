<template>
    <h1>测试ws连接</h1>
</template>

<script>
    const wsUrl = `wss://hh.buhuida.com/wss`;
    import ws from 'commonjs/socketQ.js'

    export default{
        data(){
            return {

            }
        },
        created(){
            this.dissoveData = null;
            ws.ip = 'ws://127.0.0.1:3000'
            var self = this;

            var onConnectOK = function(){
                console.log("onConnectOK");
                var sd = {
                    token:11111,
                };
                ws.send({
                    cmd: "login",
                    data: {
                        sd
                    }
                });
            };

            var onConnectFailed = function(){
                console.log("failed.");
            };

            console.log("正在进入房间");
            ws.connect(onConnectOK,onConnectFailed);
        }
    }
</script>

<style lang="scss" scoped>

</style>
