import { RouterStore } from 'mobx-react-router';
import AppState from './AppState';
import ContainerAppCallbacks from './ContainerAppCallbacks';
import ThemeEngine from './ThemeEngine';

class RootStore {
    appState: AppState;
    routing: RouterStore;
    containerAppCallbacks: ContainerAppCallbacks;
    theme: ThemeEngine;

    constructor(routing: RouterStore, containerAppCallbacks: ContainerAppCallbacks) {
        this.routing = routing;
        this.appState = new AppState(routing);
        this.containerAppCallbacks = containerAppCallbacks;
        this.theme = new ThemeEngine();
    }
}

export default RootStore;