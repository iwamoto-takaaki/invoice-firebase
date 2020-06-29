<template lang="pug">
.invoice-component
    .invoice-row(v-if="mode === 'header'")
        .invoice-issue.field 発行日
        .invoice-titile.field 表題
        .invoice-totalprice.field 金額
        .invoice-due.field 期限
        .invoice-buttons.field
    .invoice-row(v-else)
        .invoice-issue.field {{ issueDate }}
        .invoice-titile.field {{ invoice.title }}
        .invoice-totalprice.field {{ invoice.totalprice }}
        .invoice-due.field {{ dueDate }}
        .invoice-buttons.field
            router-link(:to="{ name : 'Invoice', params : { customerId: invoice.customer.id, invoiceId: invoice.id　}}")
                font-awesome-icon.edit-btn.button(icon="edit")
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Emit } from 'vue-property-decorator'
import { Invoice } from '@/store/invoices'
import 'vue2-datepicker/index.css'
import { fromDateToString } from '@/scripts/helper'

@Component({
    components: {
    },
})
export default class InvoiceComponent extends Vue {
    @Prop() public invoice!: Invoice | undefined
    @Prop() public mode!: 'header' | 'show'

    public get issueDate(): string | null {
        if (!this.invoice) { return '' }
        return fromDateToString(this.invoice.issueDate)
    }

    public get dueDate(): string | null {
        if (!this.invoice) { return '' }
        return fromDateToString(this.invoice.dueDate)
    }

    @Emit()
    public edit() {
        return this.invoice
    }
}
</script>


<style lang="sass" scoped>
@import 'src/sass/style'

.invoice-component
    .invoice-row
        margin-top: 1rem
        display: grid
        grid-template-areas: "issue titile totalprice due buttons"
        grid-template-columns: 1fr 4fr 1fr 1fr 1fr
        width: 65rem
        margin-left: auto
        margin-right: auto

        .field
            margin: .3rem
            display: grid
            align-items: center


            input, select
                height: 2rem
                padding: .3rem
                top: 50%
                border: .5px solid #555
                border-radius: .3rem
                width: 100%
            
        .invoice-issue
            grid-area: issue
        .invoice-titile
            grid-area: titile
        .invoice-totoalprice
            grid-area: totalprice
        .invoice-due
            grid-area: due
        .invoice-buttons
            grid-area: buttons
            .edit-btn
                color: $green
</style>