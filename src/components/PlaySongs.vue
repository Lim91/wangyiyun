<template>
  <div class="play-songs" ref="playSongs">
    <div class="background-box">
      <div class="background">
        <div class="filter"></div>
        <img :src="songData.picUrl" alt="" />
      </div>
    </div>
    <header class="clearfix">
      <div class="close fl" @click="closePlaySongs">
        <van-icon
          name="arrow-down"
          color="#f1f1f1"
          size="30"
          @click="closePlaySongs"
        />
      </div>
      <div class="song-text">
        <h2 class="song-name one-text">{{ songData.name }}</h2>
        <h6 class="singer">{{ songData.artists }}</h6>
      </div>
    </header>

    <main>
      <div class="cd-box">
        <div
          class="cd-wrapper"
          @click="showLyric = true"
          :class="{ hide: showLyric == true }"
        >
          <!-- 旋转 -->
          <div class="cd-play" ref="wrapper">
            <img :src="songData.picUrl" alt="" />
          </div>
        </div>
        <div
          class="lyric"
          @click="showLyric = false"
          :class="{ hide: showLyric == false }"
        >
          <ul
            v-if="lyricData.length > 0"
            :style="{ marginTop: marginTopValue + 'px' }"
          >
            <li
              v-for="(item, index) in lyricData"
              :key="index"
              :class="{ active: index == lyricIndex }"
              class="one-text"
            >
              {{ item.text }}
            </li>
          </ul>
          <ul v-else>
            <li>暂无歌词</li>
          </ul>
        </div>
      </div>
      <!-- 音乐 -->
      <div class="music">
        <audio
          :src="songSrc"
          ref="audio"
          @timeupdate="listenAudioChange"
          autoplay="autoplay"
          :loop="isLoop"
        ></audio>
      </div>
    </main>

    <footer>
      <div class="slider-box">
        <div class="slider-box-center clearfix">
          <div class="left-time fl">
            {{ currentTime | changSeconds }}
          </div>
          <div class="slider fl">
            <van-slider
              v-model="value"
              active-color="red"
              button-size="16px"
              @change="changeAudioTime"
            />
          </div>
          <div class="right-time fl">{{ totalTime | changSeconds }}</div>
        </div>
      </div>
      <div class="operators">
        <div class="circulation" @click="setPlayMode">
          <img
            :src="controlsSrc[0].circleImg"
            alt=""
            v-show="playMode == 'circle'"
          />
          <img
            :src="controlsSrc[0].loopImg"
            alt=""
            v-show="playMode == 'loop'"
          />
          <img
            :src="controlsSrc[0].randomImg"
            alt=""
            v-show="playMode == 'random'"
          />
        </div>
        <div class="last-song" @click="lastSong">
          <img :src="controlsSrc[1].inactiveImg" alt="" />
        </div>
        <div class="play" @click="changeSongStatus">
          <img
            :src="
              audioStatus == 1
                ? controlsSrc[2].activeImg
                : controlsSrc[2].inactiveImg
            "
            alt=""
          />
        </div>
        <div class="next-song" @click="nextSong">
          <img :src="controlsSrc[3].inactiveImg" alt="" />
        </div>
        <div class="collection" @click="toggleCollection">
          <img
            :src="
              isCollection == true
                ? controlsSrc[4].activeImg
                : controlsSrc[4].inactiveImg
            "
            alt=""
          />
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "PlaySongs",
  props: {},
  data() {
    return {
      value: 0,
      currentTime: "",
      totalTime: "",

      //控制组件图标
      controlsSrc: [
        {
          circleImg: require("../assets/images/circle.png"),
          loopImg: require("../assets/images/loop.png"),
          randomImg: require("../assets/images/random.png"),
        },
        {
          inactiveImg: require("../assets/images/last-song.png"),
        },
        {
          inactiveImg: require("../assets/images/play.png"),
          activeImg: require("../assets/images/pause.png"),
        },
        {
          inactiveImg: require("../assets/images/next-song.png"),
        },
        {
          inactiveImg: require("../assets/images/collection.png"),
          activeImg: require("../assets/images/collection-active.png"),
        },
      ],

      //是否收藏
      isCollection: false,

      // 显示歌词
      showLyric: false,

      //歌词
      lyricData: [],

      //歌词位置
      marginTopValue: "",

      //歌词索引值
      lyricIndex: "",
    };
  },

  created() {
    //获取audio元素
    this.$nextTick(() => {
      if (this.audioCurrentTime) {
        this.$refs.audio.currentTime = this.audioCurrentTime;
      }
      // 判断歌曲状态，设置歌曲播放或暂停
      if (this.audioStatus == 0) {
        this.$refs.audio.pause();
      }
    });
    //查询歌曲是否被收藏
    this.showIsCollection();

    this.getLyric(this.songsListData[this.songIndex].id);
  },

  computed: {
    songSrc() {
      return this.$store.state.songSrc;
    },
    songData() {
      return this.$store.state.songData;
    },
    //歌曲index
    songIndex() {
      return this.$store.state.songIndex;
    },
    //歌单name和id列表
    songsListData() {
      return this.$store.state.songsListData;
    },

    //歌曲状态
    audioStatus() {
      return this.$store.state.audioStatus;
    },
    //歌曲当前时间
    audioCurrentTime() {
      return this.$store.state.time.currentTime;
    },
    //播放模式(circle：列表循环、loop：单曲循环、random：随机播放)
    playMode() {
      return this.$store.state.playMode;
    },
    isLoop() {
      if (this.$store.state.playMode == "loop") {
        return true;
      } else {
        return false;
      }
    },
    //收藏
    collection() {
      if (localStorage.getItem("collection")) {
        let collection = localStorage.getItem("collection");
        return JSON.parse(collection);
      } else {
        return [];
      }
    },
  },

  methods: {
    //修改歌曲播放页面显示和隐藏的值
    closePlaySongs() {
      this.$store.commit("changeIsShowFalse");
    },

    //获取歌词
    getLyric(id) {
      var patt = /\[\d{2}:\d{2}\.\d{2,3}\]/gi;
      this.axios({
        method: "GET",
        url: "/lyric",
        params: {
          id,
        },
      })
        .then((result) => {
          if (result.data.code == 200) {
            if (result.data.lrc.lyric) {
              let lyric = result.data.lrc.lyric;
              var arr = lyric
                .split("\n")
                .filter((e) => e)
                .map((str) => {
                  var time = str.match(patt)[0].replace(/(\[|\])/gi, "");
                  var timeArr = time.split(":");
                  time = Number(timeArr[0]) * 60 + Number(timeArr[1]);
                  var text = str.replace(patt, "");
                  return { time, text };
                });
              this.lyricData = arr;
            }
            //
          }
        })
        .catch((err) => {
          console.log("err =>", err);
        });
    },

    //监听音频变化
    listenAudioChange() {
      if (this.$refs.audio) {
        //获取音频当前播放事件
        var currentTime = this.$refs.audio.currentTime;
        var totalTime = this.$refs.audio.duration;
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

        //歌词数据时间里比当前时间大一点的歌词的索引值
        var index = this.lyricData.findIndex((item) => {
          return item.time > currentTime;
        });
        this.lyricIndex = index - 1;
        this.marginTopValue = -30 * (index - 1) + 150;
      }
    },

    //获取歌曲当前播放时间并保存到state
    changeCurrentTime(time) {
      this.$store.commit("changeCurrentTime", time);
    },

    //改变音频进度
    changeAudioTime(value) {
      this.$refs.audio.currentTime = parseInt(
        (value / 100) * this.$refs.audio.duration
      );
    },

    //修改歌曲信息
    changeSongsData(id) {
      //
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
            //
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
            let data = result.data.songs[0];
            //上传修改歌曲信息
            let songData = {};
            //歌名、图片链接、歌手、id
            songData.name = data.name;
            songData.picUrl = data.al.picUrl;
            var artists = [];
            for (let i = 0; i < data.ar.length; i++) {
              artists.push(data.ar[i].name);
            }
            songData.artists = artists.join("/");
            songData.id = JSON.stringify(id);
            this.$store.commit("changeSongData", songData);
            //歌曲是否收藏
            this.showIsCollection();
          }
        })
        .catch((err) => {
          console.log("err2 =>", err);
        });
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
        //
        let index = this.songIndex + 1;
        let id = this.songsListData[index].id;
        //修改歌曲data
        this.changeSongsData(id);
        //修改歌词
        this.getLyric(id);
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

      let id = this.songsListData[index].id;
      //修改歌曲data
      this.changeSongsData(id);
      //修改歌词
      this.getLyric(id);
      //修改歌曲index
      this.$store.commit("changeSongIndex", index);
    },

    //播放上一首
    lastSong() {
      if (this.playMode == "random") {
        this.random();
      } else {
        if (this.songIndex > 0) {
          //
          let index = this.songIndex - 1;
          let id = this.songsListData[index].id;
          //修改歌曲data
          this.changeSongsData(id);
          //修改歌词
          this.getLyric(id);
          //修改歌曲index
          this.$store.commit("changeSongIndex", index);
        } else {
          return;
        }
      }
    },

    //播放下一首
    nextSong() {
      if (this.playMode == "random") {
        this.random();
      } else {
        if (this.songIndex < this.songsListData.length - 1) {
          //
          let index = this.songIndex + 1;
          let id = this.songsListData[index].id;
          //修改歌曲data
          this.changeSongsData(id);
          //修改歌词
          this.getLyric(id);
          //修改歌曲index
          this.$store.commit("changeSongIndex", index);
        } else {
          let index = 0;
          let id = this.songsListData[0].id;
          //修改歌曲data
          this.changeSongsData(id);
          //修改歌词
          this.getLyric(id);
          //修改歌曲index
          this.$store.commit("changeSongIndex", index);
        }
      }
    },

    //收藏
    toggleCollection() {
      this.isCollection = !this.isCollection;
      let songData = {};
      songData.name = this.songData.name;
      songData.artists = this.songData.artists;
      songData.id = JSON.stringify(this.songsListData[this.songIndex].id);
      songData.picUrl = this.songData.picUrl;
      if (this.isCollection) {
        let collection = this.collection;
        collection.push(songData);
        //
        localStorage.setItem("collection", JSON.stringify(collection));
      } else {
        let collection = this.collection;
        collection.forEach((item, index, self) => {
          if (item.id == songData.id) {
            self.splice(index, 1);
          }
        });
        localStorage.setItem("collection", JSON.stringify(collection));
      }
    },

    //查询歌曲是否被收藏
    showIsCollection() {
      let collection = this.collection;

      if (collection) {
        this.isCollection = collection.some((item) => {
          if (item.id == this.songsListData[this.songIndex].id) {
            return true;
          }
        });
      } else {
        return false;
      }
    },

    //改变歌曲播放暂停状态
    changeSongStatus() {
      //
      if (this.audioStatus == 0) {
        this.$refs.audio.play();
        this.$store.commit("changeSongStatus", 1);
        //获取wrapper元素
        this.$nextTick(() => {
          this.$refs.wrapper.classList.remove("active");
        });
      } else {
        this.$refs.audio.pause();
        this.$store.commit("changeSongStatus", 0);
        //获取wrapper元素
        this.$nextTick(() => {
          this.$refs.wrapper.classList.add("active");
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.play-songs {
  color: #f1f1f1;
  width: 100%;
  height: 100%;
  padding-bottom: none;
  .background-box {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: absolute;
    z-index: -2;
    .background {
      position: absolute;
      top: -50%;
      left: -50%;
      width: 300%;
      height: 300%;
      z-index: -1;
      filter: blur(20px);
      opacity: 0.6;
      .filter {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #000;
        opacity: 0.6;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  header {
    height: 48px;
    margin-bottom: 25px;
    .close {
      height: 30px;
      margin: 9px;
    }
    .song-text {
      width: calc(~"100% - 48px");
      .song-name {
        width: 260px;
        height: 33px;
        font-size: 18px;
        padding-top: 8px;
        margin: 0 auto;
      }
      .singer {
        line-height: 16px;
        font-size: 12px;
        margin: 0 auto;
        font-weight: normal;
      }
    }
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  main {
    width: 100%;
    height: 418px;
    display: flex;
    align-items: center;
    .cd-box {
      width: 100%;
      height: 300px;
      position: relative;
      .hide {
        display: none;
      }
      .cd-wrapper {
        overflow: hidden;
        position: absolute;
        left: 50%;
        top: 0;
        transform: translateX(-50%);
        width: 300px;
        height: 300px;
        .cd-play {
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          border: 15px solid hsla(0, 0%, 100%, 0.1);
          border-radius: 50%;
          overflow: hidden;
          animation: rotate 20s linear infinite;
          img {
            width: 100%;
            height: 100%;
          }
        }
        //暂停播放
        .active {
          animation-play-state: paused;
        }
      }
      .lyric {
        overflow: hidden;
        position: absolute;
        left: 50%;
        top: 0;
        transform: translateX(-50%);
        width: 300px;
        height: 300px;
        font-size: 14px;
        color: #c7c7c7;
        overflow: hidden;
        ul {
          transition: all 1s;
          margin-top: 150px;
          li {
            height: 30px;
            line-height: 30px;
            width: 300px;
          }
          li.active {
            color: #fff;
            font-size: 18px;
            font-weight: 500;
            text-shadow: 0 0 1px #c9443b;
          }
        }
      }
    }
  }

  footer {
    width: 100%;
    height: 100px;
    margin-top: 25px;
    .slider-box {
      width: 100%;
      height: 30px;
      padding: 10px 0;
      .slider-box-center {
        margin: 0 auto;
        width: 90%;
        height: 30px;
        overflow: hidden;
        .left-time {
          margin-top: 6px;
          width: 15%;
        }
        .slider {
          height: 18px;
          margin-top: 12px;
          width: 70%;
        }
        .right-time {
          margin-top: 6px;
          width: 15%;
        }
      }
    }
    .operators {
      width: 100%;
      height: 40px;
      margin-top: 20px;
      display: flex;
      .circulation {
        text-align: right;
        width: 67px;
        img {
          margin-top: 7px;
        }
      }
      .last-song {
        text-align: right;
        width: 67px;
        img {
          margin-top: 5px;
        }
      }
      .play {
        text-align: center;
        width: 87px;
        padding: 0 20px;
        img {
          width: 40px;
          height: 40px;
        }
      }
      .next-song {
        text-align: left;
        width: 67px;
        img {
          margin-top: 5px;
        }
      }
      .collection {
        text-align: left;
        width: 67px;
        img {
          margin-top: 5px;
        }
      }
    }
  }
}
</style>