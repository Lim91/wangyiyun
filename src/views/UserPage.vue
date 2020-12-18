<template>
  <div class="user-page">
    <transition
      name="custom-classes-transition"
      enter-active-class="animate__animated animate__slideInUp"
      leave-active-class="animate__animated animate__slideOutDown"
    >
      <play-songs v-if="isShow"></play-songs>
    </transition>
    <div class="user-page-box" v-if="!isShow">
      <van-tabs v-model="active" class="navbar">
        <template #nav-left>
          <van-icon name="arrow-left" color="white" @click="back" size="16" />
          <div class="back" @click="back">返回</div>
        </template>
        <van-tab title="我的收藏">
          <div class="play-all">
            <van-icon
              name="play-circle-o"
              color="#2e3030"
              size="22"
              @click="collectionPlayAll"
            />
            <div class="play-all-lefttext">播放全部</div>
            <div class="play-all-righttext">
              (共{{ collectionData.length }}首)
            </div>
            <div class="delete">
              <van-icon
                name="delete"
                color="#2e3030"
                size="22"
                @click="deleteSongsList('collection')"
              />
            </div>
          </div>

          <ul class="collection-list">
            <li
              class="collection-item clearfix"
              v-for="(item, index) in collectionData"
              :key="index"
              @click="goPlaySongOne(item, index)"
            >
              <p class="index fl">{{ index + 1 }}</p>
              <div class="text fl">
                <p class="name">{{ item.name }}</p>
                <p class="artist">{{ item.artists }}</p>
              </div>
            </li>
          </ul>
        </van-tab>
        <van-tab title="最近播放">
          <div class="play-all">
            <van-icon
              name="play-circle-o"
              color="#2e3030"
              size="22"
              @click="historyPlayAll"
            />
            <div class="play-all-lefttext">播放全部</div>
            <div class="play-all-righttext">
              (共{{ playHistoryData.length }}首)
            </div>
            <div class="delete">
              <van-icon
                name="delete"
                color="#2e3030"
                size="22"
                @click="deleteSongsList('playHistory')"
              />
            </div>
          </div>

          <ul class="recently-list">
            <li
              class="recently-item clearfix"
              v-for="(item, index) in playHistoryData"
              :key="index"
              @click="goPlaySongTwo(item, index)"
            >
              <p class="index fl">{{ index + 1 }}</p>
              <div class="text fl">
                <p class="name">{{ item.name }}</p>
                <p class="artist">{{ item.artists }}</p>
              </div>
            </li>
          </ul>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import "../assets/less/userpage.less";
