<template lang="pug">
    .customer-row
        .normal-mode(v-if="!this.isEditMode")
            .content {{ customer.name }} 
            font-awesome-icon.edit-btn.button(icon="edit" @click="isEditMode=true")
            font-awesome-icon.delete-btn.button(icon="times" @click="remove")
            router-link(v-bind:to="{ name : 'Invoice', params : { customerId:customer.id, invoiceId: 'new' }}") 領収書
        .edit-mode(v-else)
            .input
                input(type="text" v-model="customer.name")
            font-awesome-icon.save-btn.button(icon="save" @click="update")
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Emit } from 'vue-property-decorator'
import { Customer } from '@/store/customers'

@Component
export default class MessageCardComponent extends Vue {
    @Prop() public customer!: Customer
    private removing: boolean = false
    private isEditMode: boolean = false

    @Emit() public remove() {
        if (this.removing) { return }
        this.removing = true
        return this.customer;
    }

    @Emit() public update() {
        this.isEditMode = false
        return this.customer
    }
}
</script>

<style lang="sass">
@import 'src/sass/style'

.customer-row
    .normal-mode, .edit-mode 
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        .content, .button
            padding: 0.5rem 1rem;

    .normal-mode
        .delete-btn
            color: $red
        .edit-btn
            color: $green
    .edit-mode
        .save-btn
            color: $green
</style>
