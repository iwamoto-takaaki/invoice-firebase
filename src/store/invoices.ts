import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store/index'
import UserModule from '@/store/user'
import CustomersModule, { Customer, getCustomer } from '@/store/customers'
import OrdersModule, { Order, getOrder } from '@/store/orders'
import { Unsubscribe } from 'firebase'
import { db, functions } from '@/scripts/firebase'
import { fromDateToString } from '@/scripts/helper'

export interface Invoice {
    id: string,
    createdAt: object | null,
    customer: Customer | undefined,
    title: string,
    orders: Order[],
    issueDate: Date | null,
    dueDate: Date | null,
    taxrate: number,
}

const convertToFirebaseObject = (data: Invoice): any => {
    const ret: any = {}
    ret.id = data.id
    ret.createdAt = data.createdAt
    if (!!data.customer) {
        ret.customer = data.customer.id
    }
    ret.title = data.title
    ret.orderIds = data.orders.map((o) => o.id)
    ret.issueDate = fromDateToString(data.issueDate)
    ret.dueDate = fromDateToString(data.dueDate)
    ret.taxrate = data.taxrate
    return ret
}

const convertFromFirebaseObject = (data: any, id: string): Invoice => {
    return {
        id,
        createdAt: data.createdAt,
        customer: getCustomer(data.customer as string),
        title: data.title,
        orders: data.orderIds.map((orderId: string) => getOrder(orderId)),
        issueDate: new Date(data.issueDate),
        dueDate: new Date(data.dueDate),
        taxrate: data.taxrate,
    }
}

@Module({ dynamic: true, store, name: 'invoice', namespaced: true })
class InvoicesModule extends VuexModule {

    private get collectionRef(): firebase.firestore.CollectionReference<firebase.firestore.DocumentData> {
        const uid = UserModule.uid
        return db.collection(`invoices/${uid}/list`)
    }
    public data: Invoice[] | null = null
    public detacher: Unsubscribe | undefined;

    @Action
    public async subscribe() {
        if (!UserModule.authorized) { return }

        const detacher = this.collectionRef
            .orderBy('createdAt')
            .onSnapshot((snapshot: any) => {
                const docs = snapshot.docs.map(
                    (doc: any) => convertFromFirebaseObject(doc.data(), doc.id),
                )
                this.REFLESH(docs)
            })

        this.SET_DETACHER(detacher)
    }

    @Action
    public unsubscribe() {
        if (!!this.detacher) {
            this.detacher();
        }
    }

    @Action
    public async add(data: Invoice): Promise<string | undefined> {
        return await this.ADD(convertToFirebaseObject(data))
    }

    @Action
    public async update(data: Invoice) {
        await this.UPDATE(convertToFirebaseObject(data))
    }

    @Action
    public async delete(data: Invoice) {
        await this.DELETE(convertToFirebaseObject(data))
    }

    @Action
    public newInvoke(customer: Customer): string | undefined {
        let id: string | undefined
        this.add({
            id: '',
            createdAt: null,
            customer,
            title: '',
            orders: [],
            issueDate: new Date(),
            dueDate: new Date(),
            taxrate: 10,
        }).then((res) => id = res)

        return id
    }

    @Mutation
    private async ADD(data: any): Promise<string | undefined> {
        let id: string | undefined
        const callable = functions.httpsCallable('addInvoice')
        return await callable(data)
            .then((res) => id = res.data.id)
    }

    @Mutation
    private UPDATE(data: any) {
        const callable = functions.httpsCallable('updateInvoice')
        callable(data)
    }

    @Mutation
    private DELETE(data: any) {
        const callable = functions.httpsCallable('deleteInvoice')
        callable(data)
    }

    @Mutation
    private REFLESH(data: Invoice[] | null) {
        this.data = data
    }

    @Mutation
    private SET_DETACHER(detacher: Unsubscribe) {
        this.detacher = detacher
    }
}

const invoicesModule = getModule(InvoicesModule)

export default invoicesModule

export function getInvoice(id: string): Invoice | undefined {
    if (!invoicesModule.data) { return undefined }
    return invoicesModule.data.find((i) => i.id === id)
}

