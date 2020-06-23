<template lang="pug">
    .order
        .order-row(v-if="mode === 'header'")
            .buttons.order-column
                input(type="checkbox"  v-model="checked" @change="pushedCheckBox")
            .customer-name.order-column
                .order-value 顧客名
            .order-date.order-column
                .order-value 日付
            .title.order-column
                .order-value 品目
            .unit-price.order-column
                .order-value 単価
            .quantity.order-column
                .order-value 数量
            .price.order-column
                .order-value 金額
        .order-row(v-if="mode === 'detail'")
            .buttons.order-column
                input(type="checkbox"  v-model="checked" @change="pushedCheckBox")
            .customer-name.order-column
                .order-value {{ order.customerName }}
            .order-date.order-column
                .order-value {{ orderDate }}
            .title.order-column
                .order-value {{ order.title }}
            .unit-price.order-column
                .order-value {{ order.unitPrice }}
            .quantity.order-column
                .order-value {{ order.quantity }}
            .price.order-column
                .order-value {{ order.quantity * order.unitPrice }}
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Emit } from 'vue-property-decorator'
import { Order } from '@/store/orders'
import { Customer } from '@/store/customers'
import Datepicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'

@Component({
    components: {
        Datepicker,
    },
})
export default class InvoiceDetailComponent extends Vue {
    @Prop() public order!: Order
    @Prop() public mode!: 'header' | 'detail'
    @Prop() public checked!: boolean

    private pushedCheckBox() {
        if (this.checked) {
            this.check()
        } else {
            this.uncheck()
        }
    }

    private get orderDate(): string {
        const date = this.order.orderDate
        return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()
    }

    @Emit()
    public check() {
        return this.order
    }

    @Emit()
    public uncheck() {
        return this.order
    }
}
</script>

<style lang="sass">
@import 'src/sass/style'

.order-row
    margin-top: 1rem
    display: grid
    grid-template-areas: "btn customer date title unitPrice quantity price"
    grid-template-columns: 1fr 2fr 2fr 4fr 1fr 1fr 1fr
    width: 65rem
    margin-left: auto
    margin-right: auto

    .order-column
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

    .label
        grid-area: label
        color: #333
        padding-right: 1rem
        text-align: right
    .customer-name
        grid-area: customer
    .order-date
        grid-area: date
    .title
        grid-area: title
    .unit-price
        grid-area: unitPrice
    .quantity
        grid-area: quantity
    .price
        grid-area: price
    .buttons
        grid-area: btn

    .buttons
        display: flex
        .save-btn, .edit-btn
            color: $green
        .delete-btn
            color: $red

</style>