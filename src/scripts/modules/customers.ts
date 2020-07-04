import { FirebaseCollection, FirebaseObject } from '@/scripts/firestoreReference';

export interface Customer extends FirebaseObject {
    id: string,
    createdAt: firebase.firestore.Timestamp,
    name: string,
}

export function getCustomerCollection(userId: string) {
    const toFirebaseObject = (customer: Customer): any => {
        return {
            id: customer.id,
            createdAt: customer.createdAt,
            name: customer.name,
        }
    }

    const toVueObject = (id: string, data: any): Customer => {
        return {
            id,
            createdAt: data.createdAt,
            name: data.name,
        }
    }

    return new FirebaseCollection<Customer>('Customer', `customers/${userId}/list`, toFirebaseObject, toVueObject)
}
