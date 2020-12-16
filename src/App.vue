<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style lang="less">
body {
  background-color: #f2f3f4;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

.clearfix::after {
  content: "";
  display: block;
  clear: both;
}
.fl {
  float: left;
}
.fr {
  float: right;
}

.one-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
ul {
  list-style: none;
  list-style-type: none;
}
:root {
  --animate-duration: 300ms;
  // --animate-delay: 0.9s;
}
</style>
