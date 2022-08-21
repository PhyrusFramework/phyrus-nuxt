<template>
  <div class="welcome_container">
    <div class="welcome_background"></div>
    <div class="welcome_box">
        <h1>Phyrus</h1>
        <h3>PHP Framework</h3>
        <h2>Welcome to your new project</h2>
        <p>Start reading the docs at <a href='https://phyrus.org/documentation' target="_blank">phyrus.org/documentation</a></p>
    </div>
  </div>
</template>

<style lang="scss">
* {
    box-sizing: border-box;
}
body {
    margin: 0;
    padding: 0;
}
.welcome_container {
    height: 100vh;
    padding: 10%;
    font-family: Arial, sans-serif;
    font-family: 'Ubuntu', sans-serif;
    background: linear-gradient(to top, rgb(24, 91, 122), rgb(59, 129, 161));
    z-index: 1;
    overflow: hidden;
}
.welcome_background {
    background-color: white;
    border-radius: 50%;
    position: absolute;
    width: 100vw;
    height: 100vw;
    top: -65vw;
    left: 0;
}
.welcome_box {
    text-align: center;
    position: relative;
    z-index: 2;
    transform: translateY(-50px);
}
.welcome_box h1 {
    font-size: 60px;
    line-height: 20px;
    color: rgb(24, 91, 122);
}

@media screen and (max-width: 991px) {
    .welcome_background {
        top: -55vw;
    }
    .welcome_box h1 {
        font-size: 50px;
    }
}

@media screen and (max-width: 768px) {
    .welcome_container {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .welcome_background {
        border-radius: 30px;
        left: 5%;
        top: 5%;
        width: 90%;
        height: 90%;
    }
    .welcome_box  {
        height:auto;
        padding: 20px;
        transform: none;
    }
    .welcome_box h1 {
        font-size: 45px;
    }
    .welcome_box a {
        text-decoration: underline;
        color: rgb(73, 73, 168);
    }
}
</style>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'IndexPage'
})
</script>
