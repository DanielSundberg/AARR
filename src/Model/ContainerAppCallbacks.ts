import * as sha256 from 'crypto-js/sha256';
import { v4 as uuidv4 } from 'uuid';
import AARRStatApi from '../Model/AARRStatAPI';

export default class ContainerAppCallbacks {
  url: string;
  apiKey: string;
  session: string = '';
  sessionStart: Date = new Date(0);

  init(url: string, apiKey: string) {
    this.url = url;
    this.apiKey = apiKey;
  }

  async onResume() {
    const telemetryEnabled: boolean = localStorage.getItem('enableTelemetry') === "true";
    if (telemetryEnabled) {
      console.log(`Starting session, telemetry enabled, url=${this.url}`); // tslint:disable-line

      // If current session is older than one hour, create a new session anyway
      // We don't believe anyone is using a mobile app for more than one hour.
      const now = new Date();
      const sessionIsOlderThanOneHour = (now.valueOf() - this.sessionStart.valueOf()) > 3600;
      if (sessionIsOlderThanOneHour || this.session === '') {
        const newSession = sha256(uuidv4()).toString();
        const newSessionStart = now;

        const userId = localStorage.getItem('userId') || "";
        const deviceId = localStorage.getItem('deviceId') || "";

        // We require userId and deviceId to be set
        // If not set we fail silently, user doesn't care if telemetry succeed or not
        if (userId.length > 0 && deviceId.length > 0) {

          let aarrStatApi = new AARRStatApi(this.url, this.apiKey);
          let response: any = await aarrStatApi.startSession("app", userId, deviceId, newSession); // tslint:disable-line
          console.log(`Request result ${response.status}`); // tslint:disable-line
          if (response.status !== 200) {
            console.log(`Request failed, error code ${response.status}, response: `, response); // tslint:disable-line
            return;
          }

          // Store commited session and sessionStart
          this.session = newSession;
          this.sessionStart = newSessionStart;
        }
      }
    } else {
      console.log('Starting session, telemetry disabled'); // tslint:disable-line
    }
  }

  async onPause() {
    const telemetryEnabled: boolean = localStorage.getItem('enableTelemetry') === "true";
    if (telemetryEnabled) {
      console.log(`Ending session, telemetry enabled, url=${this.url}`); // tslint:disable-line

      // If current session is older than one hour, create a new session anyway
      // We don't believe anyone is using a mobile app for more than one hour.
      if (this.session !== '') {
        const userId = localStorage.getItem('userId') || "";
        const deviceId = localStorage.getItem('deviceId') || "";

        // We require userId and deviceId to be set
        // If not set we fail silently, user doesn't care if telemetry succeed or not
        if (userId.length > 0 && deviceId.length > 0) {
          let aarrStatApi = new AARRStatApi(this.url, this.apiKey);
          let response: any = await aarrStatApi.endSession(this.session); // tslint:disable-line
          console.log(`Request result ${response.status}`); // tslint:disable-line
          if (response.status !== 200) {
            console.log(`Request failed, error code ${response.status}, response: `, response); // tslint:disable-line
          }
        }

        // Reset session and sessionStart even if something failed
        this.session = '';
        this.sessionStart = new Date();
      }
    } else {
      console.log('Ending session, telemetry disabled'); // tslint:disable-line
    }
  }
}