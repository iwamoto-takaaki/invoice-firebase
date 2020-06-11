<template lang="pug">
    section#profile-section
        h1 請求者の情報
        form(v-if="this.authorized" @submit.prevent="createEvent")
            .field
                .label
                    lable 名前:
                .input
                    input(type="text" v-model="profile.name" placeholder="名前")
            .field
                .label
                    lable 住所:
                .input
                    input(type="text" v-model="profile.address" placeholder="住所")
            .field
                .label
                    lable e-mail:
                .input
                    input(type="text" v-model="profile.email" placeholder="e-mail")
            .field
                .label
                    lable 電話番号:
                .input
                    input(type="text" v-model="profile.phone" placeholder="電話番号")
            .field
                .label
                    lable 銀行口座:
                .input
                    textarea(v-model="profile.account" placeholder="銀行口座")
            input.submit(type="submit" value="登録")
        .unauth(v-else)
            p Loading...
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Provide } from 'vue-property-decorator'
import store from '@/store/index'
import UserModule from '@/store/user'
import ProfileModule, { Profile } from '@/store/profile'
import { Unsubscribe } from 'firebase'
import { db } from '@/scripts/firebase'

@Component
export default class ProfileView extends Vue {
    @Provide()　public profile: Profile | null = null;
    public created() {
        if (!this.authorized) {
            this.$router.push('/')
            return
        }

        this.profile = ProfileModule.profile
    }

    public get authorized(): boolean {
        return UserModule.authorized
    }
}
</script>

<style lang="sass" scoped>
#profile-section
    .field
        margin-top: 1rem
        display: grid
        grid-template-areas: "label input"
        grid-template-columns: 3fr 5fr
        
        .label
            grid-area: label
            color: #333
            padding-right: 1rem
            text-align: right
        .input
            grid-area: input
            text-align: left

            input, textarea
                width: 15rem
    .submit
        margin-top: 2rem
        padding: 0.5rem 3rem
</style>