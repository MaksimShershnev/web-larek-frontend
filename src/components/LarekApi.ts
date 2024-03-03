import { Api, ApiListResponse } from './base/api';
import { IOrder, IOrderResult, ICardItem } from '../types';

interface ILarekApi {
	getLotList: () => Promise<ICardItem[]>;
	// getLotItem: (id: string) => Promise<ICardItem>;
	// getLotUpdate: (id: string) => Promise<LotUpdate>;
	// placeBid(id: string, bid: IBid): Promise<LotUpdate>;
	// orderLots: (order: IOrder) => Promise<IOrderResult>;
}

export class LarekApi extends Api implements ILarekApi {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getLotList(): Promise<ICardItem[]> {
		return this.get('/product').then((data: ApiListResponse<ICardItem>) =>
			data.items.map((item) => ({
				...item, 
				image: this.cdn + item.image,
			}))
		);
	}
}
