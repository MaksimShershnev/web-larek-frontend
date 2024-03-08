import './scss/styles.scss';

import { API_URL, CDN_URL } from './utils/constants';
import { LarekApi } from './components/LarekApi';
import { EventEmitter } from './components/base/events';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { AppState, CatalogChangeEvent } from './components/AppData';
import { Page } from './components/Page';
import { Card, BasketItem } from './components/Card';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { ICardItem } from './types';
import { Order } from './components/Order';

const events = new EventEmitter();
const api = new LarekApi(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

// Шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);

// Изменились элементы каталога
events.on<CatalogChangeEvent>('cards:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			id: item.id,
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price,
		});
	});
});

// Отправить в превью карточку
events.on('card:select', (item: ICardItem) => {
	appData.setPreview(item);
});

// Изменен открытый выбранный лот
events.on('preview:changed', (item: ICardItem) => {
	const card = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			events.emit('card:toBasket', item);
			events.emit('preview:changed', item);
		},
	});
	modal.render({
		content: card.render({
			title: item.title,
			image: item.image,
			description: item.description,
			price: item.price,
			category: item.category,
			buttonName: appData.setButtonText(item),
		}),
	});
});

events.on('basket:changed', () => {
	page.counter = appData.getCardsInOrder().length;
	basket.items = appData.getCardsInOrder().map((item) => {
		const basketItem = new BasketItem(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				events.emit('card:fromBasket', item);
			},
		});

		basketItem.index = appData.getBasketItemIndex(item);

		return basketItem.render({
			title: item.title,
			price: item.price,
		});
	});
	basket.total = appData.getTotal();
});

events.on('card:toBasket', (item: ICardItem) => {
	appData.toggleCardOrder(item);
});

events.on('card:fromBasket', (item: ICardItem) => {
	appData.deleteCardFromOrder(item);
});

// Открыть корзину
events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});

// Открыть форму заказа
events.on('order:open', () => {
	modal.render({
		content: order.render({
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

api
	.getCardList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});
