<template>
  <div class="main">
    <!-- 二级路由 -->
    <keep-alive>
      <router-view
        :class="{ pb: !isShow && songSrc }"
        v-if="$route.meta.keepAlive"
      ></router-view>
    </keep-alive>
    <router-view
      :class="{ pb: !isShow && songSrc }"
      v-if="!$route.meta.keepAlive"
    ></router-view>
    <transition
      name="custom-classes-transition"
      enter-active-class="animate__animated animate__slideInUp"
      leave-active-class="animate__animated animate__slideOutDown"
    >
      <mini-player v-if="!isShow && songSrc"></mini-player>
    </transition>
    <transition
      name="custom-classes-transition"
      enter-active-class="animate__animated animate__slideInUp"
      leave-active-class="animate__animated animate__slideOutDown"
    >
      <play-songs v-if="isShow"></play-songs>
    </transition>
  </div>
</template>

<script>
import MiniPlayer from "../components/MiniPlayer";
import PlaySongs from "../components/PlaySongs";
export default {
  name: "Main",
  data() {
    return {
      transitionName: "",
    };
  },
  components: { MiniPlayer, PlaySongs },
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
.main {
  .pb {
    padding-bottom: 50px;
  }
  height: 100vh;
}
</style>