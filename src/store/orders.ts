import * as firebase from 'firebase'

export interface Order {
    id: string,
    createdAt: any,
    customerId: string,
    customerName: string,
    orderDate: Date,
    title: string,
    unitPrice: number,
    quantity: number,
}
