<template>
  <div id="app" @mouseover="OperatingWebsite()">
    <router-view/>
  </div>
</template>
<script>
export default {
  data() {
    return {
      currentTime: new Date().getTime()
    };
  },
  mounted() {
  },
  methods: {
    linkWeb() {
      // const truthPathQuery = this.$route.query.type;
      // const truthPath = this.$Base64.decode(truthPathQuery); //点击登录的时候跳转这个地址
    },
    OperatingWebsite() {
      // let currentTime = this.currentTime;
      // let lastTime = new Date().getTime();
      // let timeOut = 10 * 60 * 1000; //设置时间 10分钟
      // if (lastTime - currentTime > timeOut) {
      //   // 未操作页面，跳转登录页面
      //   this.currentTime = new Date().getTime();
      //   const fullPath = this.$route.fullPath;
      //   const query = this.$Base64.encode(fullPath);
      //   this.$router.push({
      //     path: "/user",
      //     query: {
      //       type: query
      //     }
      //   });
      // } else {
      //   this.currentTime = new Date().getTime();
      // }
    }
  }
};
</script>
<style scope>
#app{
  width:100%;
  height: 100%;
}
</style>
