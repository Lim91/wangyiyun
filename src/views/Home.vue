<template>
  <div class="home">
    <transition
      name="custom-classes-transition"
      enter-active-class="animate__animated animate__slideInUp"
      leave-active-class="animate__animated animate__slideOutDown"
    >
      <play-songs v-if="isShow"></play-songs>
    </transition>
    <div class="home-box" v-if="!isShow">
      <!-- 顶部搜索 -->
      <van-nav-bar title="LIM MUSIC">
        <template #left>
          <van-icon
            name="shop-o"
            size="22"
            color="#fdfdfd"
            @click="leftShowPopup"
          />
        </template>
        <template #right>
          <van-icon
            name="search"
            size="22"
            color="#fdfdfd"
            @click="rightShowPopup"
          />
        </template>
      </van-nav-bar>

      <van-tabs v-model="active" @change="setActive" sticky>
        <!-- 推荐 -->
        <van-tab title="推荐">
          <div class="recommend">
            <!-- 轮播 -->
            <van-swipe :autoplay="2500">
              <van-swipe-item v-for="(image, index) in images" :key="index">
                <img v-lazy="image.pic" />
              </van-swipe-item>
            </van-swipe>

            <h2 class="song-list-title">推荐歌单</h2>

            <!-- 推荐歌单 -->
            <ul class="song-list clearfix">
              <li
                v-for="(item, index) in songList"
                :key="index"
                @click="goSongListPage(item.id)"
              >
                <div class="song-box">
                  <img :src="item.picUrl" alt="" />
                  <div class="img-text">
                    <div>
                      <van-icon name="music-o" color="#fdfdfd" size="14" />
                    </div>
                    {{ item.playCount | nodecimal }}万
                  </div>
                </div>

                <div class="song-name">{{ item.name }}</div>
              </li>
            </ul>

            <h2 class="song-list-title">推荐歌曲</h2>

            <!-- 推荐歌曲 -->
            <ul class="song-list clearfix">
              <li
                v-for="(item, index) in songs"
                :key="index"
                @click="goPlaySong(item, index)"
              >
                <div class="song-box">
                  <img :src="item.picUrl" alt="" />
                </div>

                <div class="song-name one-text">{{ item.name }}</div>
                <div class="song-artist one-text">
                  {{ item.song.artists[0].name }}
                </div>
              </li>
            </ul>
          </div>
        </van-tab>
        <!-- 排行 -->
        <van-tab title="排行">
          <ul class="ranking">
            <li
              class="clearfix"
              v-for="(item, index) in rankingList"
              :key="index"
              @click="goSongListPage(item.id)"
            >
              <div class="img-box fl"><img :src="item.coverImgUrl" /></div>
              <div class="ranking-songs fl">
                <p class="one-text" v-for="(v, k) in item.tracks" :key="k">
                  {{ k + 1 }}. {{ v.first }} - {{ v.second }}
                </p>
              </div>
            </li>
          </ul>
        </van-tab>
        <!-- 歌手 -->
        <van-tab title="歌手">
          <van-index-bar>
            <div
              class="singer-list"
              v-for="(value, key, index) in this.singer"
              :key="index"
            >
              <van-index-anchor :index="key" />
              <div
                class="singer-item"
                v-for="(item, index) in value"
                :key="index"
                @click="goSingerPage(item.id)"
              >
                <img :src="item.picUrl" alt="" />
                <p>{{ item.name }}</p>
              </div>
            </div>
          </van-index-bar>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import "../assets/less/home.less";
