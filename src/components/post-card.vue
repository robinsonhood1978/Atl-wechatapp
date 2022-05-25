<template>
  <div class="post-item">
    <!--<img :src="postData.coverImg" alt="" class="post-cover">-->
    <div class="post-cover" :style="{ backgroundImage:  'url(' + postData.coverImg + ')'}"></div>
    <h3>{{postData.title}}</h3>
    <p class="post-author">来自：{{postData.author}}</p>
    <p class="post-excerpt">{{postData.excerpt}}</p>
  </div>
</template>

<script>
export default {
  props: ['postData']
}
</script>

<style scoped lang="scss">
  .post-item {
    margin: 20px;
    padding-bottom: 10px;
    border-width: 0;
    border-bottom-width: 1px;
    border-style: dotted;
    .post-cover {
      margin-top: 20px;
      width: 100%;
      height: 200rpx;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: 50% 50%;
    }
    h3 {
      font-size: 1.2em;
      margin: 0;
      padding: 10px 0 0;
    }
    .post-author{
      font-size: 0.5em;
      margin: 0;
      padding: 0;
    }
    .post-excerpt{
      padding-top:15px;
      text-align: justify;
      font-size: 0.7em;
    }
  }
</style>
