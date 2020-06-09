<template lang="pug">
    #header-section
        .title
            h1 請求書作成ツール
        .links
            router-link(to="/") Home
            |  | 
            router-link(to="/about") About
        .login
            .signin-btn(v-if="!authorized")
                router-link(to="/auth") Sign In
            .signout(v-else)
                .name login: {{ userName }}
                .singout-btn(@click="signOut") Sign out
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import UserModule from '@/store/user';

@Component
export default class HeaderView extends Vue {
    get authorized(): boolean {
        return UserModule.authorized;
    }

    get userName(): string | null | undefined {
        return UserModule.name;
    }

    public signOut() {
        UserModule.logout();
    }
}
</script>
