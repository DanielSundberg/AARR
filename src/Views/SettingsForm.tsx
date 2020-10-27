import * as React from 'react';
import RootStore from '../Model/RootStore';
import { inject, observer } from 'mobx-react';
import AARRStatApi from '../Model/AARRStatAPI';
import OldReaderResource from '../Model/OldReaderResource';
import * as sha256 from 'crypto-js/sha256';
import { v4 as uuidv4 } from 'uuid';

const Loader: React.SFC = () => {
    return (
        <div className="item">
            <div className="ui tiny active inline loader" />
        </div>
    );
};

const TelemetryInfo: React.FunctionComponent<{style:any}> = ({style}) => {
    return (
        <div className="ui info message" style={    style}>
            Only usage statistics such as the number of times the app has been
            opened and how much time that has been spent reading articles will
            be collected.
            Personal information such as email, ip address, age, nationality
            and so on will not be collected.
            The collected information will be used to improve the user experience
            in the AARR reader app.
            <br /><br />
            The following information is sent to AARR:s servers:
            <div className="ui bulleted list">
                <div className="item">Hashed the Old Reader user id (impossible for the AARR server to decode)</div>
                <div className="item">Hashed device id (impossible for the AARR server to decode)</div>
                <div className="item">Session id (random unique id)</div>
                <div className="item">Device name (as entered above)</div>
            </div>

            The collection of usage statistics is strictly done only when the
            user opts in. The statistics analysis app is available on github:<br />
            <a href="https://github.com/DanielSundberg/AARR-stat">https://github.com/DanielSundberg/AARR-stat</a>
        </div>
    );
};

