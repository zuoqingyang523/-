<template>
  <div class="hello">
    <div class="head">
      <mt-button type="default">default</mt-button>
      <mt-button type="primary">primary</mt-button>
      <mt-button size="large">large</mt-button>
      <mt-button type="danger" class="btn">danger</mt-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  components: {},
  data() {
    return {};
  },
  computed: {},
  mounted() {},
  methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.hello {
  width: 750px;
  height: 200px;
  background: pink;
  .btn{
    width: 150px;
    height: 75px;
  }
}
</style>
