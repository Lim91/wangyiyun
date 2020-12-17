<template>
  <div class="mini-player">
    <div class="icon" @click="openPlaySongs">
      <img :src="songData.picUrl" alt="" ref="wrapper" />
    </div>
    <div class="text" @click="openPlaySongs">
      <p class="name one-text">{{ songData.name }}</p>
      <p class="artist one-text">{{ songData.artists }}</p>
    </div>
    <div class="play" @click="changeSongStatus">
      <van-icon
        :name="audioStatus == 1 ? 'pause-circle-o' : 'play-circle-o'"
        size="30"
        class="icon"
      />
      <canvas ref="circle" width="34" height="34"></canvas>
    </div>
    <div class="control">
      <van-icon name="wap-nav" size="30" @click="showPopup" />
      <van-popup
        round
        v-model="show"
        position="bottom"
        :style="{ height: '50%' }"
      >
        <div class="list-header">
          <h3 class="title">
            <div class="circulation" @click="setPlayMode">
              <img
                :src="controlsSrc.circleImg"
                alt=""
                v-show="playMode == 'circle'"
              />
              <img
                :src="controlsSrc.loopImg"
                alt=""
                v-show="playMode == 'loop'"
              />
              <img
                :src="controlsSrc.randomImg"
                alt=""
                v-show="playMode == 'random'"
              />
            </div>
            <div class="text">
              <span v-show="playMode == 'circle'">列表循环</span>
              <span v-show="playMode == 'loop'">单曲循环</span>
              <span v-show="playMode == 'random'">随机播放</span>
              <span class="count">({{ songsListData.length }})</span>
            </div>
            <div class="icon" @click="deleteAll">
              <van-icon name="delete" color="#757575" size="22" />
            </div>
          </h3>
        </div>
        <div class="list-content">
          <ul>
            <li v-for="(item, index) in songsListData" :key="index">
              <span class="music" v-if="index == songIndex"
                ><van-icon name="volume-o" color="#d44439" size="16"
              /></span>
              <span class="name one-text" @click="changeSong(item, index)">{{
                item.name
              }}</span>
              <span class="delete-one" @click="deleteOne(item, index)">×</span>
            </li>
          </ul>
        </div>
        <div class="close" @click="show = false">关闭</div>
      </van-popup>
    </div>
    <audio
      :src="songSrc"
      ref="audio"
      autoplay="autoplay"
      :loop="isLoop"
      @timeupdate="listenAudioChange"
    ></audio>
  </div>
</template>

