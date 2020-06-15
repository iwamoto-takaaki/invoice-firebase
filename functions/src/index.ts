import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
admin.initializeApp();

export const helloWorld = functions.https.onCall((data, context) => {
    return {data: 'hello world'}
})

export const updateProfile = functions.https.onCall((data, context) => {
    console.log(data)
    if (!context.auth || context.auth.uid === null) {
        throw new Error('not authricated!')
    }

    return admin.firestore().doc(`profile/${context.auth.uid}`).update(data)
})
