import { RouterStore } from 'mobx-react-router';
import AppState from './AppState';

class RootStore {
    appState: AppState;
    routing: RouterStore;

    constructor(routing: RouterStore) {
        this.routing = routing;
        this.appState = new AppState(routing);
    }
}

export default RootStore;