<template lang="pug">
    section#profile-section
        h1 請求者の情報
        form(@submit.prevent="update")
            .field
                .label
                    label 名前:
                .input
                    input(type="text" v-model="state.profile.name" placeholder="名前")
            .field
                .label
                    label 住所:
                .input
                    input(type="text" v-model="state.profile.address" placeholder="住所")
            .field
                .label
                    label e-mail:
                .input
                    input(type="text" v-model="state.profile.email" placeholder="e-mail")
            .field
                .label
                    label 電話番号:
                .input
                    input(type="text" v-model="state.profile.phone" placeholder="電話番号")
            .field
                .label
                    label 銀行口座:
                .input
                    textarea(v-model="state.profile.account" placeholder="銀行口座")
            input.submit(type="submit" value="登録")
</template>

<script lang="ts">
import { reactive, onMounted, onUnmounted, defineComponent } from '@vue/composition-api'
import VueRouter from 'vue-router'
import { Profile, getProfileDocument } from '@/scripts/modules/profile'
import UserModule from '@/store/user'

export default defineComponent({
    setup() {
        const state = reactive<{
            profile: Profile | undefined,
        }> ({
            profile: undefined,
        })

        const uid = UserModule.uid
        if (!uid) {
            const router = new VueRouter()
            router.push('/')
            return
        }

        const doc = getProfileDocument(uid)

        onMounted(() => { doc.subscribe((snapshot) => state.profile = snapshot) })

        onUnmounted(() => { doc.unsubscribe() })

        const update = () => {
            if (!state.profile) { return }
            doc.update(state.profile)
        }

        return { state, update }
    },
})
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