import firebase from 'firebase'
import { db, functions } from '@/scripts/firebase'

export interface FirebaseObject {
    id: string
    createdAt: firebase.firestore.Timestamp
}

export class FirebaseReference<T extends FirebaseObject, R> {
    protected className: string
    protected toFirebaseObject: (data: T) => object
    protected toVueObject: (id: string, data: any) => T
    protected reference: R
    protected detacher: firebase.Unsubscribe | undefined

    constructor(
        className: string,
        reference: R,
        toFirebaseObject: (data: T) => object,
        toVueObject: (id: string, doc: any) => T,
        ) {
        this.className = className
        this.reference = reference
        this.toFirebaseObject = toFirebaseObject
        this.toVueObject = toVueObject
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
        const callable = functions.httpsCallable('update' + this.className)
        callable(data)
    }
}

export class FirebaseCollection<T extends FirebaseObject>
    extends FirebaseReference<T, firebase.firestore.CollectionReference> {
    constructor(
        className: string,
        dbpath: string, toFirebaseObject: (data: T) => object,
        toVueObject: (id: string, doc: any) => T,
    ) {
        super(className, db.collection(dbpath), toFirebaseObject, toVueObject)
    }

    public subscribe(onSnapshot: (snapshot: T[]) => void , orderBy: string = 'createdAt') {
        super.detacher = super.reference
            .orderBy(orderBy)
            .onSnapshot((snapshot: any) => {
                onSnapshot(snapshot.docs.map((doc: any) => {
                    return super.toVueObject(doc.id, doc.data())
                }) as T[])
            });
    }
}

export class FirebaseDocument<T extends FirebaseObject>
    extends FirebaseReference<T, firebase.firestore.DocumentReference> {
    constructor(
        className: string,
        dbpath: string, toFirebaseObject: (data: T) => object,
        toVueObject: (id: string, doc: any) => T,
    ) {
        super(className, db.doc(dbpath), toFirebaseObject, toVueObject)
    }

    public subscribe(getSnapshot: (snapshot: T) => void) {
        super.detacher = (super.reference as firebase.firestore.DocumentReference)
            .onSnapshot((doc: any) => {
                getSnapshot(super.toVueObject(doc.id, doc.data()) as T)
            })
    }
}
