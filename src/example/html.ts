/*
I needed a unique name for id and displayName
*/
import {JupyterLab, JupyterLabPlugin} from '../application';
import {IDocumentRegistry} from '../docregistry';
import {Kernel} from 'jupyter-js-services';
import {Message} from 'phosphor/lib/core/messaging';
import {Widget} from 'phosphor/lib/ui/widget';
import {ABCWidgetFactory, IDocumentModel, IDocumentContext} from '../docregistry';
import {PanelLayout} from 'phosphor/lib/ui/panel';
//import {HTML_COMMON_CLASS} from '../renderers/widget';

export const plugin: JupyterLabPlugin<void> = {
	id: 'html1',
	requires: [IDocumentRegistry],
	activate: activate,
	autoStart: true,
};

function activate(app: JupyterLab, registry: IDocumentRegistry): void {
	let options = {
		fileExtensions: ['.html'],
		defaultFor: ['.html'],
		displayName: 'HTML',
		modelName: 'text',
		preferKernel: false,
		canStartKernel: false,
	};
	registry.addWidgetFactory(new HTMLWidgetFactory(), options);
}

export class HTMLWidgetFactory extends ABCWidgetFactory<HTMLWidget, IDocumentModel> {
	createNew(context: IDocumentContext<IDocumentModel>, kernel?: Kernel.IModel): HTMLWidget {
		let widget = new HTMLWidget(context);
		this.widgetCreated.emit(widget);
		return widget;
	}
}

export class HTMLWidget extends Widget {
	private _context: IDocumentContext<IDocumentModel>;
	private _body: Widget = null;

	constructor(context: IDocumentContext<IDocumentModel>) {
		super();
		this._context = context;
		this.addClass('htmlwidget')
		this.layout = new PanelLayout();
		let layout = this.layout as PanelLayout;
		this._body = new Widget();
		//this._body.addClass(HTML_COMMON_CLASS);
		layout.addWidget(this._body);

		if (context.model.toString()) {
			this.update();
		}
		context.pathChanged.connect(() => {
			this.update();
		});
		context.model.contentChanged.connect(() => {
			this.update();
		});
		context.contentsModelChanged.connect(() => {
			this.update();
		});
	}

	dispose(): void {
		if (this.isDisposed) {
			return;
		}
		this._context = null;
		super.dispose();
	}

	protected onUpdateRequest(msg: Message): void {
		let content = this._context.model.toString();
		this._body.node.innerHTML = content;
	}
}

