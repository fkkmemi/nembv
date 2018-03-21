<template>
  <div>
    <top></top>
    <b-container fluid>
      <router-view></router-view>
    </b-container>
  </div>
</template>

<script>
  import top from '../layout/top';
  // import left from '../layout/left';

  export default {
    name: 'index',
    components: {
      top,
      // left,
    },
  };
</script>

<style scoped>
</style>
