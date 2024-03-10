import { Component } from './base/Component';
import { ICardItem } from '../types';
import { ensureElement } from '../utils/utils';
import { categoryMap } from '../utils/constants';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export class Card extends Component<ICardItem> {
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _description?: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _category: HTMLSpanElement;
	protected _price: HTMLSpanElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.card__title`, container);
		this._image = container.querySelector(`.card__image`);
		this._button = container.querySelector(`.card__button`);
		this._category = container.querySelector(`.card__category`);
		this._price = ensureElement<HTMLSpanElement>(`.card__price`, container);
		this._description = container.querySelector(`.card__text`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set buttonName(value: string) {
		this.setText(this._button, value);
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

	set description(value: string) {
		this.setText(this._description, value);
	}

	get description(): string {
		return this._description.textContent || '';
	}

	set category(value: string) {
		this.setText(this._category, value);
		this.toggleClass(this._category, categoryMap.get(value), true);
	}

	get category(): string {
		return this._category.textContent || '';
	}

	set price(value: string) {
		if (value) {
			this.setText(this._price, `${value} синапсов`);
		} else {
			this.setText(this._price, `Бесценно`);
			this.setDisabled(this._button, true);
		}
	}

	get price(): string {
		return this._price.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}
}

export class BasketItem extends Card {
	protected _index: HTMLElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _deleteButton: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container, actions);

		this._index = ensureElement<HTMLElement>(
			'.basket__item-index',
			this.container
		);
		this._title = ensureElement<HTMLElement>('.card__title', this.container);
		this._price = ensureElement<HTMLElement>('.card__price', this.container);
		this._deleteButton = ensureElement<HTMLButtonElement>(
			'.basket__item-delete',
			this.container
		);
	}

	set index(index: number) {
		this.setText(this._index, index);
	}
}
