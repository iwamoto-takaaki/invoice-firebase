<template lang="pug">
    section#invoice-section
        h1 請求書作成
        h4 請求期間:
        .row
            .invoice-from
                datepicker(v-model="from" format="YYYY/MM/DD" placeholder="開始日")
            p 〜
            .invoice-to 
                datepicker(v-model="to" format="YYYY/MM/DD" placeholder="締日")
        h4 請求先:
        .row
            P {{ customer.name }}
            
        h4 請求額:
        .row
            .invoice-totalPrice
                P 税抜: {{ totalPrice }} 円
            .invoice-taxrate
                input(type="number" v-model:number="invoice.taxrate") 
                |   %
            .invoice-tax-inculuded
                p 税込:　{{ Math.floor(invoice.taxrate * totalPrice / 100) + totalPrice }} 円
        hr
        InvoiceDetailComponent(
            :mode="'header'"
            )
        InvoiceDetailComponent(
            v-for="order in orders" 
            :order="order"
            :customers="customers"
            :key="order.id"
            :mode="'detail'"
            :checked="false"
            v-on:check="check"
            v-on:uncheck="uncheck"
            ref="detail"
        ) 
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Provide, Prop } from 'vue-property-decorator'
import store from '@/store/index'
import UserModule from '@/store/user'
import ordersModule, { Order } from '@/store/orders'
import customersModel, { Customer } from '@/store/customers'
import { Invoice } from '@/store/invoices'
import InvoiceDetailComponent from '@/components/InvoiceDetail.vue'
import Datepicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
import OrdersView from './Orders.vue'

@Component({
    components: {
        InvoiceDetailComponent,
        Datepicker,
    },
})
export default class InvoiceView extends Vue {

    public get lastMonthFirstDay() {
        const today = new Date()
        let lastMonth = today.getMonth() - 1
        let year = today.getFullYear()
        if (lastMonth < 0) {
            lastMonth += 12
            --year
        }
        return new Date(year, lastMonth, 1)
    }

    private get customer(): Customer | undefined {
        if (!customersModel.data) { return undefined }
        return customersModel.data.find((d) => d.id === this.customerId)
    }

    public get orders(): Order[] {
        if (ordersModule.data === null) { return [] }
        return ordersModule.data
            .filter((o) => o.customerId === this.customerId)
            .filter((o) => this.from <= o.orderDate && o.orderDate <= this.to)
    }

    public get authorized(): boolean {
        return UserModule.authorized
    }

    public get totalPrice(): number {
        if (this.invoice.orders.length < 1) { return 0 }
        return this.invoice.orders
            .map((o) => o.quantity * o.unitPrice)
            .reduce((acc, cur) => acc + cur)
    }
    @Prop() public customerId!: string
    @Prop() public invoiceId!: string
    public from: Date = this.lastMonthFirstDay
    public to: Date = new Date()
    public invoice: Invoice = this.new()

    public check(order: Order) {
        this.invoice.orders = this.invoice.orders.filter((o) => o.id !== order.id)
        this.invoice.orders.push(order)
    }

    public uncheck(order: Order) {
        this.invoice.orders = this.invoice.orders.filter((o) => o.id !== order.id)
    }

    private new() {
        // this.invoice = await invoicesModule.new()
        return {
                id: '',
                createdAt: null,
                customer: undefined,
                title: '',
                orders: [],
                issueDate: new Date(),
                dueDate: new Date(),
                taxrate: 10,
                totalPrice: 0,
        }
    }

    private mounted() {
        if (!this.authorized) {
            this.$router.push('/')
            return
        }

        /*
        if (!this.customer) {
            this.$router.push('/404')
            return
        }
        */

        if (this.invoiceId === 'new') {
            this.invoice = this.new()
            return
        }

        // this.invoice = InvoiceModule.getInvoice(this.invoiceId)
        /*
        if (!this.invoice) {
            this.$router.push('/404')
            return
        }
        */
    }
}
</script>

<style lang="sass">
@import 'src/sass/style'

#invoice-section
    h1
        margin-top: 1rem
    h4
        margin-top: 1rem
    .row
        margin-top: 0.5rem
        display: flex
        flex-direction: row
        justify-content: center

        p
            display: block
            margin-top: auto
            margin-bottom: auto
            padding: 0 1rem

        .invoice-totalPrice, .invoice-tax-inculuded
            P
                width: 8rem
                font-weight: bold

        .invoice-taxrate
            input
                width: 3rem
        
</style>
