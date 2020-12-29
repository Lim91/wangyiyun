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
    <transition name="slide-fade">
      <mini-player v-if="!isShow && songSrc"></mini-player>
    </transition>
    <transition name="slide-fade">
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

  /* 可以设置不同的进入和离开动画 */
  /* 设置持续时间和动画函数 */
  .slide-fade-enter-active {
    transition: all 0.3s ease;
  }
  .slide-fade-leave-active {
    transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
  }
  .slide-fade-enter,
  .slide-fade-leave-to {
    transform: translateY(100%);
    opacity: 0;
  }
}
</style>