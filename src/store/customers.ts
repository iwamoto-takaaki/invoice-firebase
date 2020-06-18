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

const callFirebaseFunction = (method: 'add' | 'update' | 'delete', data: Customer)
    : Promise<firebase.functions.HttpsCallableResult>  => {
    return new Promise(async (res, rej) => {
        try {
            const callable = getHttpsCallable(method)
            const result = await callable(data)
            res(result)
        } catch (e) {
            rej(e)
        }
    })
}

@Module({ dynamic: true, store, name: 'customers', namespaced: true })
class CustomersModule extends VuexModule {

    private get collectionRef(): firebase.firestore.CollectionReference<firebase.firestore.DocumentData> {
        const uid = UserModule.uid
        return db.collection(`customers/${uid}/list`)
    }
    public data: Customer[] | null = null
    public detacher: Unsubscribe | undefined;

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
        this.UPDATE(data)
    }

    @Mutation
    public ADD(data: Customer) {
        callFirebaseFunction('add', data)
    }

    @Action
    public async add(data: Customer) {
        this.ADD(data)
    }

    @Action
    public async delete(data: Customer) {
        this.DELETE(data)
    }

    @Mutation
    private UPDATE(data: Customer) {
        callFirebaseFunction('update', data)
    }

    @Mutation
    private DELETE(data: Customer) {
        callFirebaseFunction('delete', data)
    }
}

export default getModule(CustomersModule)
