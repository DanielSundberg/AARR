// import * as React from 'react';
// import { observer } from 'mobx-react';
// import LoginForm from './LoginForm';
// import CheckAuthView from './CheckAuthView';
// import BlogPostView from './BlogPostView';
// import BlogListView from './BlogListView';
// import Loader from './Loader';
// import AppState from '../Model/AppState';
// import { Route } from '../Model/AppState';

class AppView {}

// @observer
// class AppView extends React.Component<{appState: AppState}, {}> {
//   render() {
//     if (this.props.appState.route === Route.Loader) {
//         return <Loader/>;
//     } else if (this.props.appState.route === Route.Login) {
//         return <LoginForm appState={this.props.appState} />
//     } else if (this.props.appState.route === Route.BlogList) {
//         return <BlogListView appState={this.props.appState} />;
//     } else if (this.props.appState.route === Route.BlogPost) {
//         return <BlogPostView appState={this.props.appState} />;
//     } else {
//         return <CheckAuthView appState={this.props.appState} />
//     }
//   }
// }

export default AppView;