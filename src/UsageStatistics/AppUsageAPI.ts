import { ApiBase } from './ApiBase';

export default class AppUsageAPI extends ApiBase {
    async ping() {
        // tslint:disable-next-line
        return await super.getRequest(
            '/api/session/ping'
        );
    }

    async newDevice(deviceId: string, userId: string, description: string, enabled: boolean = true) {
        return await this.postRequest(
            '/api/device/new',
            JSON.stringify(
                {
                    id: deviceId,
                    user: userId, 
                    description: description,
                    enabled: enabled
                }
            )
        );
    }

    async startSession(type: string, userId: string, deviceId: string, session: string) {
        return await this.postRequest(
            '/api/session/start',
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
            '/api/session/end',
            JSON.stringify(
                {
                    session: session
                }
            )
        );
    }
}
