import { st } from "springtype/core";
import { component, state } from "springtype/web/component";
import { ILifecycle } from "springtype/web/component/interface/ilifecycle";
import tpl from "./driver-order-detail.tpl";
import "./driver-order-detail.scss";
import { context } from "springtype/core/context/context";
import { ORDER_CONTEXT, getOrderContext } from "../../context/order";
import { MatModal } from "../../component/mat/mat-modal";
import { ref } from "springtype/core/ref";
import {OlMap} from "../../component/ol-map/ol-map";
import { inject } from "springtype/core/di";
import { OrderService } from "../../service/order";
import { DriverOrderList } from "../driver/driver-order-list/driver-order-list";

@component({
    tpl
})
export class DriverOrderDetailPage extends st.component implements ILifecycle {

    static ROUTE = "driver-order-detail/:id";

    @ref
    confirmDeleteItemModal: MatModal;
    
    @ref
    mapRef: OlMap;

    @state
    orderState: any = {};

    @context(ORDER_CONTEXT)
    orderContext: any = getOrderContext();

    @inject(OrderService)
    orderService: OrderService;

    customerContext: any = null;

    onCheckboxDoneChance(evt: MouseEvent) {

        const id = (evt.target as HTMLInputElement).closest('tr').getAttribute('data-id');
        const checked = (evt.target as HTMLInputElement).checked;
        
        console.log('onCheckboxDoneChance', id, checked);
    }

    onRouteEnter() {
        this.orderState.id = st.route.params.id;
    }

    onDeleteButtonClick = (evt: MouseEvent) => {

        const orderItemId = (evt.target as HTMLElement).closest('tr').getAttribute('data-id');

        console.log('Delete item', orderItemId);

        this.confirmDeleteItemModal.toggle();
    };

    onAcceptOrderClick = async() => {

        const user = await this.orderService.accept(this.orderContext.id);

        this.customerContext = user;

        this.doRender();
    };

    onDeclideOrderClick = async() => {
        
        await this.orderService.declide(this.orderContext.id);

        st.route = {
            path: DriverOrderList.ROUTE
        }
    }

    getStatusText(status: string) {
        switch (status) {
            case "accepted":
                return "Auf dem Weg zu Dir";
            case "to_be_delivered":
                return "Bisher kein Fahrer gefunden";
            case "delivered":
                return "Erfolgreich geliefert";
            case "consumer_canceled":
                return "Abbruch durch Dich";
        }
    }

    getStatusEmoji(itemStatus: string) {
        switch(itemStatus) {
            case "todo":
                return "⏳";
            case "done":
                return "✅";
        }
    }
}