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
	buttonName?: string;
}

export interface ICardList {
	total: number;
	items: ICardItem[];
}

export interface IOrderContacts {
	email: string;
	phone: string;
}

export interface IOrderPayments {
	payment: string;
	address: string;
}

export interface IOrder extends IOrderContacts, IOrderPayments {
	total: number;
	items: string[];
}

export interface IOrderResult {
	id: string;
	total: number;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IAppState {
	catalog: ICardItem[];
	preview: string | null;
	order: IOrder | null;
}
