<template lang="pug">
  #app
    #nav
      header-view/
    router-view/
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator'
import HeaderView from '@/components/Header.vue'
import store from '@/store/index'
import UserModule from '@/store/user'

@Component({
  components: {
    HeaderView,
  },
})
export default class App extends Vue {
  public created() {
    UserModule.subscribe();
  }

  get authorized(): boolean {
    return UserModule.authorized;
  }

  public destroyed() {
    UserModule.unsubscribe();
  }
}
</script>

<style lang="sass">
div, h1, h2, h3, h4, h5, h6
  padding: 0
  margin: 0

#app
  font-family: Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50
</style>