interface SettingsFormState {
    enableTelemetry: boolean;
    isSaving: boolean;
    deviceName: string;
    hasChanges: boolean;
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
            deviceName: localStorage.getItem('deviceName') || `My device ${Math.floor(Math.random() * 1000000)}`,
            hasChanges: false,
            errorMessage: '',
        };
    }

    componentWillMount() {
        document.body.style.backgroundColor = this.props.theme.listBackgroundColor();
    }

    async saveTelemetrySettings(self: any) { // tslint:disable-line
        this.setState({
            isSaving: true
        });

        // tslint:disable-next-line
        console.log(`Save settings, enable telemetry: ${this.state.enableTelemetry}, device name: ${this.state.deviceName}`);
        let aarrStatApi = new AARRStatApi(
            this.props.containerAppCallbacks.url,
            this.props.containerAppCallbacks.apiKey);

        // Fetch user info to get user id
        const authToken = localStorage.getItem('authToken') || "";
        let rsp: any = await OldReaderResource.userInfo(authToken); // tslint:disable-line
        if (rsp.status !== 200) {
            this.setState({
                errorMessage: rsp.message,
                isSaving: false
            });
            return;
        }
        let data: any = await rsp.data; // tslint:disable-line
        console.log("OldReader user id: ", data.userId); // tslint:disable-line

        // Create and store user id hash
        const userIdHash = Buffer.from(sha256(data.userId).toString(), 'binary').toString('base64').substr(0, 12);
        console.log("Hashed user id: ", userIdHash); // tslint:disable-line
        localStorage.setItem('userId', userIdHash);

        // Create hashed device id if it doesn't already exist
        // This will stay the same as long as the app is installed
        let deviceIdHash = localStorage.getItem("deviceId") || "";
        console.log("Saved device id: ", deviceIdHash); // tslint:disable-line
        if (deviceIdHash.length !== 12) {
            deviceIdHash = Buffer.from(sha256(uuidv4()).toString(), 'binary').toString('base64').substr(0, 12);
            console.log("Hashed device id: ", deviceIdHash); // tslint:disable-line
            localStorage.setItem('deviceId', deviceIdHash);
        }

        if (this.state.enableTelemetry) {
            // Store device name entered by user
            localStorage.setItem('deviceName', this.state.deviceName);

            // Register device with AARRStat api
            let response: any = await aarrStatApi.newDevice(deviceIdHash, userIdHash, this.state.deviceName); // tslint:disable-line
            console.log(`Request result ${response.status}`); // tslint:disable-line
            if (response.status !== 200) {
                console.log(`Request failed, error code ${response.status}, response: `, response); // tslint:disable-line
                this.setState({
                    errorMessage: 'Request failed, please try again!',
                    isSaving: false,
                });
                return;
            }

            // Finally enable telemetry for local app
            localStorage.setItem('enableTelemetry', "true");

        } else {

            // Tell AARR-stat we disabled telemetry
            let response: any = await aarrStatApi.newDevice(deviceIdHash, userIdHash, this.state.deviceName, false); // tslint:disable-line
            console.log(`Request result ${response.status}`); // tslint:disable-line
            if (response.status !== 200) {
                console.log(`Request failed, error code ${response.status}, response: `, response); // tslint:disable-line
                this.setState({
                    errorMessage: 'Request failed, please try again!',
                    isSaving: false,
                });
                return;
            }

            // Finally disable telemetry for local app
            localStorage.setItem('enableTelemetry', "false");
        }

        // Set state so that we properly update ui
        this.setState({
            isSaving: false,
            hasChanges: false,
            errorMessage: ''
        });
    }

    setLightTheme(self: any) {
        self.props.theme.setLightTheme();
    }

    setDarkTheme(self: any) {
        self.props.theme.setDarkTheme();
    }

    render() {
        // console.log("Url: ", this.props.containerAppCallbacks.url); // tslint:disable-line
        document.body.style.backgroundColor = this.props.theme.listBackgroundColor();

        let deviceNameInputClasses = this.state.enableTelemetry ?
            "ui action input" :
            "ui action input disabled";

        let errorMessageOrEmpty = this.state.errorMessage &&
            <div className="ui error message">{this.state.errorMessage}</div>;
        let loaderOrEmpty = this.state.isSaving && <Loader />;

        const lightThemeButtonStyle = this.props.theme.isLight() ? 
            this.props.theme.blogHeaderActiveStyle() : 
            this.props.theme.blogHeaderInactiveStyle();
        const darkThemeButtonStyle = this.props.theme.isDark() ? 
            this.props.theme.blogHeaderActiveStyle() : 
            this.props.theme.blogHeaderInactiveStyle();
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
                        <h1 className="ui header center" style={this.props.theme.headerTextStyle()}>
                            Settings
                      </h1>
                    </div>
                </div>

                {loaderOrEmpty}
                {errorMessageOrEmpty}

                {/* Select theme */}
                <div className="row">
                    <div className="sixteen wide column">
                        <h2 className="ui header" style={this.props.theme.headerTextStyle()}>Theme</h2>
                        <div className="row">
                            <button 
                                className="ui toggle large button" 
                                style={lightThemeButtonStyle}
                                onClick={(ev: any) => this.setLightTheme(this)}
                            >
                                {lightThemeButtonIcon} Light
                            </button>
                            <button 
                                className="ui toggle large button" 
                                style={darkThemeButtonStyle}
                                onClick={(ev: any) => this.setDarkTheme(this)}
                            >
                                {darkThemeButtonIcon} Dark
                            </button>
                        </div>
                    </div>
                </div>

                {/* Enable Usage statistics */}
                <div className="row">
                    <div className="sixteen wide column">
                        <h2 className="ui header" style={this.props.theme.headerTextStyle()}>Usage statistics</h2>
                        <div className="row">
                            <div className="four wide column">
                                <div className="ui checkbox" style={this.props.theme.checkbox()}>
                                    <input
                                        type="checkbox"
                                        name="enable-telemetry"
                                        checked={this.state.enableTelemetry}
                                        // tslint:disable-next-line
                                        onChange={(ev: any) => { 
                                            this.setState({ enableTelemetry: !this.state.enableTelemetry, hasChanges: true }); 
                                            this.saveTelemetrySettings(this);
                                        }}
                                    />
                                    <label style={this.props.theme.headerTextStyle()}>Yes I'm in!</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Device name */}
                <div className="row">
                    <div className="ui sixteen wide column">
                        <form className="ui large form">
                            <div className="field">
                                <label style={this.props.theme.headerTextStyle()}>Device name:</label>
                                <div className={deviceNameInputClasses}>
                                    <input
                                        type="text"
                                        name="device-name"
                                        placeholder="Device name"
                                        value={this.state.deviceName}
                                        style={this.props.theme.inputStyle()}
                                        // tslint:disable-next-line
                                        onChange={(ev: any) => this.setState({ deviceName: ev.target.value, hasChanges: true })}
                                    />
                                    <button 
                                        className="ui button" 
                                        style={this.props.theme.activeButton()}
                                        onClick={(ev: any) => this.saveTelemetrySettings(this)}
                                    >
                                        <i className="check icon"/>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Telemetry info label */}
                <div className="row">
                    <div className="ui sixteen wide column">
                        <TelemetryInfo style={this.props.theme.infoMessageStyle()} />
                    </div>
                </div>

                

            </div>);
    }
}

export default SettingsForm;