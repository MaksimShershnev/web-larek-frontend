import './scss/styles.scss';

import { API_URL, CDN_URL } from './utils/constants';
import { LarekApi } from './components/LarekApi';
import { EventEmitter } from './components/base/events';
import { cloneTemplate, ensureElement } from './utils/utils';
import { AppState, CatalogChangeEvent } from './components/AppData';
import { Page } from './components/Page';
import { Card, BasketItem } from './components/Card';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { ICardItem, IOrder } from './types';
import { OrderPayments, OrderContacts } from './components/Order';
import { Success } from './components/common/Success';

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
const OrderPaymentsTemplate = ensureElement<HTMLTemplateElement>('#order');
const OrderContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderPayments = new OrderPayments(
	cloneTemplate(OrderPaymentsTemplate),
	events
);
const orderContacts = new OrderContacts(
	cloneTemplate(OrderContactsTemplate),
	events
);

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
	orderPayments.cancelPayment();
	modal.render({
		content: orderPayments.render({
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// Переключение вида оплаты товара
events.on(
	'order:change payment',
	(data: { payment: string; button: HTMLElement }) => {
		appData.setOrderPayment(data.payment);
		orderPayments.togglePayment(data.button);
		appData.validateOrder();
	}
);

// Открытие формы контактов заказа
events.on('order:submit', () => {
	modal.render({
		content: orderContacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

// Отправлена форма заказа
events.on('contacts:submit', () => {
	api
		.orderProducts(appData.order)
		.then((result) => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});
			modal.render({
				content: success.render({
					total: result.total,
				}),
			});

			appData.clearBasket();
			events.emit('basket:changed');
		})
		.catch((err) => {
			console.error(err);
		});
});

// Изменилось одно из полей input
events.on(
	/^order\..*:change/,
	(data: {
		field: keyof Pick<IOrder, 'address' | 'phone' | 'email'>;
		value: string;
	}) => {
		appData.setOrderField(data.field, data.value);
	}
);

// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<IOrder>) => {
	const { address, payment, phone, email } = errors;
	orderPayments.valid = !payment && !address;
	orderPayments.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
	orderContacts.valid = !phone && !email;
	orderContacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
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
