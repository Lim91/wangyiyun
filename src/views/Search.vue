<template>
  <div class="search">
    <div class="search-box" v-if="!isShow">
      <van-nav-bar
        @click-left="back"
        @click-right="searchClear"
        left-arrow
        right-text="清空"
      >
        <template #title>
          <van-search
            placeholder="搜索歌曲、歌手"
            ref="search"
            background="#d44439"
            left-icon="none"
            @search="searchSongsData"
            @input="changeSongsData"
            v-model="searchValue"
            right-icon="none"
          />
        </template>
      </van-nav-bar>

      <div class="first-show" v-if="songsData.length == 0">
        <main>
          <div class="hot-search" v-if="searchSuggest.length == 0">
            <p class="title">热门搜索</p>
            <span
              class="hot-search-items"
              v-for="(item, index) in hotSearch"
              :key="index"
              @click="searchHot(item.first)"
              >{{ item.first }}</span
            >
          </div>
          <div class="search-suggestt" v-else>
            <p class="title">搜索建议</p>
            <span
              class="hot-search-items"
              v-for="(item, index) in searchSuggest"
              :key="index"
              @click="searchHot(item)"
              >{{ item }}</span
            >
          </div>
        </main>
        <!-- 搜索历史 -->
        <footer v-if="searchHistory.length > 0">
          <h4 class="title clearfix">
            搜索历史
            <div class="fr delete-all">
              <van-icon name="delete" size="16" @click="clearAllHistory" />
            </div>
          </h4>
          <div class="search-list">
            <ul>
              <li
                class="search-item clearfix"
                v-for="(item, index) in searchHistory"
                :key="index"
              >
                <div class="text fl" @click="searchHot(item)">{{ item }}</div>
                <div class="icon fr" @click="deleteSearchItem(index)">
                  <van-icon name="cross" size="16" />
                </div>
              </li>
            </ul>
          </div>
        </footer>
      </div>

      <!-- 搜索列表 -->
      <transition
        name="custom-classes-transition"
        enter-active-class="animate__animated animate__fadeInRight"
      >
        <div class="second-show" v-if="songsData.length != 0">
          <div class="search-suggest">
            <h4 class="title">最佳匹配</h4>
            <!-- 歌手 -->
            <div
              class="search-suggest-item"
              v-if="singerData.length > 0"
              @click="goSingerPage(singerData[0].id)"
            >
              <img
                :src="`${singerData[0].img1v1Url}?imageView=1&type=webp&thumbnail=369x0`"
                alt=""
              />
              <div class="text">
                <p class="one-text">歌手：{{ singerData[0].name }}</p>
              </div>
            </div>
            <div
              class="search-suggest-item"
              v-if="songsList.length > 0"
              @click="goSongList(songsList[0].id)"
            >
              <img
                :src="`${songsList[0].coverImgUrl}?imageView=1&type=webp&thumbnail=369x0`"
                alt=""
              />
              <div class="text">
                <p class="one-text">歌单</p>
                <p class="one-text">{{ songsList[0].name }}</p>
              </div>
            </div>
            <ul class="suggest-list">
              <li
                class="suggest-item"
                v-for="(item, index) in songsData"
                :key="index"
                @click="goPlaySong(item, index)"
              >
                <p class="song one-text">{{ item.name }}</p>
                <p class="singer">{{ item.artists[0].name }}</p>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import "../assets/less/search.less";
