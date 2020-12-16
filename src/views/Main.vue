<template>
  <div class="main">
    <!-- 二级路由 -->
    <router-view :class="{ pb: !isShow && songSrc }"></router-view>
    <transition
      name="custom-classes-transition"
      enter-active-class="animate__animated animate__slideInUp"
      leave-active-class="animate__animated animate__slideOutDown"
    >
      <mini-player v-if="!isShow && songSrc"></mini-player>
    </transition>
  </div>
</template>

<script>
import MiniPlayer from "../components/MiniPlayer";
export default {
  name: "Main",
  data() {
    return {
      transitionName: "",
    };
  },
  components: { MiniPlayer },
  computed: {
    //播放歌曲页面显示和隐藏的值
    isShow() {
      return this.$store.state.isShow;
    },
    songSrc() {
      return this.$store.state.songSrc;
    },
  },
};
</script>

<style lang="less" scoped>
.pb {
  padding-bottom: 50px;
}
</style>