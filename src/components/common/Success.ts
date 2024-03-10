import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

interface ISuccess {
	total: number;
}

interface ISuccessActions {
	onClick: () => void;
}

export class Success extends Component<ISuccess> {
    protected _description: HTMLParagraphElement;
	protected _close: HTMLElement;

	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);

        this._description = ensureElement<HTMLParagraphElement>(`.order-success__description`, container);
		this._close = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		);

		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}
	}

    set total(value: string) {
        this.setText(this._description, `Списано ${value} синапсов`);
    }
}
