import * as sha256 from 'crypto-js/sha256';
import { v4 as uuidv4 } from 'uuid';
import AARRStatApi from './AppUsageAPI';
import OldReaderResource from '../Model/OldReaderResource';
import { 
    getDeviceName,
    telemetryEnabled,
    getUserId,
    getDeviceId,
    getAuthToken,
    setUserId,
    setDeviceId,
    setDeviceName,
    setEnableTelemetry 
} from './Storage';

const aarrUuid = (): string => {
    return Buffer.from(sha256(uuidv4()).toString(), 'binary').toString('base64').substr(0, 12);
};

const base64Hash = (str: string): string => {
    return Buffer.from(sha256(str).toString(), 'binary').toString('base64').substr(0, 12);
};

export const newDeviceName = (() => {
    const existingDeviceName = getDeviceName();
    return existingDeviceName.length > 0 ? existingDeviceName : `My device ${Math.floor(Math.random() * 1000000)}`;
});

const ONE_HOUR = 3600000;

export class AppUsageResource {
    private url: string;
    private apiKey: string;
    private session: string = '';
    private sessionStart: Date = new Date(0);

    constructor(url: string, apiKey: string) {
        this.url = url;
        this.apiKey = apiKey;
    }

    async startSession() {
        if (telemetryEnabled()) {
            console.log(`Starting session, telemetry enabled, url=${this.url}`); // tslint:disable-line

            // If current session is older than one hour, create a new session anyway
            // We don't believe anyone is using a mobile app for more than one hour.
            const now = new Date();
            const sessionAge = (now.valueOf() - this.sessionStart.valueOf());

            console.log("Session start: ", this.sessionStart); // tslint:disable-line
            console.log("Now: ", now); // tslint:disable-line
            console.log("Session age: ", sessionAge); // tslint:disable-line
            console.log("Session: ", this.session); // tslint:disable-line

            const sessionTooOld = sessionAge > ONE_HOUR;
            const noExistingSession = this.session.length === 0;

            console.log("SessionTooOld: ", sessionTooOld); // tslint:disable-line
            console.log("NoSession: ", noExistingSession); // tslint:disable-line

            if (sessionTooOld || noExistingSession) {
                console.log("Starting new session."); // tslint:disable-line
                const newSession = aarrUuid();
                const newSessionStart = now;

                const userId = getUserId();
                const deviceId = getDeviceId();

                // We require userId and deviceId to be set
                // If not set we fail silently, user doesn't care if telemetry succeed or not
                if (userId.length > 0 && deviceId.length > 0) {

                    // Store commited session and sessionStart before call to aarrstat so that we 
                    // don't call startSession any more times if called again before below call 
                    // has returned.
                    this.session = newSession;
                    this.sessionStart = newSessionStart;

                    let aarrStatApi = new AARRStatApi(this.url, this.apiKey);
                    let response: any = await aarrStatApi.startSession("app", userId, deviceId, newSession); // tslint:disable-line
                    console.log(`Request result ${response.status}`); // tslint:disable-line
                    if (response.status !== 200) {
                        console.log(`Request failed, error code ${response.status}, response: `, response); // tslint:disable-line
                        return;
                    }
                }
            }
        } else {
            console.log('Starting session, telemetry disabled'); // tslint:disable-line
        }
    }

    async endSession() {
        if (telemetryEnabled()) {
            console.log(`Ending session, telemetry enabled, url=${this.url}`); // tslint:disable-line
    
            // If current session is older than one hour, create a new session anyway
            // We don't believe anyone is using a mobile app for more than one hour.
            if (this.session !== '') {
                const userId = getUserId();
                const deviceId = getDeviceId();
        
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

    async register(shouldEnableTelemetry: boolean, deviceName?: string) {

        // Fetch user info to get user id
        const authToken = getAuthToken();
        let rsp: any = await OldReaderResource.userInfo(authToken); // tslint:disable-line
        if (rsp.status !== 200) {
            return {
                errorMessage: rsp.message,
            };
        }
        let data: any = await rsp.data; // tslint:disable-line
        console.log("OldReader user id: ", data.userId); // tslint:disable-line

        // Create and store user id hash
        const userIdHash = base64Hash(data.userId);
        console.log("Hashed user id: ", userIdHash); // tslint:disable-line
        setUserId(userIdHash);

        // Create hashed device id if it doesn't already exist
        // This will stay the same as long as the app is installed
        let deviceIdHash = getDeviceId();
        console.log("Saved device id: ", deviceIdHash); // tslint:disable-line
        if (deviceIdHash.length !== 12) {
            deviceIdHash = aarrUuid();
            console.log("Hashed device id: ", deviceIdHash); // tslint:disable-line
            setDeviceId(deviceIdHash);
        }

        // Store device name entered by user
        const deviceNameToSet = deviceName || newDeviceName();
        setDeviceName(deviceNameToSet);

        let aarrStatApi = new AARRStatApi(this.url, this.apiKey);
        if (shouldEnableTelemetry) {

            // Register device with AARRStat api
            let response: any = await aarrStatApi.newDevice(deviceIdHash, userIdHash, deviceNameToSet); // tslint:disable-line
            console.log(`Request result ${response.status}`); // tslint:disable-line
            if (response.status !== 200) {
                console.log(`Request failed, error code ${response.status}, response: `, response); // tslint:disable-line
                return {
                    errorMessage: 'Request failed, please try again!',
                };
            }

            // Finally enable telemetry for local app
            setEnableTelemetry(true);
            return { errorMessage: "" };

        } else {

            // Tell AARR-stat we disabled telemetry
            let response: any = await aarrStatApi.newDevice(deviceIdHash, userIdHash, deviceNameToSet, false); // tslint:disable-line
            console.log(`Request result ${response.status}`); // tslint:disable-line
            if (response.status !== 200) {
                console.log(`Request failed, error code ${response.status}, response: `, response); // tslint:disable-line
                return {
                    errorMessage: 'Request failed, please try again!'
                };
            }

            // Finally disable telemetry for local app
            setEnableTelemetry(false);
            return { errorMessage: "" };
        }
    }
}