import PlaySongs from "../components/PlaySongs";
export default {
  name: "Home",
  components: { PlaySongs },
  data() {
    return {
      //字母表
      alphabet: [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
      ],
      //按字母給歌手排序的数据
      singer: {
        A: "",
        B: "",
        C: "",
        D: "",
        E: "",
        F: "",
        G: "",
        H: "",
        I: "",
        J: "",
        K: "",
        L: "",
        M: "",
        N: "",
        O: "",
        P: "",
        Q: "",
        R: "",
        S: "",
        T: "",
        U: "",
        V: "",
        W: "",
        X: "",
        Y: "",
        Z: "",
      },

      //记录激活的标签
      active: 2,
      //轮播图数据
      images: [],
      //推荐歌单数据
      songList: [],
      //推荐歌曲数据
      songs: [],
      //歌单数据的name和id
      songsListData: [],
      //歌单排行榜数据
      rankingList: [],
    };
  },
  created() {
    //获取激活的标签
    this.getActive();
    this.getBanner();
    this.getSongList();
    this.getRanking();
    this.getSongs();
    this.getSinger();
  },

  computed: {
    //播放歌曲页面显示和隐藏的值
    isShow() {
      return this.$store.state.isShow;
    },
    songSrc() {
      return this.$store.state.songSrc;
    },
  },
  methods: {
    //返回上一页
    goBack() {
      this.$router.go(-1);
    },

    //设置当前点击标签的下标
    setActive(name, title) {
      // console.log("name =>", name);
      localStorage.setItem("activeIndex", JSON.stringify(name));
    },

    //获取标签的下标
    getActive() {
      this.active = JSON.parse(localStorage.getItem("activeIndex"));
      // console.log("aaaaa active =>", this.active);
    },

    leftShowPopup() {
      this.$router.push({ name: "UserPage" });
    },
    rightShowPopup() {
      this.$router.push({ name: "Search" });
    },

    //获取轮播图数据
    getBanner() {
      this.axios({
        method: "GET",
        url: "/banner",
        params: {
          type: 1,
        },
      })
        .then((result) => {
          if (result.status == 200) {
            // console.log("result =>", result);
            this.images = result.data.banners;
          }
        })
        .catch((err) => {
          console.log("err =>", err);
        });
    },

    //获取推荐歌单
    getSongList() {
      this.axios({
        method: "GET",
        url: "/personalized",
        params: {
          limit: 6,
        },
      })
        .then((result) => {
          // console.log("result =>", result);
          result.data.result.map((v, i) => {
            if (v) {
              this.songList.push(v);
              // console.log(v, i);
            }
          });
        })
        .catch((err) => {
          console.log("err =>", err);
        });
    },

    //获取推荐歌曲
    getSongs() {
      this.axios({
        method: "GET",
        url: "/personalized/newsong",
      })
        .then((result) => {
          // console.log("result =>", result);
          if (result.data.code == 200) {
            this.songs = result.data.result.splice(0, 9);
          }
        })
        .catch((err) => {
          console.log("err =>", err);
        });
    },
    // 跳转到歌单列表页面
    goSongListPage(id) {
      // console.log(id);
      this.$router.push({ name: "SongListPage", params: { id: id } });
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
            // console.log("music result.data.data =>", result.data.data);
            let songSrc = result.data.data[0].url;
            // console.log("songSrc", songSrc);
            this.$store.commit("changeSongSrc", songSrc);
          }
        })
        .catch((err) => {
          console.log("err =>", err);
        });
    },

    //打开播放歌曲页面
    goPlaySong(item, index) {
      //歌曲id
      console.log("item =>", item);
      let id = item.id;

      //修改歌单列表数据name和id
      this.songs.map((item, index) => {
        let data = {};
        data.name = item.name;
        data.id = item.id;
        this.songsListData[index] = data;
      });
      // console.log("this.songs =>", this.songs);
      // console.log("this.songsListData =>", this.songsListData);
      this.$store.commit("changeSongsListData", this.songsListData);

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
      var artists = [];
      for (let i = 0; i < item.song.artists.length; i++) {
        artists.push(item.song.artists[i].name);
      }
      songData.artists = artists.join("/");
      songData.id = JSON.stringify(id);
      console.log("item =>", item);
      this.$store.commit("changeSongData", songData);
    },

    //获取排行榜数据
    getRanking() {
      this.axios({
        method: "GET",
        url: "/toplist/detail",
      })
        .then((result) => {
          if (result.data.code == 200) {
            // console.log("result =>", result);

            result.data.list.map((v) => {
              if (v.tracks.length > 0) {
                this.rankingList.push(v);
              }
            });
          }
        })
        .catch((err) => {
          console.log("err =>", err);
        });
    },

    //获得按字母排序的歌手
    getSinger() {
      for (let key of this.alphabet) {
        // console.log("key =>", key);
        this.axios({
          method: "GET",
          url: "/artist/list",
          params: {
            initial: key,
            limit: 3,
          },
        })
          .then((result) => {
            if (result.status == 200) {
              // console.log("result.data.artists =>", result.data.artists);
              let artists = result.data.artists;
              this.singer[key] = artists;
            }
          })
          .catch((err) => {
            console.log("err =>", err);
          });
      }
      // console.log("this.singer =>", this.singer);
    },

    // 跳转到歌手列表页面
    goSingerPage(id) {
      // console.log(id);
      this.$router.push({ name: "ArtistPage", params: { id: id } });
    },
  },
};
</script>
