<template>
    <div>
        <router-view></router-view>
    </div>
</template>
<script>
    export default {
        data() {
            return {

            };
        },
        mounted() {
            this.$http.get('/api/data').then(function (res) {
                debugger;
            });
        },
        beforeDestroy() {

        },
        methods: {

        }
    };
</script>