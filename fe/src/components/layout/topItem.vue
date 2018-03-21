<template>
  <router-link :to="link" tag="b-dropdown-item" exact-active-class="active" exact>
    <slot></slot>
  </router-link>
</template>

<script>
  export default {
    name: 'topItem',
    props: ['link', 'icon'],
    mounted() {
    },
  };
</script>

<style scoped>
</style>