<script>
export default {
  name: "MiniPlayer",

  data() {
    return {
      show: false,

      controlsSrc: {
        circleImg: require("../assets/images/circle-small.png"),
        loopImg: require("../assets/images/loop-small.png"),
        randomImg: require("../assets/images/random-small.png"),
      },

      //进度条
      canvas: null,
    };
  },

  created() {
    //获取audio元素
    this.$nextTick(() => {
      // console.log("this.$refs =>", this.$refs);
      this.changeAudio(this.$refs.audio);
      if (this.audioCurrentTime) {
        this.$refs.audio.currentTime = this.audioCurrentTime;
      }
      if (this.audioStatus == 0) {
        this.$refs.audio.pause();
      }
      this.canvas = this.$refs.circle;
    });
  },

  computed: {
    songSrc() {
      return this.$store.state.songSrc;
    },
    songData() {
      return this.$store.state.songData;
    },
    audioELement() {
      return this.$store.state.audioElement;
    },
    //歌曲状态
    audioStatus() {
      return this.$store.state.audioStatus;
    },
    //歌曲当前时间
    audioCurrentTime() {
      return this.$store.state.time.currentTime;
    },
    //歌曲index
    songIndex() {
      return this.$store.state.songIndex;
    },
    //歌单name和id列表
    songsListData() {
      return this.$store.state.songsListData;
    },
    //播放模式(circle：列表循环、loop：单曲循环、random：随机播放)
    playMode() {
      return this.$store.state.playMode;
    },

    //是否单曲循环
    isLoop() {
      if (this.$store.state.playMode == "loop") {
        return true;
      } else {
        return false;
      }
    },
  },

  methods: {
    showPopup() {
      this.show = true;
    },

    //修改歌曲播放页面显示和隐藏的值
    openPlaySongs() {
      this.$store.commit("changeIsShowTrue");
    },

    //改变歌曲播放暂停状态
    changeSongStatus() {
      console.log("播放、暂停");
      if (this.audioStatus == 0) {
        this.audioELement.play();
        this.$store.commit("changeSongStatus", 1);
        //获取wrapper元素
        this.$nextTick(() => {
          // console.log("this.$refs.wrapper", this.$refs.wrapper);
          this.$refs.wrapper.classList.remove("active");
        });
      } else {
        this.audioELement.pause();
        this.$store.commit("changeSongStatus", 0);
        //获取wrapper元素
        this.$nextTick(() => {
          this.$refs.wrapper.classList.add("active");
        });
      }
    },

    //canvas进度条
    drawCircle(current, total) {
      let canvas = this.canvas;
      let ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, 32, 32);
      ctx.beginPath();
      ctx.strokeStyle = "red";
      ctx.arc(
        17,
        17,
        15,
        Math.PI * -0.5,
        Math.PI * ((current / total) * 2 - 0.5)
      );
      ctx.stroke();
      ctx.closePath();
    },

    //监听音频变化
    listenAudioChange() {
      //获取音频当前播放事件
      let currentTime = this.audioELement.currentTime;
      let totalTime = this.audioELement.duration;
      //
      this.drawCircle(currentTime, totalTime);

      this.currentTime = currentTime;
      this.totalTime = totalTime;
      this.value = parseInt((currentTime / totalTime) * 100);

      //保存当前时间、总时长、进度条value值
      let time = {};
      time.currentTime = currentTime;
      time.totalTime = totalTime;
      time.value = this.value;
      this.changeCurrentTime(time);

      if (currentTime == totalTime) {
        if (this.playMode == "circle") {
          this.circle();
        } else if (this.playMode == "random") {
          this.random();
        }
      }
    },

    //播放模式
    setPlayMode() {
      if (this.playMode == "circle") {
        this.$store.commit("changePlayMode", "loop");
      } else if (this.playMode == "loop") {
        this.$store.commit("changePlayMode", "random");
      } else if (this.playMode == "random") {
        this.$store.commit("changePlayMode", "circle");
      }
    },

    //列表循环播放
    circle() {
      if (this.songIndex < this.songsListData.length - 1) {
        // console.log("this.songIndex", this.songIndex);
        let index = this.songIndex + 1;
        let id = this.songsListData[index].id;
        //修改歌曲data
        this.changeSongsData(id);
        //修改歌曲index
        this.$store.commit("changeSongIndex", index);
      } else {
        let id = this.songsListData[0].id;
        //修改歌曲data
        this.changeSongsData(id);
        //修改歌曲index
        this.$store.commit("changeSongIndex", 0);
      }
    },
    //随机播放
    random() {
      let length = this.songsListData.length;
      let index = Math.floor(Math.random() * length);
      console.log("random index=>", index);
      let id = this.songsListData[index].id;
      //修改歌曲data
      this.changeSongsData(id);
      //修改歌曲index
      this.$store.commit("changeSongIndex", index);
    },

    //删除所有歌曲
    deleteAll() {
      this.$dialog
        .confirm({
          title: "是否清空列表",
        })
        .then(() => {
          // on close
          this.$store.commit("changeSongsListData", "");
          this.$store.commit("changeSongIndex", 0);
          this.show = false;
          setTimeout(() => {
            this.$store.commit("changeSongSrc", "");
            this.$store.commit("changeIsShowFalse");
          }, 300);
        })
        .catch(() => {
          return;
        });
    },

    deleteOne(item, index) {
      let data = this.songsListData;
      data.splice(index, 1);
      if (data.length == 0) {
        this.$store.commit("changeIsShowFalse");
        this.$store.commit("changeSongSrc", null);
        this.$store.commit("changeSongsListData", []);
        return;
      }
      if (this.songIndex >= index) {
        this.$store.commit("changeSongIndex", index);
        this.$store.commit("changeSongId", this.songsListData[index].id);
        this.changeSongsData(this.songsListData[index].id);
      }
      this.$store.commit("changeSongsListData", data);
      console.log("this.songsListData =>", this.songsListData);
    },

    //切换歌曲
    changeSong(item, index) {
      this.$store.commit("changeSongIndex", index);
      this.$store.commit("changeSongId", item.id);
      this.changeSongsData(item.id);
    },

    //修改audio元素，保存到公共数据state
    changeAudio(audio) {
      this.$store.commit("changeAudio", audio);
      // console.log("this.audioELement =>", this.audioELement);
    },

    //获取歌曲当前播放时间并保存到state
    changeCurrentTime(time) {
      this.$store.commit("changeCurrentTime", time);
    },

    //修改歌曲信息
    changeSongsData(id) {
      console.log("切换歌曲");
      //修改歌曲id
      // this.$store.commit("changeSongId", id);
      //根据歌曲id获取歌曲src并传值
      this.axios({
        method: "GET",
        url: "/song/url",
        params: {
          id,
        },
      })
        .then((result) => {
          if (result.data.code == 200) {
            // console.log("music result.data.data =>", result.data.data);
            let songSrc = result.data.data[0].url;
            this.$store.commit("changeSongSrc", songSrc);
          }
        })
        .catch((err) => {
          console.log("err =>", err);
        });

      //根据歌曲id获取歌曲data并传值
      this.axios({
        method: "GET",
        url: "/song/detail",
        params: {
          ids: id,
        },
      })
        .then((result) => {
          if (result.data.code == 200) {
            console.log("music result.data.songs =>", result.data.songs[0]);
            let data = result.data.songs[0];
            //上传修改歌曲信息
            let songData = {};
            //歌名、图片链接、歌手
            songData.name = data.al.name;
            songData.picUrl = data.al.picUrl;
            var artists = [];
            for (let i = 0; i < data.ar.length; i++) {
              artists.push(data.ar[i].name);
            }
            songData.artists = artists.join("/");
            songData.id = JSON.stringify(id);
            this.$store.commit("changeSongData", songData);
          }
        })
        .catch((err) => {
          console.log("err2 =>", err);
        });
    },
  },
};
</script>

