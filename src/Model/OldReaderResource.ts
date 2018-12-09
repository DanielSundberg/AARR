class OldReaderResource {
    baseUrl: string;
    
    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async login(username: string, password: string)  {
        let response = fetch(
            `${this.baseUrl}/reader/api/0/accounts/ClientLogin`, 
            {
                method: 'POST',
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                }),
                body: JSON.stringify({
                    client: 'YATORClientV1',
                    accountType: 'HOSTED_OR_GOOGLE',
                    service: 'reader',
                    Email: username,
                    Passwd: password,
                    output: 'json',
                })
            }
        );
        return response;
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

    async listFeeds(auth: string) {
        let response = fetch(`${this.baseUrl}/reader/api/0/subscription/list?output=json`, {
            method: 'GET',
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'GoogleLogin auth=' + auth,
            }),
        });
        return response;
    }

    async unreadCount(auth: string) {
        let response = fetch(`${this.baseUrl}/reader/api/0/unread-count?output=json`, {
            method: 'GET',
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'GoogleLogin auth=' + auth,
            }),
        });
        return response;
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