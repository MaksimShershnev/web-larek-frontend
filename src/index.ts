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

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

api
	.getLotList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});
