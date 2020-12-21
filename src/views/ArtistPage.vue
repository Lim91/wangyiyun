<template>
  <div class="songlistpage">
    <transition
      name="custom-classes-transition"
      enter-active-class="animate__animated animate__slideInUp"
      leave-active-class="animate__animated animate__slideOutDown"
    >
      <play-songs v-if="isShow"></play-songs>
    </transition>
    <div class="songlistpage-box" v-if="!isShow">
      <div
        v-if="songListData.artist"
        class="bg"
        :style="{ backgroundImage: `url('${songListData.artist.img1v1Url}')` }"
      >
        <div class="mask"></div>
        <van-nav-bar left-text="返回" left-arrow fixed @click-left="back" />

        <div class="bg-bottom" v-if="songListData">
          <h2 class="name">{{ songListData.artist.name }}</h2>
          <!-- <h4>
            <div><van-icon name="music-o" color="#fdfdfd" size="15" /></div>
            {{ songListData.playCount | nodecimal }}万
          </h4> -->
        </div>
      </div>

      <div class="song-list">
        <div class="song-list-top clearfix">
          <div class="play-all" @click="playAll">
            <van-icon name="play-circle-o" color="#fdfdfd" size="20px" />
          </div>
          <div class="all-songs">
            播放全部
            <span v-if="songListData.hotSongs"
              >(共{{ songListData.hotSongs.length }}首)</span
            >
          </div>
        </div>
        <ul>
          <li
            class="clearfix"
            v-for="(item, index) in songListData.hotSongs"
            :key="index"
            @click="goPlaySongs(item)"
          >
            <p class="count">{{ index + 1 }}</p>
            <div class="portrait">
              <img :src="item.al.picUrl" alt="" />
            </div>
            <div class="song-text">
              <h3 class="song-name onetext">{{ item.name }}</h3>
              <p class="singer onetext">{{ item.ar[0].name }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/songlistpage.less";
import PlaySongs from "../components/PlaySongs";
export default {
  components: { PlaySongs },
  data() {
    return {
      //歌单id
      id: "",

      //歌单数据
      songListData: [],
    };
  },

  created() {
    //截取id
    this.id = this.$route.params.id;
    //

    //获取歌单详情数据
    this.getSongListDetail();
  },

  computed: {
    //播放歌曲页面显示和隐藏的值
    isShow() {
      return this.$store.state.isShow;
    },
    //歌单列表id和name
    songsListData() {
      return this.$store.state.songsListData;
    },
  },

  methods: {
    back() {
      this.$router.go(-1);
    },
    getSongListDetail() {
      this.axios({
        method: "GET",
        url: "/artists",
        params: {
          id: this.id,
        },
      })
        .then((result) => {
          //
          let songListData = result.data;
          for (let key in songListData.hotSongs) {
            if (songListData.hotSongs[key].ar.length > 1) {
              songListData.hotSongs[key].ar[0].name =
                songListData.hotSongs[key].ar[0].name +
                "/" +
                songListData.hotSongs[key].ar[1].name;
            }
          }
          this.songListData = songListData;

          //将歌曲列表数据name和id传到store
          let songs = this.songListData.hotSongs;
          let songsListData = [];
          songs.map((item, index) => {
            let data = {};
            data.name = item.name;
            data.id = item.id;
            songsListData[index] = data;
          });
          //
          //
          this.$store.commit("changeSongsListData", songsListData);
        })
        .catch((err) => {
          console.log("err =>", err);
        });
    },

    //播放全部
    playAll() {
      //

      //根据歌曲id获取歌曲data并传值
      this.axios({
        method: "GET",
        url: "/song/detail",
        params: {
          ids: this.songsListData[0].id,
        },
      })
        .then((result) => {
          if (result.data.code == 200) {
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
            this.$store.commit("changeSongData", songData);

            //在store改变当前播放歌曲的id
            this.changeSongId(this.songsListData[0].id);

            //把歌曲src添加进store
            this.changeSongSrc(this.songsListData[0].id);
          }
        })
        .catch((err) => {
          console.log("err =>", err);
        });

      //修改歌曲index为0
      this.$store.commit("changeSongIndex", 0);

      //设置播放状态为播放
      this.$store.commit("changeSongStatus", 1);
    },

    //修改歌曲播放页面显示和隐藏的值
    changeIsShowTrue() {
      this.$store.commit("changeIsShowTrue");
    },

    //修改歌曲id
    changeSongId(id) {
      this.$store.commit("changeSongId", id);
    },

    //根据歌曲id获取歌曲src并传值
    changeSongSrc(id) {
      this.axios({
        method: "GET",
        url: "/song/url",
        params: {
          id,
        },
      })
        .then((result) => {
          if (result.data.code == 200) {
            let songSrc = result.data.data[0].url;
            //
            this.$store.commit("changeSongSrc", songSrc);
          }
        })
        .catch((err) => {
          console.log("err =>", err);
        });
    },

    //根据歌曲id获取歌曲data并传值
    changeSongData(id) {
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

    //打开播放歌曲页面
    goPlaySongs(item) {
      //歌曲id
      //

      let id = item.id;

      //打开播放页面
      this.changeIsShowTrue();

      //在store改变当前播放歌曲的id
      this.changeSongId(id);

      //把歌曲src添加进store
      this.changeSongSrc(id);

      //上传修改歌曲信息
      let songData = {};
      //歌名、图片链接、歌手
      songData.name = item.name;
      songData.picUrl = item.al.picUrl;
      songData.artists = item.ar[0].name;
      //
      this.$store.commit("changeSongData", songData);
    },
  },
};
</script>