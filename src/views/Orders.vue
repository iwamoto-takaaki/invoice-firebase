<template lang="pug">
    section#orders-section
        h1 注文一覧
        OrderComponent(
            v-for="order in orders" 
            :order="order"
            :customers="customers"
            :key="order.id"
            v-on:add="add"
            v-on:update="update"
            v-on:remove="remove"
        ) 
        hr
        OrderComponent(
            :order="neworder"
            :customers="customers"
            v-on:add="add"
            v-on:update="update"
            v-on:remove="remove"
        )
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Provide, Prop } from 'vue-property-decorator'
import store from '@/store/index'
import UserModule from '@/store/user'
import ordersModule, { Order } from '@/store/orders'
import OrderComponent from '@/components/Order.vue'
import customersModel, { Customer } from '@/store/customers'
import { Unsubscribe } from 'firebase'
import { db } from '@/scripts/firebase'

@Component({
    components: {
        OrderComponent,
    },
})
export default class OrdersView extends Vue {
    public neworder: Order = this.initOrder()

    public get orders(): Order[] {
        if (ordersModule.data === null) { return [] }
        return ordersModule.data
    }

    private get customers(): Customer[] | null {
        return customersModel.data
    }

    private initOrder(): Order {
        return {
            id: '',
            createdAt: null,
            mode: 'new',
            customerId: '',
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

    private async add(order: Order) {
        await ordersModule.add(order)
        this.neworder = this.initOrder()
    }

    private async update(order: Order) {
        await ordersModule.update(order)
    }

    private async remove(order: Order) {
        await ordersModule.delete(order)
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
