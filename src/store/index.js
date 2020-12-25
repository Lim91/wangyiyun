import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  //状态（数据），用法类似data
  state: {
    //控制歌曲播放页面的显示和隐藏
    isShow: false,

    //歌曲id
    songId: '',

    //歌曲src
    songSrc: '',

    //歌名、作者、图片
    songData: {},

    //当前音频播放时间currentTime、总时间totalTime、进度条value
    time: {},

    //歌曲播放状态(1:播放，0:暂停)
    audioStatus: 1,

    //歌单name和id的数据列表
    songsListData: [],

    //歌曲index
    songIndex: 0,

    //播放模式
    playMode: "circle"
  },


  mutations: {
    //控制歌曲播放页面的显示和隐藏
    changeIsShowTrue(state, data) {
      state.isShow = true;
    },
    changeIsShowFalse(state, data) {

      state.isShow = false;
    },

    //修改歌曲id
    changeSongId(state, data) {
      state.songId = data;
      // 
    },

    //修改歌曲src
    changeSongSrc(state, data) {
      state.songSrc = data;
      // 
    },

    //修改歌曲信息data
    changeSongData(state, data) {
      for (let key in data) {
        state.songData[key] = data[key]
      }


      if (localStorage.getItem("playHistory")) {
        let playHistory = JSON.parse(localStorage.getItem("playHistory"));
        playHistory.push(data);
        // 
        localStorage.setItem("playHistory", JSON.stringify(playHistory));
      } else {
        let playHistory = [];
        playHistory.push(data);
        localStorage.setItem("playHistory", JSON.stringify(playHistory));
        // 
      }
    },

    //修改当前音频播放时间currentTime、总时间totalTime、进度条value
    changeCurrentTime(state, time) {
      state.time = time;
    },

    //修改歌曲播放状态（0：暂停，1：播放）
    changeSongStatus(state, number) {
      state.audioStatus = number;
    },

    //修改歌单name和id列表
    changeSongsListData(state, data) {
      state.songsListData = data;

    },

    //修改歌曲index
    changeSongIndex(state, index) {
      state.songIndex = index;
    },

    //修改播放模式
    changePlayMode(state, data) {
      state.playMode = data;
    },
  },
  actions: {
  },
  modules: {
  }
})
