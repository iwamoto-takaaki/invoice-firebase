<template lang="pug">
    #firebaseui-auth-container
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { authObject, ui } from '@/scripts/firebase';

@Component
export default class Auth extends Vue {
    public mounted() {
        ui.start('#firebaseui-auth-container', {
            signInOptions: [authObject.EmailAuthProvider.PROVIDER_ID],
            signInSuccessUrl: this.from,
        });
    }

    get from(): string {
        if (this.$route.query.from) {
            return this.$route.query.from as string;
        }
        return '/';
    }
}
</script>