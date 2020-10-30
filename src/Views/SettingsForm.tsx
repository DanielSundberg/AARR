import * as React from 'react';
import RootStore from '../Model/RootStore';
import { inject, observer } from 'mobx-react';
import { AppUsageResource, newDeviceName } from '../Model/AppUsageResource';
import { TelemetryInfo } from './TelemetryInfo';
import Headroom from 'react-headroom';
import { fullscreenBelowMenuStyle } from '../Model/CustomStyles';
import { telemetryEnabled } from '../Model/Storage';
import * as _ from 'lodash';

interface SettingsFormState {
    enableTelemetry: boolean;
    isSavingEnableUsageStatistics: boolean;
    isSavingDeviceName: boolean;
    deviceName: string;
    errorMessage: string;
}

@inject("containerAppCallbacks")
@inject("routing")
@inject("theme")
@observer
class SettingsForm extends React.Component<RootStore, SettingsFormState> {

    constructor(props: RootStore) {
        super(props);

        this.state = {
            isSavingEnableUsageStatistics: false,
            isSavingDeviceName: false,
            enableTelemetry: telemetryEnabled(),
            deviceName: newDeviceName(),
            errorMessage: '',
        };
    }

    componentWillMount() {
        document.body.style.backgroundColor = this.props.theme.theme.listBackground;
    }

    async saveTelemetrySettings(self: any) { // tslint:disable-line
        const newEnableTelemetryValue = !self.state.enableTelemetry;
        self.setState({ 
            isSavingEnableUsageStatistics: true
        }); 

        // tslint:disable-next-line
        console.log(`Save settings, enable telemetry: ${newEnableTelemetryValue}, device name: ${self.state.deviceName}`);
        let appUsageResource = new AppUsageResource(
            self.props.containerAppCallbacks.url,
            self.props.containerAppCallbacks.apiKey
        );
        const rsp = await appUsageResource.register(newEnableTelemetryValue, self.state.deviceName);

        // Set state so that we properly update ui
        self.setState({
            isSavingEnableUsageStatistics: false,
            errorMessage: rsp.errorMessage, 
            enableTelemetry: rsp.errorMessage ? self.state.enableTelemetry : newEnableTelemetryValue
        });
    }

    async saveDeviceName(self: any) { // tslint:disable-line
        self.setState({ 
            isSavingDeviceName: true
        }); 

        // tslint:disable-next-line
        console.log(`Save settings, enable telemetry: ${self.state.enableTelemetry}, device name: ${self.state.deviceName}`);
        let appUsageResource = new AppUsageResource(
            self.props.containerAppCallbacks.url,
            self.props.containerAppCallbacks.apiKey
        );
        const rsp = await appUsageResource.register(
            self.state.enableTelemetry,
            self.state.deviceName 
        );

        // Set state so that we properly update ui
        self.setState({
            isSavingDeviceName: false,
            errorMessage: rsp.errorMessage
        });
    }

    render() {
        // console.log("Url: ", this.props.containerAppCallbacks.url); // tslint:disable-line
        document.body.style.backgroundColor = this.props.theme.colors().listBackground;

        let deviceNameInputClasses = this.state.enableTelemetry ?
            "ui fluid action input " :
            "ui fluid action input disabled";

        let errorMessageOrEmpty = this.state.errorMessage &&
            <div className="ui error message">{this.state.errorMessage}</div>;

        let themeButtons = _.map(this.props.theme.themes(), theme => {
            const buttonStyle = theme.key === this.props.theme.currentTheme() ? 
                this.props.theme.blogHeaderActive() : 
                this.props.theme.blogHeaderInactive();
            const buttonIcon = theme.key === this.props.theme.currentTheme() ? 
                <i className="check circle outline icon"/> : 
                <i className="circle outline icon"/>;
            return (
                <button
                    key={theme.key}
                    className="ui toggle large button" 
                    style={buttonStyle}
                    onClick={(ev: any) => this.props.theme.setTheme(theme.key)} // tslint:disable-line
                >
                    {buttonIcon} {theme.name}
                </button>
            );
        });

        let saveDeviceButtonOrLoader = this.state.isSavingDeviceName ? (
            <button 
                className="ui large primary loading button"
                style={this.props.theme.activeButton()}
            >
                Loading
            </button>
        ) : (
            <button 
                className="ui large primary button" 
                onClick={(ev: any) => this.saveDeviceName(this)} // tslint:disable-line
                style={this.props.theme.activeButton()}
            >
                <i className="icon check" /> Save
            </button>
        );

        let toggleUsageStatisticsButton = this.state.enableTelemetry ? (
            <button 
                className="ui large primary fluid button" 
                onClick={(ev: any) => this.saveTelemetrySettings(this)} // tslint:disable-line
                style={this.props.theme.activeButton()}
            >
                <i className="check circle outline icon"/>On
            </button> 
        ) : (
            <button 
                className="ui large fluid button" 
                onClick={(ev: any) => this.saveTelemetrySettings(this)} // tslint:disable-line
                style={this.props.theme.inactiveButton()}
            >
                <i className="circle outline icon"/>Off
            </button>
        );
        let toggleUsageStatisticsButtonOrLoader = this.state.isSavingEnableUsageStatistics ? (
            <button 
                className="ui large primary loading fluid button"
                style={this.props.theme.activeButton()}
            >
                Loading
            </button>) : 
            toggleUsageStatisticsButton;

        return (
            <div className="container">
                <Headroom>
                    <div className="ui attached inverted icon menu" >
                        <a 
                            className="item" 
                            onClick={() => this.props.routing.goBack()} 
                            style={this.props.theme.headerText()}
                        >
                            <i className="icon angle left" />
                        </a>
                        <div className="header borderless item left" style={this.props.theme.softMenu()}>Settings</div>
                    </div>
                </Headroom>

                {errorMessageOrEmpty}

                <div className="grid" style={fullscreenBelowMenuStyle}>

                    {/* Select theme */}
                    <div className="row">
                        <div className="sixteen wide column">
                            <h3 className="ui header" style={this.props.theme.settingsHeader()}>Theme</h3>
                            <div className="row">
                                {themeButtons}
                            </div>
                        </div>
                    </div>
                    <br/><br/>

                    {/* Enable Usage statistics */}
                    <div className="row">
                        <div className="sixteen wide column">
                            <h3 className="ui header" style={this.props.theme.settingsHeader()}>Usage statistics</h3>
                            <div className="row">
                                {toggleUsageStatisticsButtonOrLoader}
                            </div>
                        </div>
                    </div>
                    <br/><br/>

                    {/* Device name */}
                    <div className="row">
                        <div className="ui sixteen wide column">
                            <div className="field">
                                <h3 style={this.props.theme.settingsHeader()}>Usage Statistics device name:</h3>
                                <div className={deviceNameInputClasses}>
                                    <input
                                        type="text"
                                        name="device-name"
                                        placeholder="Device name"
                                        value={this.state.deviceName}
                                        style={this.props.theme.input()}
                                        // tslint:disable-next-line
                                        onChange={(ev: any) => this.setState({ deviceName: ev.target.value })}
                                    />
                                    {saveDeviceButtonOrLoader}
                                </div>
                            </div>
                        </div>
                    </div>
                    <br/>

                    {/* Telemetry info label */}
                    <div className="row">
                        <div className="ui sixteen wide column">
                            <TelemetryInfo style={this.props.theme.infoMessage()} />
                        </div>
                    </div>

                </div>
            </div>);
    }
}

export default SettingsForm;