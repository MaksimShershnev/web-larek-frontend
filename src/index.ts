import './scss/styles.scss';

import { API_URL, CDN_URL } from './utils/constants';
import { LarekApi } from './components/LarekApi';
import { EventEmitter } from './components/base/events';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { AppState, CatalogChangeEvent, CardItem } from './components/AppData';
import { Page } from './components/Page';
import { Card } from './components/Card';
import { Modal } from './components/common/Modal';

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

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Изменились элементы каталога
events.on<CatalogChangeEvent>('cards:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		// console.log(card);
		return card.render({
			id: item.id,
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price,
		});
	});

	// page.counter = appData.catalog.length;
});

// Отправить в превью карточку
events.on('card:select', (item: CardItem) => {
	appData.setPreview(item);
});

// Изменен открытый выбранный лот
events.on('preview:changed', (item: CardItem) => {
	// const showItem = (item: CardItem) => {
	const card = new Card(cloneTemplate(cardPreviewTemplate));
	// const auction = new Auction(cloneTemplate(auctionTemplate), {
	// 		onSubmit: (price) => {
	// 				item.placeBid(price);
	// 				auction.render({
	// 						status: item.status,
	// 						time: item.timeStatus,
	// 						label: item.auctionStatus,
	// 						nextBid: item.nextBid,
	// 						history: item.history
	// 				});
	// 		}
	// });

	modal.render({
		content: card.render({
			title: item.title,
			image: item.image,
			description: item.description,
			price: item.price,
			category: item.category,
			// id: item.id
			// description: item.description.split("\n"),
			// status: auction.render({
			// 		status: item.status,
			// 		time: item.timeStatus,
			// 		label: item.auctionStatus,
			// 		nextBid: item.nextBid,
			// 		history: item.history
			// })
		}),
	});
	// };
	// showItem(item);
	// 	if (item) {
	// 		api.getLotItem(item.id)
	// 				.then((result) => {
	// 						item.description = result.description;
	// 						item.history = result.history;
	// 						showItem(item);
	// 				})
	// 				.catch((err) => {
	// 						console.error(err);
	// 				})
	// } else {
	// 		modal.close();
	// }
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
