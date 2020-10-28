import * as React from 'react';
import RootStore from '../Model/RootStore';
import { inject, observer } from 'mobx-react';
import { register as registerDevice, newDeviceName } from '../Model/DeviceUtils';
import { TelemetryInfo } from './TelemetryInfo';

interface SettingsFormState {
    enableTelemetry: boolean;
    isSavingEnableUsageStatistics: boolean;
    isSavingDeviceName: boolean;
    deviceName: string;
    errorMessage: string;
}

@inject("containerAppCallbacks")
@inject("theme")
@observer
class SettingsForm extends React.Component<RootStore, SettingsFormState> {

    constructor(props: RootStore) {
        super(props);

        this.state = {
            isSavingEnableUsageStatistics: false,
            isSavingDeviceName: false,
            enableTelemetry: localStorage.getItem('enableTelemetry') === "true",
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
        const rsp = await registerDevice(
            self.props.containerAppCallbacks.url, 
            self.props.containerAppCallbacks.apiKey, 
            newEnableTelemetryValue,
            self.state.deviceName 
        );

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
        const rsp = await registerDevice(
            self.props.containerAppCallbacks.url, 
            self.props.containerAppCallbacks.apiKey, 
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
        document.body.style.backgroundColor = this.props.theme.colors.listBackground;

        let deviceNameInputClasses = this.state.enableTelemetry ?
            "ui fluid action input " :
            "ui fluid action input disabled";

        let errorMessageOrEmpty = this.state.errorMessage &&
            <div className="ui error message">{this.state.errorMessage}</div>;

        const lightThemeButtonStyle = this.props.theme.isLight() ? 
            this.props.theme.blogHeaderActive() : 
            this.props.theme.blogHeaderInactive();
        const darkThemeButtonStyle = this.props.theme.isDark() ? 
            this.props.theme.blogHeaderActive() : 
            this.props.theme.blogHeaderInactive();
        const lightThemeButtonIcon = this.props.theme.isLight() ? 
            <i className="check circle outline icon"/> : 
            <i className="circle outline icon"/>;
        const darkThemeButtonIcon = this.props.theme.isDark() ? 
            <i className="check circle outline icon"/> : 
            <i className="circle outline icon"/>;

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
            <div className="ui grid container">
                <div className="row"></div>

                {/* Header */}
                <div className="row">
                    <div className="sixteen wide column">
                        <h1 className="ui header center" style={this.props.theme.settingsHeader()}>
                            Settings
                      </h1>
                    </div>
                </div>

                {errorMessageOrEmpty}

                {/* Select theme */}
                <div className="row">
                    <div className="sixteen wide column">
                        <h3 className="ui header" style={this.props.theme.settingsHeader()}>Theme</h3>
                        <div className="row">
                            <button 
                                className="ui toggle large button" 
                                style={lightThemeButtonStyle}
                                onClick={(ev: any) => this.props.theme.setLightTheme()} // tslint:disable-line
                            >
                                {lightThemeButtonIcon} Light
                            </button>
                            <button 
                                className="ui toggle large button" 
                                style={darkThemeButtonStyle}
                                onClick={(ev: any) => this.props.theme.setDarkTheme()} // tslint:disable-line
                            >
                                {darkThemeButtonIcon} Dark
                            </button>
                        </div>
                    </div>
                </div>

                {/* Enable Usage statistics */}
                <div className="row">
                    <div className="sixteen wide column">
                        <h3 className="ui header" style={this.props.theme.settingsHeader()}>Usage statistics</h3>
                        <div className="row">
                            {toggleUsageStatisticsButtonOrLoader}
                        </div>
                    </div>
                </div>

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

                {/* Telemetry info label */}
                <div className="row">
                    <div className="ui sixteen wide column">
                        <TelemetryInfo style={this.props.theme.infoMessage()} />
                    </div>
                </div>
            </div>);
    }
}

export default SettingsForm;