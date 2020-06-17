<template lang="pug">
    section#customers-section
        h1 顧客の情報
        customerComponent(
            v-for="customer in customers" 
            :customer="customer"
            :key="customer.id"
            v-on:update="updata"
            v-on:remove="remove"
            )
        form(v-if="this.authorized" @submit.prevent="add")
            .field
                .label
                    label 顧客名:
                .input
                    input(type="text" v-model="newCustomer.name" placeholder="顧客名")
            input.submit(type="submit" value="登録" v-bind:disable="this.idVeridNewCustomer")
        .unauth(v-else)
            p Loading...
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Provide, Prop } from 'vue-property-decorator'
import store from '@/store/index'
import UserModule from '@/store/user'
import CustomersModule, { Customer } from '@/store/customers'
import customerComponent from '@/components/Customer.vue'
import common from '@/store/common'
import { Unsubscribe } from 'firebase'
import { db } from '@/scripts/firebase'

@Component({
    components: {
        customerComponent,
    },
})
export default class CustomersView extends Vue {
    public newCustomer: Customer = this.initCustomer();

    private initCustomer(): Customer {
        return {id: '', name: ''}
    }

    private mounted() {
        if (!this.authorized) {
            this.$router.push('/')
            return
        }
    }

    public get authorized(): boolean {
        return UserModule.authorized
    }

    private get customers(): Customer[] {
        if (!CustomersModule.data) { return [] }
        return CustomersModule.data
    }

    private async add() {
        await CustomersModule.add({
            id: '',
            name: this.newCustomer.name,
        })

        this.newCustomer = this.initCustomer()
    }

    private update(customer: Customer) {
        CustomersModule.update(customer)
    }

    private remove(customer: Customer) {
        CustomersModule.delete(customer)
    }

    private get idVeridNewCustomer(): boolean {
        if　(!this.newCustomer) { return false }
        if　(!this.newCustomer.name) { return false }
        return true;
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