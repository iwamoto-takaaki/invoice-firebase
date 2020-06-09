import { Module, VuexModule, getModule, Mutation, Action } from 'vuex-module-decorators'
import store from '@/store/index'
import UserModule from '@/store/user'
import { Unsubscribe } from 'firebase'
import { db } from '@/scripts/firebase'

export interface Profile {
    name: string;
    address: string;
    email: string;
    phone: string;
    account: string[];
}

@Module({ dynamic: true, store, name: 'profile', namespaced: true })
class ProfileModule extends VuexModule {
    public data: Profile | null = null;
    private detacher: Unsubscribe | undefined = undefined;

    @Mutation
    public SET_PROFILE(profile: Profile) {
        this.data = profile
    }

    @Action
    public subscribe() {
        this.detacher = db.doc(`${UserModule.user?.uid}/profile`).onSnapshot((doc) => {
            return doc.data() as Profile;
        });
    }

    @Action
    public unsubscribe() {
        if (this.detacher) {
            this.detacher();
          }
    }
}

export default getModule(ProfileModule)
