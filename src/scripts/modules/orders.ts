import firebaseCollection, { FirebaseObject } from '@/scripts/firestoreCollection';
import firebase from 'firebase'
import { fromDateToString } from '@/scripts/helper'

export interface Order extends FirebaseObject {
    id: string,
    createdAt: firebase.firestore.Timestamp,
    mode: 'show' | 'edit' | 'new' | 'uploading' | 'header' | undefined,
    customerId: string,
    customerName: string,
    orderDate: Date,
    title: string,
    unitPrice: number,
    quantity: number,
}

export function initOrder(): Order {
    return {
        id: '',
        createdAt: firebase.firestore.Timestamp.now(),
        mode: 'new',
        customerId: '',
        customerName: '',
        orderDate: new Date(),
        title: '',
        unitPrice: 0,
        quantity: 1,
    }
}

export function getOrderCollection(userId: string) {
    const toFirebaseObject = (order: Order): any => {
        return {
            id: order.id,
            createdAt: order.createdAt,
            customerId: order.customerId,
            customerName: order.customerName,
            orderDate: fromDateToString(order.orderDate),
            title: order.title,
            unitPrice: order.unitPrice,
            quantity: order.quantity,
        }
    }

    const toVueObject = (id: string, data: any): Order => {
        return {
            id,
            createdAt: data.createdAt,
            mode: 'show',
            customerId: data.customerId,
            customerName: data.customerName,
            orderDate: new Date(data.orderDate),
            title: data.title,
            unitPrice: data.unitPrice,
            quantity: data.quantity,
        }
    }

    return new firebaseCollection<Order>('Order', `orders/${userId}/list`, toFirebaseObject, toVueObject)
}
