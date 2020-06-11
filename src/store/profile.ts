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
    account: string;
}

const generateProfile = (): Profile => {
    return {
        name: '',
        address: '',
        email: '',
        phone: '',
        account: '',
    }
}

@Module({ dynamic: true, store, name: 'profile', namespaced: true })
class ProfileModule extends VuexModule {
    public profile: Profile | null = null
    public detacher: Unsubscribe | undefined;

    @Mutation
    public SET_PROFILE(profile: Profile | null) {
        this.profile = profile
    }

    @Action
    public async subscribe() {
        const uid = UserModule.uid
        if (uid === null) { return }
        const docref = db.doc(`${uid}/profile`)
        const doc = await docref.get()

        if (!doc.exists) {
            const prof = generateProfile()
            if (UserModule.name) { prof.name = UserModule.name }
            docref.set(prof);
            this.subscribe()
            return
        }

        this.detacher = docref.onSnapshot((d) => {
            this.SET_PROFILE((d.data() as Profile))
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
