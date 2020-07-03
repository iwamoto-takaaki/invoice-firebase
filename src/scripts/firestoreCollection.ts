import firebase from 'firebase'
import { db, functions } from '@/scripts/firebase'

export interface FirebaseObject {
    id: string
    createdAt: firebase.firestore.Timestamp
}

export default class FirebaseCollection<T extends FirebaseObject> {
    public dbpath: string
    private className: string
    private toFirebaseObject: (data: T) => object
    private toVueObject: (id: string, data: any) => T
    private collection: firebase.firestore.CollectionReference
    private detacher: firebase.Unsubscribe | undefined

    constructor(
        className: string,
        dbpath: string, toFirebaseObject: (data: T) => object,
        toVueObject: (id: string, doc: any) => T,
        ) {
        this.className = className
        this.collection = db.collection(dbpath)
        this.toFirebaseObject = toFirebaseObject
        this.toVueObject = toVueObject
        this.dbpath = dbpath
    }

    public subscribe(getSnapshot: (snapshot: T[]) => void , orderBy: string = 'createdAt') {
        this.detacher = this.collection
            .orderBy(orderBy)
            .onSnapshot((snapshot: any) => {
                getSnapshot(snapshot.docs.map((doc: any) => {
                    return this.toVueObject(doc.id, doc.data())
                }) as T[])
            });
    }

    public unsubscribe() {
        if (!this.detacher) { return }
        this.detacher()
        this.detacher = undefined
    }

    public async add(data: T): Promise<any> {
        const callable = functions.httpsCallable('add' + this.className)
        callable(data)
    }

    public async delete(data: T): Promise<void> {
        const callable = functions.httpsCallable('delete' + this.className)
        callable(data)
    }

    public async update(data: T): Promise<void> {
        const callable = functions.httpsCallable('updateCustomer' + this.className)
        callable(data)
    }
}
