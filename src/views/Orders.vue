<template lang="pug">
    section#orders-section
        h1 注文一覧
        OrderComponent(
            v-for="order in orders" 
            :order="order"
            :customers="customers"
            :isEditMode="false"
            :key="order.id"
            v-on:add="add"
            v-on:update="updata"
            v-on:remove="remove"
        ) 
        hr
        OrderComponent(
            :order="neworder"
            :customers="customers"
            :isEditMode="true"
            v-on:add="add"
            v-on:update="updata"
            v-on:remove="remove"
        )
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Provide, Prop } from 'vue-property-decorator'
import store from '@/store/index'
import UserModule from '@/store/user'
import { Order } from '@/store/orders'
import OrderComponent from '@/components/Order.vue'
import customersModel, { Customer } from '@/store/customers'
import common from '@/store/common'
import { Unsubscribe } from 'firebase'
import { db } from '@/scripts/firebase'

@Component({
    components: {
        OrderComponent,
    },
})
export default class OrdersView extends Vue {
    public neworder: Order = this.initOrder()

    public data = [{
            id: '1',
            createdAt: null,
            customerId: '1',
            customerName: '11',
            orderDate: new Date(),
            title: 'title1',
            unitPrice: 100,
            quantity: 1,
            },
            {
            id: '2',
            createdAt: null,
            customerId: '2',
            customerName: '22',
            orderDate: new Date(),
            title: 'title2',
            unitPrice: 110,
            quantity: 2,
            },
        ]

    private get customers(): Customer[] | null {
        return customersModel.data
    }

    private initOrder(): Order {
        return {
            id: '',
            createdAt: null,
            customerId: 'a1',
            customerName: '',
            orderDate: new Date(),
            title: '',
            unitPrice: 0,
            quantity: 1,
            }
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

    public get orders(): Order[] {
        // if (!ordersModule.data) { return [] }
        // return ordersModule.data
        return this.data
    }

    private onCustomerSelectChanged() {
        if (!this.neworder.customerId) { return }
        if (!this.customers) { return }
        for (const customer of this.customers) {
            if (customer.id === this.neworder.customerId) {
                this.neworder.customerName = customer.name
            }
        }
    }

    private async add() {
        /*
        try {
            if (!this.idVeridNeworder) { return }

            this.neworderUploading = true
            await ordersModule.add({
                id: '',
                name: this.neworder.name.trim(),
            })

            this.neworder = this.initorder()
        } finally {
            this.neworderUploading = false
        }
        */
        this.data.push(this.neworder)
        this.neworder = this.initOrder()
    }

    private update(order: Order) {
        // ordersModule.update(order)
    }

    private remove(order: Order) {
        this.data = this.data.filter((o) => order.id !== o.id)
    }
}
</script>

<style lang="sass">
@import 'src/sass/style'
@import 'src/sass/order'

#orders-section
    h1
        margin-top: 1rem

</style>
