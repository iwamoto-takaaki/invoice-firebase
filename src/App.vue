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
@import 'src/sass/style'

#app
  font-family: Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50
</style>
