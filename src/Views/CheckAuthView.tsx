import * as React from 'react';
import { LoggedInState } from '../Model/AppState';
import { inject, observer } from 'mobx-react';
import RootStore from '../Model/RootStore';
import { Redirect } from 'react-router';

@inject('appState')
@inject('routing')
@observer
class CheckAuthView extends React.Component<RootStore, {}> {
    
    componentWillMount() {
        this.props.appState.checkAuth();
    }

    render() {
        if (this.props.appState.loggedIn === LoggedInState.NotLoggedIn) {
            return (<Redirect to="/login" />);
        } 
        // Telemetry disabled for now
        // else if (this.props.appState.loggedIn === LoggedInState.LoggedIn) {
        //     return (<Redirect to="/telemetrymessage" />);
        // } 
        // tslint:disable-next-line
        else if (this.props.appState.loggedIn === LoggedInState.LoggedIn) {
            return (<Redirect to="/blogs" />);
        } 
        // tslint:disable-next-line
        else {
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