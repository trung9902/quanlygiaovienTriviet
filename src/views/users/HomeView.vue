<template>
  <div class="home">
    <userHome />
    <test />
  </div>
</template>

<script>
import userHome from "./userHome.vue";
// @ is an alias to /src
// import test from "./test.vue";
// import assignmentTeacher from "../assignmentTeacher.vue";

export default {
  name: "HomeView",
  components: {
    // assignmentTeacher,
    // test,
    userHome,
  },
};
</script>
<style lang="scss" scoped>
.home {
  height: 100%;
}
</style>
