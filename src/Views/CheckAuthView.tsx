import * as React from 'react';
// import AppState from '../Model/AppState';
import { LoggedInState } from '../Model/AppState';
import { inject, observer } from 'mobx-react';
import RootStore from '../Model/RootStore';
import { Redirect } from 'react-router';
// interface CheckAuthProps {
//     appState: AppState;
// }


// class CheckAuthView extends React.Component<CheckAuthProps, {}> {
@inject("appState")
@inject("routing")
@observer
class CheckAuthView extends React.Component<RootStore, {}> {
    // constructor(props) {
    //     super(props);
    // }
    
    componentWillMount() {
        this.props.appState.checkAuth();
    }

    render() {
        if (this.props.appState.loggedIn === LoggedInState.NotLoggedIn) {
            return (<Redirect to="/login" />);
        } else if (this.props.appState.loggedIn === LoggedInState.LoggedIn) {
            return (<Redirect to="/blogs" />);
        } else {
            return (
                <div className="ui grid container">
                    <div className="ui active dimmer">
                        <p/>
                        <div className="ui text loader">Checking for saved login...</div>
                    </div>
                </div>);
        }
    }
}

export default CheckAuthView;