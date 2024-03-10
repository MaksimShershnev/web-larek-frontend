import { Model } from './base/Model';
import { FormErrors, IAppState, ICardItem, IOrder, Category } from '../types';

export type CatalogChangeEvent = {
	catalog: CardItem[];
};

export class CardItem extends Model<ICardItem> {
	id: string;
	title: string;
	description: string;
	image: string;
	category: Category;
	price: number | null;
}

export class AppState extends Model<IAppState> {
	catalog: ICardItem[];
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
		this.catalog = items.map((item) => new CardItem(item, this.events));
		this.emitChanges('cards:changed', { catalog: this.catalog });
	}

	setPreview(item: ICardItem) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	setButtonText(item: ICardItem) {
		if (this.order.items.some((id) => id === item.id)) {
			return 'Удалить';
		} else return 'В корзину';
	}

	getCardsInOrder(): ICardItem[] {
		let array: ICardItem[] = [];
		this.order.items.forEach((id) => {
			array.push(this.catalog.find((item) => item.id === id));
		});
		return array;
	}

	getBasketItemIndex(item: ICardItem): number {
		return this.order.items.indexOf(item.id) + 1;
	}

	toggleCardOrder(item: ICardItem) {
		if (!this.order.items.some((id) => id === item.id)) {
			this.order.items = [...this.order.items, item.id];
			this.emitChanges('basket:changed');
		} else {
			this.deleteCardFromOrder(item);
		}
	}

	deleteCardFromOrder(item: ICardItem) {
		if (this.order.items.some((id) => id === item.id)) {
			this.order.items = this.order.items.filter((id) => item.id !== id);
			this.emitChanges('basket:changed');
		}
		return;
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
	}

	getTotal() {
		this.order.total = this.order.items.reduce(
			(a, c) => a + this.catalog.find((it) => it.id === c).price,
			0
		);
		return this.order.total;
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
