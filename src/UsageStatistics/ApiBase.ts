export class ApiBase {

    baseUrl: string;
    auth: string;
    useApiKey: boolean;

    constructor(baseUrl: string, auth: string = "", useApiKey: boolean = true) {
        const env = process.env.NODE_ENV || 'dev';
        this.baseUrl = (env === 'production') ? baseUrl : "";
        this.auth = auth;
        this.useApiKey = useApiKey;
    }

    async rawGetRequest(path: string) {
        const headers = this.useApiKey ? 
            new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-api-key': this.auth,
            }) : 
            new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'GoogleLogin auth=' + this.auth,
            });

        let response = fetch(`${this.baseUrl}${path}`, {
            method: 'GET',
            headers: headers,
        });
        return response;
    }

    async getRequest(path: string) {
        // tslint:disable-next-line
        let rsp : any = await (
            await this.rawGetRequest(path)
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

    // tslint:disable-next-line
    async postRequest(path: string, body: any = null) {
        let headers = new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        });
        // Add authorization headers if supplied
        if (this.auth.length > 0) {
            if (this.useApiKey) {
                headers.append('x-api-key', this.auth);
            } else {
                headers.append('Authorization', 'GoogleLogin auth=' + this.auth);
            }
        }
        
        // tslint:disable-next-line
        let rsp : any = await (
            await fetch(
                `${this.baseUrl}${path}`, 
                {
                    method: 'POST',
                    headers: headers,
                    body: body
                })
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
                    return { status: -1 };
                }));
        return rsp;
    }
}