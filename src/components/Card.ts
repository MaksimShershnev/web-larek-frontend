import { Component } from './base/Component';
import { ICardItem } from '../types';
import { bem, createElement, ensureElement } from '../utils/utils';
// import clsx from "clsx";

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

// export interface ICard<T> {
//     title: string;
//     description?: string | string[];
//     image: string;
// }

export class Card extends Component<ICardItem> {
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	// protected _description?: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _category: HTMLSpanElement;
	protected _price: HTMLSpanElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.card__title`, container);
		this._image = ensureElement<HTMLImageElement>(`.card__image`, container);
		this._button = container.querySelector(`.card__button`);
		this._category = ensureElement<HTMLSpanElement>(
			`.card__category`,
			container
		);
		this._price = ensureElement<HTMLSpanElement>(`.card__price`, container);
		// this._description = container.querySelector(`.card__description`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set category(value: string) {
		this.setText(this._category, value);
	}

	get category(): string {
		return this._category.textContent || '';
	}

	set price(value: string) {
		this.setText(this._price, `${value} синапсов`);
	}

	get price(): string {
		return this._price.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	// set description(value: string | string[]) {
	//     if (Array.isArray(value)) {
	//         this._description.replaceWith(...value.map(str => {
	//             const descTemplate = this._description.cloneNode() as HTMLElement;
	//             this.setText(descTemplate, str);
	//             return descTemplate;
	//         }));
	//     } else {
	//         this.setText(this._description, value);
	//     }
	// }
}

// export type CatalogItemStatus = {
//     status: LotStatus,
//     label: string
// };

// export class CatalogItem extends Card<CatalogItemStatus> {
//     protected _status: HTMLElement;

//     constructor(container: HTMLElement, actions?: ICardActions) {
//         super('card', container, actions);
//         this._status = ensureElement<HTMLElement>(`.card__status`, container);
//     }

//     set status({ status, label }: CatalogItemStatus) {
//         this.setText(this._status, label);
//         this._status.className = clsx('card__status', {
//             [bem(this.blockName, 'status', 'active').name]: status === 'active',
//             [bem(this.blockName, 'status', 'closed').name]: status === 'closed'
//         });
//     }
// }
