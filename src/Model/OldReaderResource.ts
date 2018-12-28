class OldReaderResource {
    baseUrl: string;
    signUpUrl: string = "https://theoldreader.com/users/sign_up";
    forgotPwdUrl: string = "https://theoldreader.com/users/password/new";
    
    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async getRequest(auth: string, path: string, errorMessage: string, setError: (errorMessage: string) => void) {
        // tslint:disable-next-line
        let data : any = await (
            await this.rawGetRequest(auth, path)
                .then(res => {
                    return res.json();
                })
                .catch(err => {
                    setError(errorMessage);
                }));
        return data;
    }

    async postRequest(
        auth: string, 
        path: string, 
        body: string, 
        errorMessage: string, 
        setError: (errorMessage: string) => void
    ) {
        // tslint:disable-next-line
        let data : any = await (
            await this.rawPostRequest(auth, path, body)
                .then(res => {
                    return res.json();
                })
                .catch(err => {
                    setError(errorMessage);
                }));
        return data;
    }

    async rawGetRequest(auth: string, path: string) {
        let response = fetch(`${this.baseUrl}${path}?output=json`, {
            method: 'GET',
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'GoogleLogin auth=' + auth,
            }),
        });
        return response;
    }

    async rawPostRequest(auth: string, path: string, body: string) {
        let headers: Headers;
        if (auth.length === 0) {
            headers = new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            });
        } else {
            headers = new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'GoogleLogin auth=' + auth,
            });
        }

        let response = fetch(
            `${this.baseUrl}/reader/api/0/accounts/ClientLogin`, 
            {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body)
            }
        );
        return response;
    }

    async login(username: string, password: string, setError: (errorMessage: string) => void)  {
        // tslint:disable-next-line
        const body: any = {
            client: 'YATORClientV1',
            accountType: 'HOSTED_OR_GOOGLE',
            service: 'reader',
            Email: username,
            Passwd: password,
            output: 'json'
        };
        return await this.postRequest(
            '', 
            '/reader/api/0/accounts/ClientLogin',
            body,
            'Failed to login, please try again.',
            setError
        );
    }

    async add(auth: string, feedUrl: string) {
        let encodedFeedUrl = encodeURIComponent(feedUrl);
        let urlToFetch = `${this.baseUrl}/reader/api/0/subscription/quickadd?quickadd=${encodedFeedUrl}`;
        // console.log("Url to fetch: ", urlToFetch);
        let response = fetch(urlToFetch, {
            method: 'POST',
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'GoogleLogin auth=' + auth,
            }),
        });
        return response;
    }

    async listFeeds(auth: string, setError: (errorMessage: string) => void) {
        return await this.getRequest(
            auth, 
            '/reader/api/0/subscription/list',
            'Failed to fetch subscriptions, please try again.',
            setError);
    }

    async unreadCount(auth: string, setError: (errorMessage: string) => void) {
        return await this.getRequest(
            auth, 
            '/reader/api/0/unread-count',
            'Failed to fetch unread count, please try again.',
            setError);
    }

    async getPostIds(auth: string, uid: string, onlyUnread: boolean) {
        const params = onlyUnread ? {
            output: 'json',
            s: uid,
            xt: 'user/-/state/com.google/read',
            n: 100,
        } : {
            output: 'json',
            s: 'user/-/state/com.google/reading-list',
            n: 100,
        };

        let response = fetch(
            `${this.baseUrl}/reader/api/0/stream/items/ids?` + this.serialize(params) + '&' + this.serialize({s: uid}), 
            {
                method: 'GET',
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    'Authorization': 'GoogleLogin auth=' + auth,
                }),
            });
        return response;
    }

    async getPosts(auth: string, ids: string[]) {
        let contentParams = this.serialize({ output: 'json' });
        let path = `${this.baseUrl}/reader/api/0/stream/items/contents`;

        for (var i = 0; i < ids.length; i++) {   
            // console.log(ids[i]);      
            contentParams += '&' + this.serialize({ i: 'tag:google.com,2005:reader/item/' + ids[i] });
        }

        const itemContentUrl = path + '?' + contentParams;
        // console.log("Content url: ", itemContentUrl);

        let response = fetch(itemContentUrl, {
            method: 'GET',
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'GoogleLogin auth=' + auth,
            }),
        });
        return response;
    }

    async markAsRead(auth: string, id: string, read: boolean) {
        const bodyParams = read ? { 
            // Mark as read
            a: 'user/-/state/com.google/read',
            i: 'tag:google.com,2005:reader/item/' + id,
        } : 
        {
            // Mark as unread
            r: 'user/-/state/com.google/read',
            i: 'tag:google.com,2005:reader/item/' + id,
        };
        let path = `${this.baseUrl}/reader/api/0/edit-tag`;
        let response = fetch(path, {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'Authorization': 'GoogleLogin auth=' + auth,
            }),
            body: this.serialize(bodyParams)
        });
        return response;
    }

    private serialize(obj: {}) {
        var str = [];
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
            }
        }
        return str.join('&');
    }
}

const env = process.env.NODE_ENV || 'dev';
const oldReaderResource = (env === 'production') ? 
    new OldReaderResource('https://theoldreader.com') : 
    new OldReaderResource('');

export default oldReaderResource as OldReaderResource;
