import { VuexModule, Module, Mutation, Action, getModule, MutationAction } from 'vuex-module-decorators'
import store from '@/store/index'
import firebase from 'firebase'

export interface FirebaseResult {
    from: string,
    method: string,
    firebaseResult: firebase.functions.HttpsCallableResult | null,
}

@Module({ dynamic: true, store, name: 'common', namespaced: true })
class CommonMudule extends VuexModule {
    // for debug
    public firebaseResult: FirebaseResult | null = null

    @Mutation
    public SET_FIREBASE_RESULT(result: FirebaseResult) {
        this.firebaseResult = result
    }

    @Action
    public setFirebaseResult(
        from: string,
        method: string,
        firebaseResult: firebase.functions.HttpsCallableResult | null) {
        this.SET_FIREBASE_RESULT({ from, method, firebaseResult } as FirebaseResult)
    }
}

export default getModule(CommonMudule)
