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
}
