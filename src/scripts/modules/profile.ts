import { FirebaseDocument, FirebaseObject } from '@/scripts/firestoreReference';
import firebase from 'firebase'

export interface Profile extends FirebaseObject {
    id: string,
    createdAt: firebase.firestore.Timestamp,
    name: string,
    address: string,
    email: string,
    phone: string,
    account: string,
}

export function getProfile(userId: string) {
    const toFirebaseObject = (profile: Profile): any => {
        return {
            id: profile.id,
            createdAt: profile.createdAt,
            name: profile.name,
            address: profile.address,
            email: profile.email,
            phone: profile.phone,
            account: profile.account,
        }
    }

    const toVueObject = (id: string, data: any): Profile => {
        return {
            id,
            createdAt: data.createdAt,
            name: data.name,
            address: data.address,
            email: data.email,
            phone: data.phone,
            account: data.account,
        }
    }

    return new FirebaseDocument<Profile>('Profile', `profiles/${userId}`, toFirebaseObject, toVueObject)
}
