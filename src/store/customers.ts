import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store/index'
import UserModule from '@/store/user'
import { Unsubscribe } from 'firebase'
import { db, functions } from '@/scripts/firebase'

export interface Customer {
    id: string;
    name: string;
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
    public ADD(data: Customer) {
        const callable = functions.httpsCallable('addCustomer')
        callable(data)
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
    public async add(data: Customer) {
        await this.ADD(data)
    }

    @Action
    public async update(data: Customer) {
        await this.UPDATE(data)
    }

    @Action
    public async delete(data: Customer) {
        await this.DELETE(data)
    }

    @Mutation
    private UPDATE(data: Customer) {
        const callable = functions.httpsCallable('updateCustomer')
        callable(data)
    }

    @Mutation
    private DELETE(data: Customer) {
        const callable = functions.httpsCallable('deleteCustomer')
        callable(data)
    }
}

export default getModule(CustomersModule)
