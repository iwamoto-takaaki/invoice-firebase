<template lang="pug">
    section#profile-section
        h1 請求者の情報
        .authed(v-if="this.authorized")
            p {{ this.name }}
        .unauth(v-else)
            p Loading...
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import store from '@/store/index'
import UserModule from '@/store/user'
import ProfileModule, { Profile } from '@/store/profile'
import { Unsubscribe } from 'firebase'
import { db } from '@/scripts/firebase'

@Component
export default class ProfileView extends Vue {
    public created() {
        if (!this.authorized) {
            this.$router.push('/')
            return
        }
    }
    public get name(): string | null | undefined {
        return UserModule.name
    }

    public get authorized(): boolean {
        return UserModule.authorized
    }
}
</script>