<style lang="less" scoped>
.mini-player {
  z-index: 10;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 60px;
  background-color: rgba(255, 255, 255, 0.9);
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  display: flex;
  .icon {
    width: 40px;
    height: 40px;
    margin: 10px 10px auto 20px;
    border-radius: 50%;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      animation: rotate 20s linear infinite;
    }
    //暂停播放
    .active {
      animation-play-state: paused;
    }
  }
  .text {
    width: 205px;
    display: flex;
    justify-content: center;
    flex-direction: column;

    p {
      margin: 0;
      padding-left: 6px;
      color: #2e3030;
      text-align: left;
      width: 205px;
      box-sizing: border-box;
    }
    .name {
      margin-bottom: 2px;
      font-size: 14px;
    }
  }
  .play {
    margin: 15px 10px 0 0;
    width: 34px;
    height: 34px;
    position: relative;
    .icon {
      position: absolute;
      top: 0;
      left: 0;
      margin: 2px 0 0 2px;
      height: 30px;
      width: 30px;
    }
  }
  .control {
    color: #2e3030;
    margin-top: 15px;
    .van-popup {
      background-color: #f2f3f4;
      .list-header {
        padding: 14px 26px 10px 20px;
        .title {
          margin: 0;
          display: flex;
          align-items: center;
          .circulation {
            margin-right: 10px;
            img {
              margin-top: 4px;
            }
          }
          .text {
            flex-direction: row;
            justify-content: flex-start;
            span {
              width: fit-content;
              float: left;
            }
            .count {
              margin-top: 1px;
            }
          }
          .icon {
            margin: 0;
            width: 22px;
            height: 22px;
            margin-left: auto;
          }
        }
      }
      .list-content {
        height: 240px;
        width: 100%;
        ul {
          padding: 0 30px 0 20px;
          height: 240px;
          overflow: auto;
          li {
            height: 40px;
            font-size: 14px;
            display: flex;
            align-items: center;
            .music {
              margin-top: 6px;
              margin-right: 5px;
            }
            .name {
              text-align: left;
              width: 290px;
              line-height: 40px;
              font-size: 15px;
            }
            .delete-one {
              color: #d44439;
              font-size: 26px;
              margin-left: auto;
              font-weight: 100;
            }
          }
        }
      }

      .close {
        height: 37px;
        line-height: 37px;
        text-align: center;
        font-size: 16px;
        font-weight: 500;
      }
    }
  }
}
</style>