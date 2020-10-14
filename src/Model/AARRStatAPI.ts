export default class AARRStatAPI {
    baseUrl: string;
    apiKey: string;
    
    constructor(baseUrl: string, apiKey: string) {
        const env = process.env.NODE_ENV || 'dev';
        this.baseUrl = (env === 'production') ? baseUrl : "";
    }

    async rawGetRequest(auth: string, path: string) {
        let response = fetch(`${this.baseUrl}${path}`, {
            method: 'GET',
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey,
            }),
        });
        return response;
    }

    async getRequest(auth: string, path: string) {
        // tslint:disable-next-line
        let rsp : any = await (
            await this.rawGetRequest(auth, path)
                .then(res => {
                    if (res.status === 200) {
                        return {
                            data: res.json(), 
                            status: res.status
                        };
                    } else {
                        return {
                            status: res.status
                        }; 
                    } 
                })
                .catch(err => {
                    return {
                        status: -1,
                        message: "Request failed, please try again."
                    };
                }));
        return rsp;
    }

    async ping() {
        // tslint:disable-next-line
        return await this.getRequest(
            '', 
            '/aarrstat/ping'
        );
    }
}
