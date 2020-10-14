import { RouterStore } from 'mobx-react-router';
import AppState from './AppState';
import ContainerAppCallbacks from './ContainerAppCallbacks';

class RootStore {
    appState: AppState;
    routing: RouterStore;
    containerAppCallbacks: ContainerAppCallbacks;

    constructor(routing: RouterStore, containerAppCallbacks: ContainerAppCallbacks) {
        this.routing = routing;
        this.appState = new AppState(routing);
        this.containerAppCallbacks = containerAppCallbacks;
    }
}

export default RootStore;