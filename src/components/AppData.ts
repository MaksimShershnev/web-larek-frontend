// import _ from "lodash";
// import {dayjs, formatNumber} from "../utils/utils";

import { Model } from './base/Model';
import {
	FormErrors,
	IAppState,
	ICardItem,
	IOrder,
	IOrderContacts,
	Category,
} from '../types';

export type CatalogChangeEvent = {
	catalog: ICardItem[];
};

export class CardItem extends Model<ICardItem> {
	id: string;
	title: string;
	description: string;
	image: string;
	category: Category;
	price: number | null;
}
//
// isInBasket: boolean = false;

// addToBasket() {
// 	this.isInBasket = true;
// 	this.emitChanges('basket:changed', {
// 		id: this.id,
// 		title: this.title,
// 		price: this.price,
// 	});
// }

// protected myLastBid: number = 0;

// clearBid() {
//     this.myLastBid = 0;
// }

// placeBid(price: number): void {
//     this.price = price;
//     this.history = [...this.history.slice(1), price];
//     this.myLastBid = price;

//     if (price > (this.minPrice * 10)) {
//         this.status = 'closed';
//     }
//     this.emitChanges('auction:changed', { id: this.id, price });
// }

// get isMyBid(): boolean {
//     return this.myLastBid === this.price;
// }

// get isParticipate(): boolean {
//     return this.myLastBid !== 0;
// }

// get statusLabel(): string {
//     switch (this.status) {
//         case "active":
//             return `Открыто до ${dayjs(this.datetime).format('D MMMM [в] HH:mm')}`
//         case "closed":
//             return `Закрыто ${dayjs(this.datetime).format('D MMMM [в] HH:mm')}`
//         case "wait":
//             return `Откроется ${dayjs(this.datetime).format('D MMMM [в] HH:mm')}`
//         default:
//             return this.status;
//     }
// }

// get timeStatus(): string {
//     if (this.status === 'closed') return 'Аукцион завершен';
//     else return dayjs
//         .duration(dayjs(this.datetime).valueOf() - Date.now())
//         .format('D[д] H[ч] m[ мин] s[ сек]');
// }

// get auctionStatus(): string {
//     switch (this.status) {
//         case 'closed':
//             return `Продано за ${formatNumber(this.price)}₽`;
//         case 'wait':
//             return 'До начала аукциона';
//         case 'active':
//             return 'До закрытия лота';
//         default:
//             return '';
//     }
// }

// get nextBid(): number {
//     return Math.floor(this.price * 1.1);
// }
// }

export class AppState extends Model<IAppState> {
	// basket: string[] = [];
	catalog: ICardItem[];
	cardIndex: number = 0;
	// loading: boolean;
	order: IOrder = {
		email: '',
		phone: '',
		payment: 'online',
		address: '',
		total: 0,
		items: [],
	};
	preview: string | null;
	formErrors: FormErrors = {};

	// addToBasket(item: ICardItem) {
	// 	if (!this.basket.some((id) => id === item.id)) {
	// 		this.basket.push(item.id);
	// 		this.emitChanges('basket:changed', {
	// 			// id: this.id,
	// 			// title: this.title,
	// 			// price: this.price,
	// 		});
	// 		console.log('Товар добавлен в корзину');
	// 	}
	// 	return;
	// }

	setCatalog(items: ICardItem[]) {
		this.catalog = items.map((item) => new CardItem(item, this.events));
		this.emitChanges('cards:changed', { catalog: this.catalog });
	}

	setPreview(item: ICardItem) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
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

	addCardToOrder(item: ICardItem) {
		if (!this.order.items.some((id) => id === item.id)) {
			this.order.items = [...this.order.items, item.id];
			this.emitChanges('basket:changed');
		}
		return;
	}

	deleteCardFromOrder(item: ICardItem) {
		if (this.order.items.some((id) => id === item.id)) {
			this.order.items = this.order.items.filter((id) => item.id !== id);
			this.emitChanges('basket:changed');
			console.log('Удалено');
		}
		return;
	}

	getTotal() {
		return this.order.items.reduce(
			(a, c) => a + this.catalog.find((it) => it.id === c).price,
			0
		);
	}

	// setOrderField(field: keyof IOrderContacts, value: string) {
	//     this.order[field] = value;

	//     if (this.validateOrder()) {
	//         this.events.emit('order:ready', this.order);
	//     }
	// }

	// validateOrder() {
	//     const errors: typeof this.formErrors = {};
	//     if (!this.order.email) {
	//         errors.email = 'Необходимо указать email';
	//     }
	//     if (!this.order.phone) {
	//         errors.phone = 'Необходимо указать телефон';
	//     }
	//     this.formErrors = errors;
	//     this.events.emit('formErrors:change', this.formErrors);
	//     return Object.keys(errors).length === 0;
	// }
}
