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

const callFirebaseFunction = (method: 'add' | 'update' | 'delete', data: Customer): Promise<void>  => {
    return new Promise(async (res, req) => {
        try {
            const callable = getHttpsCallable(method)
            const result = await callable(data)
            await common.setFirebaseResult('coutomers', method, result)
        } catch (e) {
            common.setFirebaseResult('coutomers', method, e)
        }
    })
}

@Module({ dynamic: true, store, name: 'customers', namespaced: true })
class CustomersModule extends VuexModule {
    public data: Customer[] | null = null
    public detacher: Unsubscribe | undefined;

    private get collectionRef(): firebase.firestore.CollectionReference<firebase.firestore.DocumentData> {
        const uid = UserModule.uid
        return db.collection(`customers/${uid}/list`)
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
        if (!UserModule.authorized) { return }

        const detacher = this.collectionRef
            .orderBy('createdAt')
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
        await callFirebaseFunction('update', data)
    }

    @Action
    public async add(data: Customer) {
        await callFirebaseFunction('add', data)
    }

    @Action
    public async delete(data: Customer) {
        await callFirebaseFunction('delete', data)
    }
}

export default getModule(CustomersModule)
