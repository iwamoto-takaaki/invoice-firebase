<template lang="pug">
    section#customers-section
        h1 顧客一覧
        customerComponent(
            v-for="customer in customers" 
            :customer="customer"
            :key="customer.id"
            v-on:update="update"
            v-on:remove="remove"
            )
        .field(v-if="!newCustomerUploading")
            .label
                label 登録: 
            .input
                input(type="text" v-model="newCustomer.name" placeholder="顧客名")
                font-awesome-icon.save-btn.button(icon="save" @click="add")
        .updating(v-else)
            p Now Uploading...
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Provide, Prop } from 'vue-property-decorator'
import store from '@/store/index'
import UserModule from '@/store/user'
import CustomersModule, { Customer } from '@/store/customers'
import customerComponent from '@/components/Customer.vue'
import { Unsubscribe } from 'firebase'
import { db } from '@/scripts/firebase'

@Component({
    components: {
        customerComponent,
    },
})
export default class CustomersView extends Vue {
    public newCustomer: Customer = this.initCustomer();
    public newCustomerUploading: boolean = false;

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
        try {
            if (!this.idVeridNewCustomer) { return }

            this.newCustomerUploading = true
            await CustomersModule.add({
                id: '',
                name: this.newCustomer.name.trim(),
            })

            this.newCustomer = this.initCustomer()
        } finally {
            this.newCustomerUploading = false
        }
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
        if　(this.newCustomer.name.trim() === '') { return false }
        return true;
    }
}
</script>

<style lang="sass">
@import 'src/sass/style'

#customers-section
    h1
        margin-top: 1rem

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

            .save-btn
                color: $green
</style>