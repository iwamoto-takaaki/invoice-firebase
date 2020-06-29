<template lang="pug">
    section#invoices-section
        h1 注文一覧
        invoiceComponent(
        )
        hr
        .button
            p(@click="pushNewInvoice") 新規作成
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Provide, Prop } from 'vue-property-decorator'
import store from '@/store/index'
import UserModule from '@/store/user'
import InvoicesModule, { Invoice } from '@/store/invoices'
import invoiceComponent from '@/components/Invoice.vue'
import customersModel, { Customer } from '@/store/customers'
import { Unsubscribe } from 'firebase'
import { db } from '@/scripts/firebase'

@Component({
    components: {
        invoiceComponent,
    },
})
export default class InvoicesView extends Vue {
    public get invoices(): Invoice[] {
        if (InvoicesModule.data === null) { return [] }
        return InvoicesModule.data
            .filter((i) => {
                if (!i.customer) { return false }
                return i.customer.id === this.customerId
            })
    }

    @Prop() public customerId!: string

    public get authorized(): boolean {
        return UserModule.authorized
    }

    private mounted() {
        if (!this.authorized) {
            this.$router.push('/')
            return
        }
    }

    private async add(invoice: Invoice) {
        await InvoicesModule.add(invoice)
    }

    private async update(invoice: Invoice) {
        await InvoicesModule.update(invoice)
    }

    private async remove(invoice: Invoice) {
        await InvoicesModule.delete(invoice)
    }
}
</script>

<style lang="sass">
@import 'src/sass/style'

#invoices-section
    h1
        margin-top: 1rem

</style>
