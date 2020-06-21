<template lang="pug">
    .order
        .order-row(v-if="displayMode === 'header'")
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
            .buttons.order-column
        .order-row(v-if="displayMode === 'show'")
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
            .buttons.order-column
                font-awesome-icon.edit-btn.button(icon="edit" @click="pushedEdit")
                font-awesome-icon.delete-btn.button(icon="times" @click="pushedRemove")
        .order-row(v-if="displayMode === 'edit'")
            .customer-name.order-column
                input(type="text" placeholder="依頼者" v-model="order.customerName" v-on:change="onCustomerInputChanged")
                select(v-model="order.customerId" v-on:change="onCustomerSelectChanged")
                    option(value="") - 依頼者 -
                    option(
                        v-for="customer in customers" 
                        :key="customer.id" 
                        v-model="order.customerId" 
                        v-bind:value="customer.id"
                        ) {{ customer.name }}
            .order-date.order-column
                datepicker(:value="order.orderDate" format="YYYY/MM/DD" placeholder="依頼日")
            .title.order-column
                input(type="text" v-model="order.title" placeholder="内容")
            .unit-price.order-column
                input(type="text" v-model="order.unitPrice" placeholder="単価")
            .quantity.order-column
                input(type="text" v-model="order.quantity" placeholder="数量")
            .buttons.order-column
                font-awesome-icon.save-btn.button(icon="save" @click="pushedSave")
        .updating(v-if="displayMode === 'uploading'")
            p Now Uploading..
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
export default class OrderComponent extends Vue {
    @Prop() public order!: Order
    @Prop() public customers!: Customer[] | null

    private onCustomerSelectChanged() {
        if (!this.order.customerId) { return }
        if (!this.customers) { return }
        for (const customer of this.customers) {
            if (customer.id === this.order.customerId) {
                this.order.customerName = customer.name
            }
        }
    }

    private onCustomerInputChanged() {
        if (!this.order.customerName) { return }
        if (!this.customers) { return }
        for (const customer of this.customers) {
            if (customer.name === this.order.customerName) {
                this.order.customerId = customer.id
                return
            }
        }
        this.order.customerId = ''
    }

    private get orderDate(): string {
        const date = this.order.orderDate
        return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()
    }

    private get displayMode(): 'show' | 'edit' | 'uploading' | 'header' {
        if (!this.order.mode) { return 'show' }
        if (this.order.mode === 'header') { return 'header' }
        if (this.order.mode === 'show') { return 'show' }
        if (this.order.mode === 'edit') { return 'edit' }
        if (this.order.mode === 'new') { return 'edit' }
        return 'uploading'
    }

    private pushedEdit() {
        this.order.mode = 'edit'
    }

    private pushedSave() {
        if (!this.isVarid) { return }

        if (this.order.mode === 'new') {
            this.order.mode = 'uploading'
            this.add()
        } else {
            this.order.mode = 'uploading'
            this.update()
        }
    }

    private async pushedRemove() {
        this.order.mode = 'uploading'
        this.remove()
    }

    @Emit()
    private add() {
        return this.order
    }

    @Emit()
    private update() {
        return this.order
    }

    @Emit()
    private remove() {
        return this.order
    }

    private get isVarid(): boolean {
        // TODO: 顧客の名前がかぶったらエラー
        // if　(!this.neworder) { return false }
        // if　(!this.neworder.name) { return false }
        // if　(this.neworder.name.trim() === '') { return false }
        return true;
    }
}
</script>

<style lang="sass">
@import 'src/sass/style'

.order-row
    margin-top: 1rem
    display: grid
    grid-template-areas: "customer date title unitPrice quantity btn"
    grid-template-columns: 2fr 2fr 4fr 1fr 1fr 1fr
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
    .buttons
        grid-area: btn

    .buttons
        display: flex
        .save-btn, .edit-btn
            color: $green
        .delete-btn
            color: $red

</style>