import React from 'react';
import { observer } from 'mobx-react';
import { useStores } from '../stores/RootStore';
import { SimpleNavBar } from './SimpleNavBar';
import * as _ from 'lodash';
import { fullscreenBelowMenuStyle } from './CustomStyles';

export const SettingsForm = observer(() => {
    const {theme } = useStores();

    // let errorMessageOrEmpty = this.state.errorMessage &&
    // <div className="ui error message">{this.state.errorMessage}</div>;

    let themeButtons = _.map(theme.themes(), t => {
        const buttonStyle = t.key === theme.currentTheme ? 
            theme.blogHeaderActive() : 
            theme.blogHeaderInactive();
        const buttonIcon = t.key === theme.currentTheme ? 
            <i className="check circle outline icon"/> : 
            <i className="circle outline icon"/>;
        return (
            <button
                key={t.key}
                className="ui toggle large button" 
                style={buttonStyle}
                onClick={(ev: any) => theme.setTheme(t.key)} // tslint:disable-line
            >
                {buttonIcon} {t.name}
            </button>
        );
    });

    return (
        <div className="container">
            <SimpleNavBar title="Settings" />

            <div className="grid" style={fullscreenBelowMenuStyle}>

                {/* Select theme */}
                <div className="row">
                    <div className="sixteen wide column">
                        <h3 className="ui header" style={theme.settingsHeader()}>Theme</h3>
                        <div className="row">
                            {themeButtons}
                        </div>
                    </div>
                </div>
                <br/><br/>

            </div>
        </div>);
});

// Keeping some code belonging to UsageStatistics..
// interface SettingsFormState {
//     enableTelemetry: boolean;
//     isSavingEnableUsageStatistics: boolean;
//     isSavingDeviceName: boolean;
//     deviceName: string;
//     errorMessage: string;
// }
// this.state = {
//     isSavingEnableUsageStatistics: false,
//     isSavingDeviceName: false,
//     enableTelemetry: telemetryEnabled(),
//     deviceName: newDeviceName(),
//     errorMessage: '',
// };

// async saveTelemetrySettings(self: any) { // tslint:disable-line
//     const newEnableTelemetryValue = !self.state.enableTelemetry;
//     self.setState({ 
//         isSavingEnableUsageStatistics: true
//     }); 

//     // tslint:disable-next-line
//     console.log(`Save settings, enable telemetry: ${newEnableTelemetryValue}, device name: ${self.state.deviceName}`);
//     let appUsageResource = new AppUsageResource(
//         self.props.containerAppCallbacks.url,
//         self.props.containerAppCallbacks.apiKey
//     );
//     const rsp = await appUsageResource.register(newEnableTelemetryValue, self.state.deviceName);

//     // Set state so that we properly update ui
//     self.setState({
//         isSavingEnableUsageStatistics: false,
//         errorMessage: rsp.errorMessage, 
//         enableTelemetry: rsp.errorMessage ? self.state.enableTelemetry : newEnableTelemetryValue
//     });
// }
// async saveDeviceName(self: any) { // tslint:disable-line
//     self.setState({ 
//         isSavingDeviceName: true
//     }); 

//     // tslint:disable-next-line
//     console.log(`Save settings, enable telemetry: ${self.state.enableTelemetry}, device name: ${self.state.deviceName}`);
//     let appUsageResource = new AppUsageResource(
//         self.props.containerAppCallbacks.url,
//         self.props.containerAppCallbacks.apiKey
//     );
//     const rsp = await appUsageResource.register(
//         self.state.enableTelemetry,
//         self.state.deviceName 
//     );

//     // Set state so that we properly update ui
//     self.setState({
//         isSavingDeviceName: false,
//         errorMessage: rsp.errorMessage
//     });
// }

// {/* Commented out below, usage statistics disabled for now */}

// {/* Enable Usage statistics */}
// {/* <div className="row">
//     <div className="sixteen wide column">
//         <h3 className="ui header" style={this.props.theme.settingsHeader()}>Usage statistics</h3>
//         <div className="row">
//             {toggleUsageStatisticsButtonOrLoader}
//         </div>
//     </div>
// </div>
// <br/><br/> */}

// {/* Device name */}
// {/* <div className="row">
//     <div className="ui sixteen wide column">
//         <div className="field">
//             <h3 style={this.props.theme.settingsHeader()}>Usage Statistics device name:</h3>
//             <div className={deviceNameInputClasses}>
//                 <input
//                     type="text"
//                     name="device-name"
//                     placeholder="Device name"
//                     value={this.state.deviceName}
//                     style={this.props.theme.input()}
//                     // tslint:disable-next-line
//                     onChange={(ev: any) => this.setState({ deviceName: ev.target.value })}
//                 />
//                 {saveDeviceButtonOrLoader}
//             </div>
//         </div>
//     </div>
// </div>
// <br/> */}

// {/* Telemetry info label */}
// {/* <div className="row">
//     <div className="ui sixteen wide column">
//         <TelemetryInfo style={this.props.theme.infoMessage()} />
//     </div>
// </div> */}

