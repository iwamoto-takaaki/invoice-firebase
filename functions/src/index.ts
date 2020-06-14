import * as functions from 'firebase-functions'

export const helloWorld = functions.https.onCall((data, context) => {
    return {data: 'hello world'}
})

export const updateProfile = functions.https.onCall((data, context) => {
    console.log(data)
    return 'updata Profile called!'
})
