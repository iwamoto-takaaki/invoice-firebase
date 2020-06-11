import { Module, VuexModule, getModule, Mutation, Action } from 'vuex-module-decorators'
import store from '@/store/index'
import UserModule from '@/store/user'
import { Unsubscribe, User } from 'firebase'
import { db } from '@/scripts/firebase'

export interface Profile {
    name: string;
    address: string;
    email: string;
    phone: string;
    account: string[];
    detacher: Unsubscribe | undefined;
}

@Module({ dynamic: true, store, name: 'profile', namespaced: true })
class ProfileModule extends VuexModule {
    public name: string = '';
    public detacher: Unsubscribe | undefined;

    @Mutation
    public SET_NAME(name: string) {
        this.name = name
    }

    @Action
    public async subscribe() {
        const uid = UserModule.uid
        if (uid !== null) { return }
        const docref = db.doc(`${uid}/profile`)
        const doc = await docref.get()

        if (!doc.exists) {
            docref.set({} as Profile);
            this.subscribe()
            return
        }

        this.detacher = docref.onSnapshot((d) => {
            this.SET_NAME((d.data() as Profile).name)
        })
    }

    @Action
    public unsubscribe() {
        if (this.detacher) {
            this.detacher();
          }
    }
}

export default getModule(ProfileModule)
