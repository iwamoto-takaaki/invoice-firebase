import { Customer } from '@/store/customers'
import { Order } from '@/store/orders'

export interface Invoice {
    id: string,
    createdAt: Date | null,
    customer: Customer | undefined,
    title: string,
    orders: Order[],
    issueDate: Date | null,
    dueDate: Date | null,
    taxrate: number
    totalPrice: number,
}
