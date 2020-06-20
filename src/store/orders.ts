import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store/index'
import UserModule from '@/store/user'
import { Unsubscribe } from 'firebase'
import { db, functions } from '@/scripts/firebase'
import { formDateToString } from '@/scripts/helper'

export interface Order {
    id: string,
    createdAt: any,
    customerId: string,
    customerName: string,
    orderDate: Date,
    title: string,
    unitPrice: number,
    quantity: number,
}

const convertToFirebaseObject = (data: Order): any => {
    const ret: any = Object.assign({}, data)
    ret.orderDate = formDateToString(ret.orderDate)
    return ret
}

const convertFromFirebaseObject = (data: any, id: string): Order => {
    return Object.assign(data, { id , orderDate: new Date(data.orderDate) }) as Order
}

@Module({ dynamic: true, store, name: 'orders', namespaced: true })
class OrdersModule extends VuexModule {
    private get collectionRef(): firebase.firestore.CollectionReference<firebase.firestore.DocumentData> {
        const uid = UserModule.uid
        return db.collection(`orders/${uid}/list`)
    }

    public data: Order[] | null = null
    public detacher: Unsubscribe | undefined;

    @Mutation
    public ADD(data: any) {
        const callable = functions.httpsCallable('addOrder')
        callable(data)
    }

    @Mutation
    public REFLESH(data: Order[] | null) {
        this.data = data
    }

    @Mutation
    public SET_DETACHER(detacher: Unsubscribe) {
        this.detacher = detacher
    }

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
    public async add(data: Order) {
        await this.ADD(convertToFirebaseObject(data))
    }

    @Action
    public async update(data: Order) {
        await this.UPDATE(convertToFirebaseObject(data))
    }

    @Action
    public async delete(data: Order) {
        await this.DELETE(convertToFirebaseObject(data))
    }

    @Mutation
    private UPDATE(data: any) {
        const callable = functions.httpsCallable('updateOrder')
        callable(data)
    }

    @Mutation
    private DELETE(data: any) {
        const callable = functions.httpsCallable('deleteOrder')
        callable(data)
    }
}

export default getModule(OrdersModule)