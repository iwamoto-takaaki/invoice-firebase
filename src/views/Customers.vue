<template lang="pug">
    section#customers-section
        h1 顧客一覧
        p {{ state }}
        customerComponent(
            v-for="customer in state.customers" 
            :customer="customer"
            :key="customer.id"
            v-on:update="update"
            v-on:remove="remove"
            )
        .field(v-if="!state.newCustomerUploading")
            .label
                label 登録: 
            .input
                input(type="text" v-model="state.newCustomer.name" placeholder="顧客名")
                font-awesome-icon.save-btn.button(icon="save" @click="pushedSave")
        .updating(v-else)
            p Now Uploading...
</template>

<script lang="ts">
import { reactive, onMounted, onUnmounted, defineComponent } from '@vue/composition-api'
import VueRouter from 'vue-router'
import firebase from 'firebase'
import { getCustomerCollection, Customer } from '@/scripts/modules/customers'
import customerComponent from '@/components/Customer.vue'
import UserModule from '@/store/user'
import { Timestamp } from '@google-cloud/firestore'

export default defineComponent({
    components: {
        customerComponent,
    },
    setup() {
        const newcustomer = (): Customer => {
            return {
            id: '',
            createdAt: firebase.firestore.Timestamp.now(),
            name: '',
            }
        }

        const state = reactive<{
            customers: Customer[] | undefined,
            newCustomer: Customer,
            newCustomerUploading: boolean,
        }> ({
            customers: [],
            newCustomer: newcustomer(),
            newCustomerUploading: false,
        })

        const uid = UserModule.uid
        if (!uid) {
            return { state }
        }

        const collection = getCustomerCollection(uid)

        onMounted(() => collection.subscribe((snapshot: Customer[]) => state.customers = snapshot))

        onUnmounted(() => collection.unsubscribe())

        const add = async (customer: Customer): Promise<any> => await collection.add(customer)
        const update = async (customer: Customer): Promise<void> => await collection.update(customer)
        const remove = async (customer: Customer): Promise<void> => await collection.delete(customer)

        const pushedSave = async () => {
            try {
                state.newCustomerUploading = true
                await add(state.newCustomer)
                state.newCustomer = newcustomer()
            } finally {
                state.newCustomerUploading = false
            }
        }

        return { state, add, update, remove, pushedSave }
    },
})
</script>

<style lang="sass">
@import 'src/sass/style'

#customers-section
    h1
        margin-top: 1rem

    .field
        margin-top: 1rem
        display: grid
        grid-template-areas: "label input"
        grid-template-columns: 3fr 5fr
        
        .label
            grid-area: label
            color: #333
            padding-right: 1rem
            text-align: right
        .input
            grid-area: input
            text-align: left

            input, textarea
                width: 15rem

            .save-btn
                color: $green
</style>