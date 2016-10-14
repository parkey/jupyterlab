import {JupyterLab, JupyterLabPlugin} from '../application';
import {ICommandPalette} from '../commandpalette';
import {IFrame} from '../iframe';
import {IMainMenu} from '../mainmenu';
import {Menu} from 'phosphor/lib/ui/menu';
import {showDialog} from '../dialog';
import {IPathTracker} from '../filebrowser';
import {IServiceManager} from '../services';
import {IDocumentRegistry} from '../docregistry';

export const plugin: JupyterLabPlugin<void> = {
	id: 'test',
	autoStart: true,
	requires: [IMainMenu, ICommandPalette, IServiceManager, IPathTracker, IDocumentRegistry],
	activate: activate,
}

const cmds = [
	{id: '1', text: 'W3Schools',
	url: 'http://w3schools.com',
	},
	{id: '2', text: 'Python Docs',
	url: 'https://docs.python.org/3.6',
	},
	{id: '3', text: 'W3C',
	url: 'https://w3.org',
	},
]

function activate(app: JupyterLab, mainMenu: IMainMenu, palette: ICommandPalette, services: IServiceManager, pathTracker: IPathTracker, registry: IDocumentRegistry): void {
	let {commands, keymap} = app;
	let menu = new Menu({commands, keymap});
	menu.title.label = 'Useful Links';

	cmds.forEach(command => app.commands.addCommand(command.id, {
		label: command.text,
		execute: () => {
			let i = new IFrame();
			i.id = command.id;
			i.title.label = command.text;
			i.title.closable = true;
			i.loadURL(command.url);
			app.shell.addToMainArea(i);
		}
	}));
	cmds.forEach(command => menu.addItem({command: command.id}));
	cmds.forEach(command => palette.addItem({command: command.id, category: 'Links'}));

	mainMenu.addMenu(menu, {});

	for (let widgetName of registry.listWidgetFactories('md')) {
		//showDialog({title: 'Meddelande', body: widgetName});
		console.log(widgetName);
	}

	app.commands.addCommand('dev001', {
		label: 'Open example notebook',
		execute: () => app.commands.execute('file-operations:open', {path: 'examples/notebook/test.ipynb'}),
	});
	palette.addItem({command: 'dev001', category: 'Development'});

	app.commands.execute('file-operations:open', {path: 'CONTRIBUTING.md'});
	app.commands.execute('file-operations:open', {path: 'README.md', widgetName: 'Rendered Markdown'});
	app.commands.execute('file-operations:open', {path: 'RELEASE.md', widgetName: 'Rendered Markdown'});
	//app.commands.execute('file-operations:new-notebook', void 0);
	//app.commands.execute('file-browser:activate', void 0);
	app.commands.execute('file-browser:hide', void 0);
}
