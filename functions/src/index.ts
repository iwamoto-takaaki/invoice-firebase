import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
admin.initializeApp();

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
    data.createdAt = admin.firestore.Timestamp.now()
    return admin.firestore().collection(`customers/${uid}/list`).add(data)
})

export const updateCustomer = functions.https.onCall((data, context) => {
    const uid = getUid(context)
    if (!uid) { throw new Error('not authoricated!') }
    console.log(data)
    return admin.firestore().doc(`customers/${uid}/list/${data.id}`).set(data)
})

export const deleteCustomer = functions.https.onCall((data, context) => {
    const uid = getUid(context)
    if (!uid) { throw new Error('not authoricated!') }
    return admin.firestore().doc(`customers/${uid}/list/${data.id}`).delete()
})

export const addOrder = functions.https.onCall((data, context) => {
    const uid = getUid(context)
    if (!uid) { throw new Error('not authoricated!') }
    data.createdAt = admin.firestore.Timestamp.now()
    return admin.firestore().collection(`orders/${uid}/list`).add(data)
})

export const updateOrder = functions.https.onCall((data, context) => {
    const uid = getUid(context)
    if (!uid) { throw new Error('not authoricated!') }
    console.log(data)
    return admin.firestore().doc(`orders/${uid}/list/${data.id}`).set(data)
})

export const deleteOrder = functions.https.onCall((data, context) => {
    const uid = getUid(context)
    if (!uid) { throw new Error('not authoricated!') }
    return admin.firestore().doc(`orders/${uid}/list/${data.id}`).delete()
})

export const addInvoice = functions.https.onCall((data, context) => {
    const uid = getUid(context)
    if (!uid) { throw new Error('not authoricated!') }
    data.createdAt = admin.firestore.Timestamp.now()
    admin.firestore()
        .collection(`invoices/${uid}/list`)
        .add(data)
        .then((result) => {
            return { id: result.id }
        })
})

export const updateInvoice = functions.https.onCall((data, context) => {
    const uid = getUid(context)
    if (!uid) { throw new Error('not authoricated!') }
    console.log(data)
    return admin.firestore().doc(`invoices/${uid}/list/${data.id}`).set(data)
})

export const deleteInvoice = functions.https.onCall((data, context) => {
    const uid = getUid(context)
    if (!uid) { throw new Error('not authoricated!') }
    return admin.firestore().doc(`invoices/${uid}/list/${data.id}`).delete()
})
