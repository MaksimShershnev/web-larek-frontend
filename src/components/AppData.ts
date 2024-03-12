import { Model } from './base/Model';
import { FormErrors, IAppState, ICardItem, IOrder } from '../types';

export type CatalogChangeEvent = {
	catalog: ICardItem[];
};

export class AppState extends Model<IAppState> {
	catalog: ICardItem[] = [];
	basket: ICardItem[] = [];
	order: IOrder = {
		email: '',
		phone: '',
		payment: '',
		address: '',
		total: 0,
		items: [],
	};
	preview: string | null;
	formErrors: FormErrors = {};

	setOrderPayment(value: string) {
		if (this.order.payment !== value) this.order.payment = value;
	}

	setOrderAddress(value: string) {
		this.order.address = value;
	}

	setCatalog(items: ICardItem[]) {
		items.map((item) => (this.catalog = [...this.catalog, item]));
		this.emitChanges('cards:changed', { catalog: this.catalog });
	}

	setPreview(item: ICardItem) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	setButtonText(item: ICardItem) {
		if (this.basket.some((card) => card.id === item.id)) {
			return 'Убрать';
		} else return 'В корзину';
	}

	getCardsInBasket(): ICardItem[] {
		return this.basket;
	}

	getBasketItemIndex(item: ICardItem): number {
		return this.basket.indexOf(item) + 1;
	}

	toggleCardInBasket(item: ICardItem) {
		if (!this.basket.some((card) => card.id === item.id)) {
			this.basket = [...this.basket, item];
			this.emitChanges('basket:changed');
		} else {
			this.deleteCardFromBasket(item);
		}
	}

	deleteCardFromBasket(item: ICardItem) {
		if (this.basket.some((card) => card.id === item.id)) {
			this.basket = this.basket.filter((card) => item.id !== card.id);
			this.emitChanges('basket:changed');
		}
		return;
	}

	sendCardsInOrder() {
		this.basket.forEach(
			(card) => (this.order.items = [...this.order.items, card.id])
		);
		this.order.total = this.getTotal();
	}

	clearBasket() {
		this.order = {
			email: '',
			phone: '',
			payment: '',
			address: '',
			total: 0,
			items: [],
		};
		this.basket = [];
		this.emitChanges('basket:changed');
	}

	getTotal() {
		let total = 0;
		this.basket.forEach((card) => (total += card.price));
		return total;
	}

	setOrderField(
		field: keyof Pick<IOrder, 'address' | 'phone' | 'email'>,
		value: string
	) {
		this.order[field] = value;
		this.validateOrder();
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}

		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}

		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес доставки';
		}

		if (!this.order.payment) {
			errors.payment = 'Необходимо указать способ оплаты';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
