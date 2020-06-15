import store from '@/store/index'
import ProfileModule from '@/store/profile'
import { Module, VuexModule, Action, Mutation, getModule, MutationAction } from 'vuex-module-decorators';
import { User, Unsubscribe } from 'firebase';
import { auth } from '@/scripts/firebase';

@Module({ dynamic: true, store, namespaced: true, name: 'user' })
class UserModule extends VuexModule {
    public get name() {
        return this.user?.displayName;
    }

    public get authorized(): boolean {
        return this.user !== null
    }

    public get uid(): null | string {
        return this.user ? this.user.uid : null
    }
    public user: User | null | undefined = null
    public status: null | 'Loading' | 'Ready' = null
    private detacher: Unsubscribe | undefined = undefined

    @Mutation
    public SET_STATUS(status: null | 'Loading' | 'Ready') {
        this.status = status;
    }

    @Mutation
    public SET_DETACHER(detacher: Unsubscribe | undefined) {
        this.detacher = detacher;
    }

    @Action
    public async logout() {
        await auth.signOut()
        this.SET_STATUS(null)
    }

    @Action
    public async subscribe() {
        this.SET_STATUS('Loading')
        const detacher = auth.onAuthStateChanged((user) => {
            this.LOGIN(user)
            this.SET_STATUS(user === null ? null : 'Ready')
            ProfileModule.subscribe()
        },
            (err) => { console.error(err) },
        )

        this.SET_DETACHER(detacher)
    }

    @Action
    public unsubscribe() {
        if (this.detacher) {
            this.detacher();
          }
    }

    @Mutation
    private LOGIN(user: User | null) {
        this.user = user;
    }
}

export default getModule(UserModule)
