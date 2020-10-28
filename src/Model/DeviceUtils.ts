import AARRStatApi from '../Model/AARRStatAPI';
import OldReaderResource from '../Model/OldReaderResource';
import * as sha256 from 'crypto-js/sha256';
import { v4 as uuidv4 } from 'uuid';

export const newDeviceName = (() => {
    return localStorage.getItem('deviceName') || `My device ${Math.floor(Math.random() * 1000000)}`;
});

export const register = (async(url: string, apiKey: string, enableTelemetry: boolean, deviceName?: string) => {
    let aarrStatApi = new AARRStatApi(url, apiKey);

    // Fetch user info to get user id
    const authToken = localStorage.getItem('authToken') || "";
    let rsp: any = await OldReaderResource.userInfo(authToken); // tslint:disable-line
    if (rsp.status !== 200) {
        return {
            errorMessage: rsp.message,
        };
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

    // Store device name entered by user
    const deviceNameToSet = deviceName || newDeviceName();
    localStorage.setItem('deviceName', deviceNameToSet);
    
    if (enableTelemetry) {

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
        localStorage.setItem('enableTelemetry', "true");
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
        localStorage.setItem('enableTelemetry', "false");
        return { errorMessage: "" };
    }
});
