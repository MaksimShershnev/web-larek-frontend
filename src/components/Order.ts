import { Form } from './common/Form';
import { IOrderPayments } from '../types';
import { EventEmitter, IEvents } from './base/events';

export class Order extends Form<IOrderPayments> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}

	// set email(value: string) {
	// 	(this.container.elements.namedItem('email') as HTMLInputElement).value =
	// 		value;
	// }
}
