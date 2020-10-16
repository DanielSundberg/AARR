import { ApiBase } from './ApiBase';

export default class AARRStatAPI extends ApiBase {
    async ping() {
        // tslint:disable-next-line
        return await super.getRequest(
            '/aarrstat/ping'
        );
    }

    async newDevice(deviceId: string, userId: string, description: string) {
        return await this.postRequest(
            '/aarrstat/newdevice',
            JSON.stringify(
                {
                    id: deviceId,
                    user: userId, 
                    description: description
                }
            )
        );
    }

    async startSession(type: string, userId: string, deviceId: string, session: string) {
        return await this.postRequest(
            '/aarrstat/startsession',
            JSON.stringify(
                {
                    type: type,
                    user: userId, 
                    device: deviceId,
                    session: session
                }
            )
        );
    }

    async endSession(session: string) {
        return await this.postRequest(
            '/aarrstat/endsession',
            JSON.stringify(
                {
                    session: session
                }
            )
        );
    }
}
