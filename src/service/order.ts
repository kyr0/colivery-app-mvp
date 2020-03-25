import { injectable } from "springtype/core/di";
import { SERVICE_API_ENDPOINT } from "../config/endpoints";

@injectable
export class OrderService {

    async declide(id: string) {
        const response = await fetch(`${SERVICE_API_ENDPOINT}/order/declide?order_id=${id}`, {
            method: 'POST',
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await window.authService.getIdToken()}`
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer' // no-referrer, *client
        });
        return await response.json();
    }

    async accept(id: string) {
        const response = await fetch(`${SERVICE_API_ENDPOINT}/order/accept?order_id=${id}`, {
            method: 'POST',
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await window.authService.getIdToken()}`
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer' // no-referrer, *client
        });
        return await response.json();
    }

    async getById(id: string) {
        const response = await fetch(`${SERVICE_API_ENDPOINT}/order?order_id=${id}`, {
            method: 'GET',
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await window.authService.getIdToken()}`
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer' // no-referrer, *client
        });
        return await response.json();
    }

    async getOwnOrders() {

        return (await fetch(`${SERVICE_API_ENDPOINT}/order/own`, {
            method: 'GET',
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await window.authService.getIdToken()}`
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
        })).json();
    }

    async createOrder(order: any) {

        console.log('createOrder...', order);

        const response = await fetch(`${SERVICE_API_ENDPOINT}/order`, {
            method: 'POST',
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await window.authService.getIdToken()}`
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer', // no-referrer, *client
            body: JSON.stringify(order) // body data type must match "Content-Type" header
        });
        return await response.json();
    }
}