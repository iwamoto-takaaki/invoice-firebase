<template lang="pug">
    #header-section
        .title
            h1 請求書作成ツール
        .links
            router-link(to="/") Home
            |  | 
            router-link(to="/about") About
            |  | 
            router-link(to="/profile") Profile
        .login
            .signin-btn(v-if="!authorized")
                router-link(to="/auth") Sign In
            .signout(v-else)
                .name login: {{ userName }} {{ uid }}
                .singout-btn(@click="signOut") Sign out
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { User } from 'firebase'
import store from '@/store/index'
import UserModule from '@/store/user'

@Component
export default class HeaderView extends Vue {
    get authorized(): boolean {
        return UserModule.authorized
    }

    get userName(): string | null | undefined {
        return UserModule.name
    }

    get uid(): string | null | undefined {
        return UserModule.user ? UserModule.user.uid : null;
    }

    public signOut() {
        UserModule.logout();
    }
}
</script>
