<template lang="pug">
    .order(v-if="!this.orderUploading")
        .order-row(v-if="!this.isEditMode")
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
                font-awesome-icon.edit-btn.button(icon="edit" @click="isEditMode=true")
                font-awesome-icon.delete-btn.button(icon="times" @click="remove")
        .order-row(v-else)
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
                datepicker(:value="order.orderDate" format="yyyy/MM/dd" placeholder="依頼日")
            .title.order-column
                input(type="text" v-model="order.title" placeholder="内容")
            .unit-price.order-column
                input(type="text" v-model="order.unitPrice" placeholder="単価")
            .quantity.order-column
                input(type="text" v-model="order.quantity" placeholder="数量")
            .buttons.order-column
                font-awesome-icon.save-btn.button(icon="save" @click="updateOrAdd")
    .updating(v-else)
        p Now Uploading...
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Emit } from 'vue-property-decorator'
import { Order } from '@/store/orders'
import { Customer } from '@/store/customers'
import Datepicker from 'vuejs-datepicker'

@Component({
    components: {
        Datepicker,
    },
})
export default class OrderComponent extends Vue {
    @Prop() public order!: Order
    @Prop() public customers!: Customer[] | null
    @Prop() public isEditMode!: boolean
    public orderUploading: boolean = false

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

    public get orderDate(): string {
        const date = this.order.orderDate
        return date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate()
    }

    private updateOrAdd() {
        if (!this.order.id) {
            this.add()
        } else {
            this.update()
        }
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

    private get idVeridNeworder(): boolean {
        // if　(!this.neworder) { return false }
        // if　(!this.neworder.name) { return false }
        // if　(this.neworder.name.trim() === '') { return false }
        return true;
    }
}
</script>
