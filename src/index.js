import './Polyfills';
import App from './App';
import CommandParser from './CommandParser';
import Messenger from './Messenger';

const commandParser = new CommandParser();
const messenger = new Messenger(cb);
const app = new App(cb, cbjs, commandParser);

cb.onMessage(msgObj => app.onMessage(msgObj));
cb.onTip(tipObj => app.onTip(tipObj));