export default {
  name: "Search",
  data() {
    return {
      //搜索框的值
      searchValue: "",
      //热门搜索
      hotSearch: [],
      //搜索建议
      searchSuggest: [],
      //搜索历史
      searchHistory: [],
      //歌手数据
      singerData: [],
      //歌单数据
      songsList: [],
      //单曲数据
      songsData: [],
      //歌手名字
      singerName: "",
    };
  },

  created() {
    this.$nextTick(() => {
      //
      let searchIpt = this.$refs.search.querySelector('[type="search"]');
      //自动获取焦点
      searchIpt.focus();
    });
    //获取热门搜索
    this.getSearchHot();

    //获取收缩历史
    this.getSearchHistory();
  },

  watch: {
    //判断搜索框的值是否为空，是的话不显示搜索建议
    searchChange: function (newV) {
      if (newV.searchValue.length == 0 && newV.searchSuggest.length != 0) {
        this.searchSuggest = [];
      }
    },
  },

  computed: {
    //播放歌曲页面显示和隐藏的值
    isShow() {
      return this.$store.state.isShow;
    },
    songSrc() {
      return this.$store.state.songSrc;
    },
    searchChange() {
      const { searchSuggest, searchValue } = this;
      return { searchSuggest, searchValue };
    },
  },

  methods: {
    //返回上一页
    back() {
      this.$router.go(-1);
    },

    //获取热门搜索
    getSearchHot() {
      this.axios({
        methods: "GET",
        url: "/search/hot",
      })
        .then((result) => {
          //
          if (result.data.code == 200) {
            this.hotSearch = result.data.result.hots;
            //
          }
        })
        .catch((err) => {});
    },

    //获取搜索历史
    getSearchHistory() {
      if (localStorage.getItem("searchHistory")) {
        this.searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
      }
    },

    //设置搜索历史
    setSearchHistory(text) {
      for (let key in this.searchHistory) {
        if (this.searchHistory[key] == text) {
          this.searchHistory.splice(key, 1);
        }
      }
      this.searchHistory.unshift(text);
      localStorage.setItem("searchHistory", JSON.stringify(this.searchHistory));
    },

    //点击热门搜索跳转到搜索
    searchHot(text) {
      this.searchValue = text;
      this.searchSongsData(text);
    },

    //清空所有搜索历史
    clearAllHistory() {
      this.searchHistory = [];
      localStorage.setItem("searchHistory", JSON.stringify(this.searchHistory));
    },

    //搜索历史点击删除按钮
    deleteSearchItem(item, index) {
      this.searchHistory.splice(index, 1);
      localStorage.setItem("searchHistory", JSON.stringify(this.searchHistory));
    },

    //搜索歌曲
    searchSongsData(value) {
      //搜索历史
      this.setSearchHistory(value);
      this.getSearchHistory();

      //
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });

      //单曲
      this.axios({
        methods: "GET",
        url: "/search",
        //如果是get请求，参数需要放在params，如果是post，参数放在data
        params: {
          keywords: value,
          limit: 15,
        },
      })
        .then((result) => {
          //
          if (result.data.code == 200) {
            let songsData = result.data.result.songs;
            console.log("songsData =>", songsData);
            for (let key in songsData) {
              if (songsData[key].artists.length > 1) {
                songsData[key].artists[0].name =
                  songsData[key].artists[0].name +
                  "/" +
                  songsData[key].artists[1].name;
              }
            }
            //去掉收费歌曲
            songsData.forEach((item, index, self) => {
              if (item.fee == 1) {
                self.splice(index, 1);
              }
            });
            this.songsData = songsData;

            this.$toast.clear();
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("err =>", err);
        });

      //歌手
      this.axios({
        methods: "GET",
        url: "/search",
        //如果是get请求，参数需要放在params，如果是post，参数放在data
        params: {
          keywords: value,
          type: 100,
        },
      })
        .then((result) => {
          //
          if (result.data.code == 200) {
            this.singerData = result.data.result.artists.splice(0, 1);
            //
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("err =>", err);
        });

      //歌单
      this.axios({
        methods: "GET",
        url: "/search",
        //如果是get请求，参数需要放在params，如果是post，参数放在data
        params: {
          keywords: value,
          type: 1000,
        },
      })
        .then((result) => {
          //
          if (result.data.code == 200) {
            //
            this.songsList = result.data.result.playlists.splice(0, 1);
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("err =>", err);
        });
    },

    //监听搜索框键盘按下事件
    changeSongsData(value) {
      //清空搜索建议
      this.searchSuggest = [];
      //如果搜索栏为空
      if (!this.searchValue) {
        this.searchClear();
      } else {
        //搜索建议
        this.axios({
          methods: "GET",
          url: "/search/suggest",
          //如果是get请求，参数需要放在params，如果是post，参数放在data
          params: {
            keywords: value,
          },
        })
          .then((result) => {
            if (result.data.code == 200) {
              let data = result.data.result;
              if (data.artists) {
                data.artists.map((item) => {
                  this.searchSuggest.push(item.name);
                });
              }
              if (data.songs) {
                data.songs.map((item) => {
                  this.searchSuggest.push(item.name);
                });
              }
            }
          })
          .catch((err) => {
            console.log("err =>", err);
          });
      }
    },

    //清空列表
    searchClear() {
      //清空搜索框
      this.searchValue = "";
      //歌手数据
      this.singerData = [];
      //歌单数据
      this.songsList = [];
      //单曲数据
      this.songsData = [];
      //
      this.searchSuggest = [];
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
            //
            let songSrc = result.data.data[0].url;
            //
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
      //
      let id = item.id;

      //打开播放页面
      this.changeIsShowTrue();

      //在store改变但钱播放歌曲的id
      this.changeSongId(id);

      //把歌曲src添加进store
      this.changeSongSrc(id);

      //上传修改歌曲信息
      let songData = {};
      //歌名、图片链接、歌手
      songData.name = item.name;
      songData.picUrl = item.artists[0].img1v1Url;
      let artists = [];
      for (let i = 0; i < item.artists.length; i++) {
        artists.push(item.artists[i].name);
      }
      songData.artists = artists.join("/");
      songData.id = JSON.stringify(id);
      //
      this.$store.commit("changeSongData", songData);

      //上传数据到songsListData
      let songsListData = [];
      this.songsData.map((item, index) => {
        let data = {};
        data.name = item.name;
        data.id = item.id;
        songsListData[index] = data;
      });
      this.$store.commit("changeSongsListData", songsListData);
      //修改歌曲index为当前index
      this.$store.commit("changeSongIndex", index);
    },

    // 跳转到歌手列表页面
    goSingerPage(id) {
      //
      this.$router.push({ name: "ArtistPage", params: { id: id } });
    },

    // 跳转到歌单列表
    goSongList(id) {
      //
      this.$router.push({ name: "SongListPage", params: { id: id } });
    },
  },
};
</script>