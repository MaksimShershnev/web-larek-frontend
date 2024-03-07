export enum Category {
	'софт-скил',
	'другое',
	'дополнительное',
	'кнопка',
	'хард-скил',
}

export interface ICardItem {
	id: string;
	title: string;
	description?: string;
	image?: string;
	category?: Category;
	price: number | null;
	index?: number;
	// isInBasket?: boolean;
	// deleteCard:(id: string) => void;
	// addCard: (id: string) => void;
}

export interface ICardList {
	total: number;
	items: ICardItem[];
}

// export interface IBasket {
// 	items: IBasketItem[];
// 	total: number;
// }

export interface IOrderContacts {
	email: string;
	phone: string;
}

export interface IOrder extends IOrderContacts {
	payment: 'online' | 'offline';
	address: string;
	total: number;
	items: string[];
}

export interface IOrderResult {
	id: string;
	total: number;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IAppState {
	// basket: string[];
	catalog: ICardItem[];
	preview: string | null;
	order: IOrder | null;
}
