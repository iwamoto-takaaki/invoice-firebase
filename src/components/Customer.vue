<template lang="pug">
    .Customer
        .content(v-if="!this.isEditMode") {{ customer.name }} 
        .edit(v-else)
            input(type="text" v-model="this.customer.name")
            .buttom 変更 
        font-awesome-icon(icon="trash" @click="remove")
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Emit } from 'vue-property-decorator'
import { Customer } from '@/store/customers'

@Component
export default class MessageCardComponent extends Vue {
    @Prop() public customer!: Customer;

    @Emit() public remove() {
        return this.customer;
    }

    @Emit() public update() {
        return this.customer
    }

    public get isEditMode() {
        return false
    }
}
</script>

<style lang="sass" scoped>
.messageCard
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    .content
        padding: 0.5rem 2rem;
</style>
