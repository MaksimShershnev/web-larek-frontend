export type Category =
	| 'софт-скил'
	| 'другое'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';

export interface IProductItem {
	id: string;
	description?: string;
	image: string;
	title: string;
	category: Category;
	price: string | null;
}

export type IBasketItem = Pick<IProductItem, 'id' | 'title' | 'price'>;

export interface IProductList {
	total: number;
	items: IProductItem[];
}

export interface IOrderForm {
	email: string;
	phone: string;
}

export interface IOrder extends IOrderForm {
	payment: string;
	address: string;
	total: number;
	items: string[];
}

export interface IOrderResult {
	id: string;
	total: number;
}
