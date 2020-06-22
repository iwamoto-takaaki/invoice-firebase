<template lang="pug">
    section#invoice-section
        h1 請求書作成
        .invoice-from from: {{ this.from }}
        .invoice-to to: {{ this.to }}

        p costomerId: {{ this.customerId }}
        p invoiceId: {{ this.invoiceId }}
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Provide, Prop } from 'vue-property-decorator'
import store from '@/store/index'
import UserModule from '@/store/user'
import ProfileModule, { Profile } from '@/store/profile'
import ordersModule, { Order } from '@/store/orders'
import OrderComponent from '@/components/Order.vue'
import customersModel, { Customer } from '@/store/customers'
import { Invoice } from '../store/invoices'

@Component({
    components: {
    },
})
export default class InvoiceView extends Vue {
    @Prop() public customerId!: string
    @Prop() public invoiceId!: string
    public invoice!: Invoice
    public from: Date = this.lastMonthFirstDay
    public to: Date = new Date()

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

    public get Profile(): Profile | null {
        return ProfileModule.profile
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

    private async new() {
        // this.invoice = await invoicesModule.new()
        this.invoice = {
                id: '',
                createdAt: null,
                customer: undefined,
                title: '',
                orders: [],
                issueDate: new Date(),
                dueDate: new Date(),
                taxrate: 0.10,
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
            this.new()
            return
        }

        // this.invoice = InvoiceModule.getInvoice(this.invoiceId)

        if (!this.invoice) {
            this.$router.push('/404')
            return
        }
    }

}
</script>

<style lang="sass">
@import 'src/sass/style'

#orders-section
    h1
        margin-top: 1rem

</style>
