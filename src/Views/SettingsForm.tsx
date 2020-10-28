import * as React from 'react';
import RootStore from '../Model/RootStore';
import { inject, observer } from 'mobx-react';
import { register as registerDevice, newDeviceName } from '../Model/DeviceUtils';

const Loader: React.SFC = () => {
    return (
        <div className="item">
            <div className="ui tiny active inline loader" />
        </div>
    );
};

// tslint:disable-next-line
export const TelemetryInfo: React.FunctionComponent<{style: any}> = ({style}) => {
    return (
        <div className="ui info message" style={style}>
            <h4>Usage statistics</h4>
            
            <div className="ui bulleted list">
                <div className="item">
                    Only usage statistics such as the number of times the app has been
                    opened and how much time that has been spent reading articles will
                    be collected.
                </div>
                <div className="item">
                    Personal information such as email, ip address, age, nationality
                    and so on will not be collected.
                </div>
                <div className="item">
                    The collected information will be used to improve the user experience
                    in the AARR reader app.
                </div>
                <div className="item">
                    The source code of the statistics analysis app is available on github:<br/>
                    <a href="https://github.com/DanielSundberg/AARR-stat">AARR-stat on Github</a>.
                </div>
            </div>
        </div>
    );
};

interface SettingsFormState {
    enableTelemetry: boolean;
    isSaving: boolean;
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
            isSaving: false,
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
            isSaving: true
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
            isSaving: false,
            errorMessage: rsp.errorMessage, 
            enableTelemetry: rsp.errorMessage ? self.state.enableTelemetry : newEnableTelemetryValue
        });
    }

    async saveDeviceName(self: any) { // tslint:disable-line
        self.setState({ 
            isSaving: true
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
            isSaving: false,
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
        let loaderOrEmpty = this.state.isSaving && <Loader />;

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

                {loaderOrEmpty}
                {errorMessageOrEmpty}

                {/* Select theme */}
                <div className="row">
                    <div className="sixteen wide column">
                        <h2 className="ui header" style={this.props.theme.settingsHeader()}>Theme</h2>
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
                        <h2 className="ui header" style={this.props.theme.settingsHeader()}>Usage statistics</h2>
                        <div className="row">
                            <div className="four wide column">
                                <div className="ui checkbox">
                                    <input
                                        type="checkbox"
                                        name="enable-telemetry"
                                        checked={this.state.enableTelemetry}
                                        // tslint:disable-next-line
                                        onChange={(ev: any) => { 
                                            this.saveTelemetrySettings(this);
                                        }}
                                    />
                                    <label style={this.props.theme.settingsHeader()}>Yes I'm in!</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Device name */}
                <div className="row">
                    <div className="ui sixteen wide column">
                        <div className="field">
                            <h4 style={this.props.theme.settingsHeader()}>Device name:</h4>
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
                                <button 
                                    className="ui button" 
                                    style={this.props.theme.activeButton()}
                                    onClick={(ev: any) => this.saveDeviceName(this)} // tslint:disable-line
                                >
                                    <i className="check icon"/>
                                </button>
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