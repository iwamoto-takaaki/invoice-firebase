<template lang="pug">
    section#orders-section
        h1 注文一覧
        OrderComponent(
            :order="undefined"
            :customers="[]"
        )
        OrderComponent(
            v-for="order in state.orders" 
            :order="order"
            :customers="state.customers"
            :key="order.id"
            v-on:add="add"
            v-on:update="update"
            v-on:remove="remove"
        ) 
        hr
        OrderComponent(
            :order="state.newOrder"
            :customers="state.customers"
            v-on:add="add"
            v-on:update="update"
            v-on:remove="remove"
        )
</template>

<script lang="ts">
import { reactive, onMounted, onUnmounted, defineComponent } from '@vue/composition-api'
import VueRouter from 'vue-router'
import firebase from 'firebase'
import { getOrderCollection, Order, initOrder } from '@/scripts/modules/orders'
import { getCustomerCollection, Customer } from '@/scripts/modules/customers'
import UserModule from '@/store/user'
import OrderComponent from '@/components/Order.vue'

export default defineComponent({
    components: {
        OrderComponent,
    },
    setup() {
        const state = reactive<{
            orders: Order[] | undefined,
            customers: Customer[] | undefined,
            newOrder: Order,
        }> ({
            orders: undefined,
            customers: undefined,
            newOrder: initOrder(),
        })

        const router = new VueRouter()

        const uid = UserModule.uid

        if (!uid) {
            router.push('/')
            return
        }

        const orders = getOrderCollection(uid)
        const customers = getCustomerCollection(uid)

        onMounted(() => {
            orders.subscribe((snapshot) => state.orders = snapshot)
            customers.subscribe((snapshot) => state.customers = snapshot)
        })

        onUnmounted(() => {
            orders.unsubscribe()
            customers.unsubscribe()
        })

        return { state }
    },
})
</script>

<style lang="sass">
@import 'src/sass/style'

#orders-section
    h1
        margin-top: 1rem

</style>