import PlaySongs from "../components/PlaySongs";
export default {
  components: { PlaySongs },
  data() {
    return {
      active: 0,

      //我的收藏列表数据
      collectionData: [],

      //最近播放列表数据
      playHistoryData: [],
    };
  },

  created() {
    this.collection();
    this.playHistory();
    console.log("重新加载");
  },

  computed: {
    //播放歌曲页面显示和隐藏的值
    isShow() {
      let isShow = this.$store.state.isShow;
      this.collection();
      this.playHistory();
      return isShow;
    },

    //歌单列表id和name
    songsListData() {
      return this.$store.state.songsListData;
    },

    songSrc() {
      return this.$store.state.songSrc;
    },
  },

  methods: {
    //返回上一页
    back() {
      this.$router.go(-1);
    },

    //收藏列表
    collection() {
      if (localStorage.getItem("collection")) {
        let collection = JSON.parse(localStorage.getItem("collection"));
        this.collectionData = collection;
      } else {
        this.collectionData = [];
      }
    },

    //播放历史
    playHistory() {
      if (localStorage.getItem("playHistory")) {
        let playHistory = JSON.parse(localStorage.getItem("playHistory"));
        this.playHistoryData = playHistory;
      } else {
        this.playHistoryData = [];
      }
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
            console.log("music result.data =>", result.data);
            let songSrc = result.data.data[0].url;
            // console.log("songSrc", songSrc);
            this.$store.commit("changeSongSrc", songSrc);
          }
        })
        .catch((err) => {
          console.log("err =>", err);
        });
    },

    //我的收藏页面播放全部
    collectionPlayAll() {
      //上传数据到songsListData
      let songsListData = [];
      this.collectionData.map((item, index) => {
        let data = {};
        data.name = item.name;
        data.id = item.id;
        songsListData[index] = data;
      });
      this.$store.commit("changeSongsListData", songsListData);

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
            console.log("result.data.songs =>", result.data.songs[0]);
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

    //播放历史页面全部播放
    historyPlayAll() {
      //上传数据到songsListData
      let songsListData = [];
      this.playHistoryData.map((item, index) => {
        let data = {};
        data.name = item.name;
        data.id = item.id;
        songsListData[index] = data;
      });
      this.$store.commit("changeSongsListData", songsListData);

      //根据歌曲id获取歌曲data并传值
      this.axios({
        method: "GET",
        url: "/song/detail",
        params: {
          ids: this.playHistoryData[0].id,
        },
      })
        .then((result) => {
          if (result.data.code == 200) {
            console.log("result.data.songs =>", result.data.songs[0]);
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
            //
            //在store改变当前播放歌曲的id
            this.changeSongId(this.playHistoryData[0].id);
            //
            //把歌曲src添加进store
            this.changeSongSrc(this.playHistoryData[0].id);
          }
        })
        .catch((err) => {
          console.log("err =>", err);
        });

      //修改歌曲index为0
      this.$store.commit("changeSongIndex", 0);

      //设置播放状态为播放
      this.$store.commit("changeSongStatus", 1);

      console.log("aaaabsldkfjdf");
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
            this.$store.commit("changeSongData", songData);
          }
        })
        .catch((err) => {
          console.log("err2 =>", err);
        });
    },

    //打开播放歌曲页面
    goPlaySongOne(item, index) {
      //歌曲id
      console.log("item =>", item);
      let id = item.id;

      //上传数据到songsListData
      let songsListData = [];
      //修改歌单列表数据name和id
      this.collectionData.map((item, index) => {
        let data = {};
        data.name = item.name;
        data.id = JSON.parse(item.id);
        songsListData[index] = data;
      });
      this.$store.commit("changeSongsListData", songsListData);

      //打开播放页面
      this.changeIsShowTrue();

      //在store改变当前播放歌曲的id
      this.changeSongId(id);

      //把歌曲src添加进store
      this.changeSongSrc(id);

      //修改歌曲index
      this.$store.commit("changeSongIndex", index);

      //上传修改歌曲信息
      let songData = {};
      //歌名、图片链接、歌手
      songData.name = item.name;
      songData.picUrl = item.picUrl;
      songData.artists = item.artists;
      console.log("item =>", item);
      this.$store.commit("changeSongData", songData);

      this.collection();
      this.playHistory();
    },

    //打开播放歌曲页面
    goPlaySongTwo(item, index) {
      //歌曲id
      console.log("item =>", item);
      let id = item.id;

      //上传数据到songsListData
      let songsListData = [];
      //修改歌单列表数据name和id
      this.playHistoryData.map((item, index) => {
        let data = {};
        data.name = item.name;
        data.id = item.id;
        songsListData[index] = data;
      });
      // console.log("this.collectionData =>", this.collectionData);
      // console.log("this.songsListData =>", this.songsListData);
      this.$store.commit("changeSongsListData", songsListData);

      //打开播放页面
      this.changeIsShowTrue();

      //在store改变当前播放歌曲的id
      this.changeSongId(id);

      //把歌曲src添加进store
      this.changeSongSrc(id);

      //修改歌曲index
      this.$store.commit("changeSongIndex", index);

      //上传修改歌曲信息
      let songData = {};
      //歌名、图片链接、歌手、id
      songData.name = item.name;
      songData.picUrl = item.picUrl;
      songData.artists = item.artists;
      songData.id = JSON.stringify(id);
      console.log("item =>", item);
      this.$store.commit("changeSongData", songData);

      this.collection();
      this.playHistory();
    },

    //删除所有歌曲
    deleteSongsList(data) {
      localStorage.setItem(data, "");
      console.log("data =>", data);

      this.collection();
      this.playHistory();
    },
  },
};
</script>