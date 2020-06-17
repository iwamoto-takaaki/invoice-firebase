import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
admin.initializeApp();



export const helloWorld = functions.https.onCall((data, context) => {
    return {data: 'hello world'}
})

const getUid = (context: functions.https.CallableContext): string | null => {
    if (!context.auth) { return null }
    if (!context.auth.uid) { return null }
    return context.auth.uid
}

export const updateProfile = functions.https.onCall((data, context) => {
    const uid = getUid(context)
    if (!uid) { throw new Error('not authoricated!') }
    return admin.firestore().doc(`profile/${uid}`).update(data)
})

export const addCustomer = functions.https.onCall((data, context) => {
    const uid = getUid(context)
    if (!uid) { throw new Error('not authoricated!') }
    return admin.firestore().doc(`customers/${uid}`).create(data)
})

export const updateCustomer = functions.https.onCall((data, context) => {
    const uid = getUid(context)
    if (!uid) { throw new Error('not authoricated!') }
    return admin.firestore().doc(`customers/${uid}/${data.id}`).update(data)
})

export const deleteCustomer = functions.https.onCall((data, context) => {
    const uid = getUid(context)
    if (!uid) { throw new Error('not authoricated!') }
    return admin.firestore().doc(`customers/${uid}/${data.id}`).delete()
})
