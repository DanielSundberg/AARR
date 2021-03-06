import './assets/semantic-ui/semantic.min.css';
import * as React from 'react';
// import createBrowserHistory from 'history/createBrowserHistory';
import createHashHistory from 'history/createHashHistory';
import { Provider } from 'mobx-react';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import { Router, Route, Switch } from 'react-router';
import CheckAuthView from './Views/CheckAuthView';
import LoginForm from './Views/LoginForm';
import BlogPostView from './Views/BlogPostView';
import BlogListView from './Views/BlogListView';
import RootStore from './Model/RootStore';
import AddForm from './Views/AddForm';
import SettingsForm from './Views/SettingsForm';
import ContainerAppCallbacks from './Model/ContainerAppCallbacks';
import EnableTelemetryForm from './Views/EnableTelemetryForm';
import AboutForm from './Views/AboutForm';

declare global {
  // tslint:disable-next-line
  interface Window { ContainerAppCallbacks: any; }
}
var contatinerAppCallbacks = new ContainerAppCallbacks();
window.ContainerAppCallbacks = contatinerAppCallbacks;

// const browserHistory = createBrowserHistory();
const hashHistory = createHashHistory();
const routingStore = new RouterStore();

const rootStore = new RootStore(routingStore, contatinerAppCallbacks);

const history = syncHistoryWithStore(hashHistory, routingStore);

class App extends React.Component {
  render() {
        // tslint:disable-next-line
        console.log('Starting AARR!');
        return (
            <Provider {...rootStore}>
              <Router history={history}>
                <Switch>
                  <Route exact={true} path="/" component={CheckAuthView} />
                  <Route path="/login" component={LoginForm} />
                  <Route exact={true} path="/blogs" component={BlogListView} />
                  <Route path="/blogs/:blogId" component={BlogPostView} />
                  <Route path="/add" component={AddForm} />
                  <Route path="/settings" component={SettingsForm} />
                  <Route path="/telemetrymessage" component={EnableTelemetryForm} />
                  <Route path="/about" component={AboutForm} />
                  <Route component={CheckAuthView} />
                </Switch>
              </Router>
            </Provider>
        );
    }
}

export default App;
