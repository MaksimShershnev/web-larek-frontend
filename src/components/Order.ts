import { Form } from './common/Form';
import { IOrderPayments, IOrderContacts } from '../types';
import { IEvents } from './base/events';

export class OrderPayments extends Form<IOrderPayments> {
	protected _cardButton: HTMLButtonElement;
	protected _cashButton: HTMLButtonElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._cardButton = this.container.elements.namedItem(
			'card'
		) as HTMLButtonElement;
		this._cashButton = this.container.elements.namedItem(
			'cash'
		) as HTMLButtonElement;

		if (this._cardButton) {
			this._cardButton.addEventListener('click', () => {
				events.emit(`order:change payment`, {
					payment: this._cardButton.name,
					button: this._cardButton,
				});
			});
		}

		if (this._cashButton) {
			this._cashButton.addEventListener('click', () => {
				events.emit(`order:change payment`, {
					payment: this._cashButton.name,
					button: this._cashButton,
				});
			});
		}
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}

	togglePayment(value: HTMLElement) {
		this.cancelPayment();
		this.toggleClass(value, 'button_alt-active', true);
	}

	cancelPayment() {
		this.toggleClass(this._cardButton, 'button_alt-active', false);
		this.toggleClass(this._cashButton, 'button_alt-active', false);
	}
}

export class OrderContacts extends Form<IOrderContacts> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}
}
