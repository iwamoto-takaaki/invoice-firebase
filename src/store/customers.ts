import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store/index'
import UserModule from '@/store/user'
import common from '@/store/common'
import { Unsubscribe } from 'firebase'
import { db, functions } from '@/scripts/firebase'

export interface Customer {
    id: string;
    name: string;
}

const getHttpsCallable = (method: 'add' | 'update' | 'delete'): firebase.functions.HttpsCallable => {
    return functions.httpsCallable(method + 'Customer')
}

@Module({ dynamic: true, store, name: 'customers', namespaced: true })
class CustomersModule extends VuexModule {
    public data: Customer[] | null = null
    public detacher: Unsubscribe | undefined;
    public status: string | null = null;

    private get collectionRef(): firebase.firestore.CollectionReference<firebase.firestore.DocumentData> {
        const uid = UserModule.uid
        return db.collection(`customers/${uid}/list`)
    }

    @Mutation
    public SET_STATUS(status: string) {
        this.status = status
    }

    @Mutation
    public REFLESH(data: Customer[] | null) {
        this.data = data
    }

    @Mutation
    public SET_DETACHER(detacher: Unsubscribe) {
        this.detacher = detacher
    }

    @Action
    public async subscribe() {
        this.SET_STATUS('call subscribe')
        if (!UserModule.authorized) { return }

        const detacher = this.collectionRef
            .onSnapshot((snapshot: any) => {
                const docs = snapshot.docs.map((doc: any) => {
                    return Object.assign(doc.data(), { id: doc.id }) as Customer[];
                })
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
    public async update(data: Customer) {
        try {
            const update = functions.httpsCallable('updateCustomers')
            const result = await update(data)
            common.setFirebaseResult('coutomers', 'update', result)
        } catch (e) {
            common.setFirebaseResult('coutomers', 'update', e)
        }
    }

    @Action
    public async add(data: Customer) {
        try {
            const add = functions.httpsCallable('addCustomer')
            const result = await add(data)
            await common.setFirebaseResult('coutomers', 'add', result)
        } catch (e) {
            common.setFirebaseResult('coutomers', 'add', e)
        }
    }

    @Action
    public async delete(data: Customer) {
        try {
            const update = functions.httpsCallable('deleteCustomer')
            const result = await update(data)
            common.setFirebaseResult('coutomers', 'delete', result)
        } catch (e) {
            common.setFirebaseResult('coutomers', 'delete', e)
        }
    }
}


export default getModule(CustomersModule)
