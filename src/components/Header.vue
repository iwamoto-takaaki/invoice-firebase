<template lang="pug">
    #header-section
        .title
            h1 請求書作成ツール
        .links
            router-link(to="/") Home
            |  | 
            router-link(to="/about") About
        .login
            .signin-btn Sign In
            .signout-btn Sign out
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component
export default class HeaderView extends Vue {
}
</script>
