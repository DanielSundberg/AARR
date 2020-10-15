import * as React from 'react';
import RootStore from '../Model/RootStore';
// import { inject, observer } from 'mobx-react';
import { inject } from 'mobx-react';
import AARRStatApi from '../Model/AARRStatAPI';
import OldReaderResource from '../Model/OldReaderResource';
import * as sha256 from 'crypto-js/sha256';
import { v4 as uuidv4 } from 'uuid';

const Loader: React.SFC = () => {
  return (
      <div className="item">
          <div className="ui tiny active inline loader"/>
      </div>
  );
};

const TelemetryInfo: React.FunctionComponent = () => {
  return (
    <div className="ui info message">
      Only usage statistics such as the number of times the app has been 
      opened and how much time that has been spent reading articles will 
      be collected. 
      Personal information such as email, ip address, age, nationality 
      and so on will not be collected. 
      The collected information will be used to improve the user experience 
      in the AARR reader app.
      <br/><br/>
      The following information is sent to AARR:s servers:
      <div className="ui bulleted list">
        <div className="item">Hashed the Old Reader user id (impossible for the AARR server to decode)</div>
        <div className="item">Hashed device id (impossible for the AARR server to decode)</div>
        <div className="item">Session id (random unique id)</div>
        <div className="item">Device name (as entered above)</div>
      </div>

      The collection of usage statistics is strictly done only when the 
      user opts in. The statistics analysis app is available on github:<br/>
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

    async saveSettings(self: any) { // tslint:disable-line
      this.setState({
        isSaving: true
      });

      // tslint:disable-next-line
      console.log(`Save settings, enable telemetry: ${this.state.enableTelemetry}, device name: ${this.state.deviceName}`);
      if (this.state.enableTelemetry) {
        
        // First fetch user info to get user id
        const authToken = localStorage.getItem('authToken') || "";
        let rsp : any = await OldReaderResource.userInfo(authToken);
        if (rsp.status !== 200) {
          this.setState({
            errorMessage: rsp.message, 
            isSaving: false
          });
          return;
        }
        let data: any = await rsp.data; // tslint:disable-line
        console.log("OldReader user id: ", data.userId);
        
        // Create and store user id hash
        const userIdHash = sha256(data.userId).toString();
        console.log("Hashed user id: ", userIdHash); // tslint:disable-line
        localStorage.setItem('userId', userIdHash);

        // Create hashed device id if it doesn't already exist
        // This will stay the same as long as the app is installed
        let deviceIdHash = localStorage.getItem("deviceId") || "";
        if (deviceIdHash.length !== 64) {
          deviceIdHash = sha256(uuidv4()).toString()
          console.log("Hashed device id: ", deviceIdHash); // tslint:disable-line
          localStorage.setItem('deviceId', deviceIdHash);
        }

        // Store device name entered by user
        localStorage.setItem('deviceName', this.state.deviceName);

        // Register device with AARRStat api
        let aarrStatApi = new AARRStatApi(
          this.props.containerAppCallbacks.url, 
          this.props.containerAppCallbacks.apiKey);

        let response: any = await aarrStatApi.ping(); // tslint:disable-line
        console.log(`Request result ${response.status}`); // tslint:disable-line

        if (response.status !== 200) {
          // tslint:disable-next-line
          console.log(`Request failed, error code ${response.status}, response: ${response}`);
          return;
        }

        // Finally enable telemetry for app
        localStorage.setItem('enableTelemetry', "true");

      } else {
        localStorage.setItem('enableTelemetry', "false");
      }
      this.setState({ 
        isSaving: false,
        hasChanges: false, 
        errorMessage: ''
      });
    }

    render() {
      // console.log("Url: ", this.props.containerAppCallbacks.url); // tslint:disable-line
      let buttonContentOrLoader = this.state.isSaving ? 
        <Loader /> : (
        <div>Save</div>
      );

      let buttonClasses = this.state.hasChanges ? 
        "ui large primary floated fluid submit button" : 
        "ui large primary floated fluid submit button disabled";
      let button = (
        <button 
          className={buttonClasses} 
          onClick={(ev: any) => this.saveSettings(this)} // tslint:disable-line
        >
          {buttonContentOrLoader}
        </button>
      );

      let deviceNameInputClasses = this.state.enableTelemetry ? 
        "ui left input" : 
        "ui left input disabled";

      let errorMessageOrEmpty = this.state.errorMessage && <div className="ui error message">{this.state.errorMessage}</div>;

      return (
        <div className="ui grid container">
          <div className="row"></div>

          {/* Header */}
          <div className="row">
            <div className="sixteen wide column">
              <h1 className="ui header center">
                Settings
              </h1>
            </div>
          </div>

          {/* Telemetry header and enable checkbox */}
          <div className="row">
            <div className="sixteen wide column">
              <h3 className="ui header">Telemetry</h3>
      
              <div className="ui toggle checkbox">
                <input 
                  type="checkbox" 
                  name="enable-telemetry" 
                  checked={this.state.enableTelemetry}
                  // tslint:disable-next-line
                  onChange={(ev: any) => this.setState({ enableTelemetry: !this.state.enableTelemetry, hasChanges: true }) }
                />
                <label className="">Enable telemetry</label>
              </div>
            </div>
          </div>

          {/* Device name */}
          <div className="row">
            <div className="ui sixteen wide column">
              <form className="ui large form">
                <div className="field">
                  <div className={deviceNameInputClasses}>
                    <input 
                      type="text" 
                      name="device-name" 
                      placeholder="Device name" 
                      
                      value={this.state.deviceName}
                      // tslint:disable-next-line
                      onChange={(ev: any) => this.setState({ deviceName: ev.target.value, hasChanges: true }) } 
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Telemetry info label */}
          <div className="row">
            <div className="ui sixteen wide column">
              <TelemetryInfo/>
            </div>
          </div>

          {errorMessageOrEmpty}

          {/* Save button */}
          <div className="row">
            <div className="ui sixteen wide column">
              {button}
            </div>
          </div>

        </div>);
    }
  }
  
export default SettingsForm;