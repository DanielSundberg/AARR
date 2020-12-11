import { makeObservable, observable, action, runInAction } from 'mobx';
import OldReaderResource from '../clients/OldReaderResource';
import { Storage as storage } from '../utils/Storage';

export class AuthStore {
    auth: string = "";
    isLoading: boolean = false;
    errorMessage: string = "";

    constructor() {
        makeObservable(this, {
            auth: observable, 
            isLoading: observable,
            errorMessage: observable,
            login: action
        });
        this.auth = storage.getAuthToken();
    }

    async login(username: string, password: string) {
        runInAction(() => this.isLoading = true);
        console.log(`Logging in with ${username}`);
        // tslint:disable-next-line
        let response: any = await OldReaderResource.login(username, password);
        if (response.status === 403) {
            runInAction(() => {
                this.errorMessage = 'Could not log in, bad username or password?';
                this.isLoading = false;
            });
            return;
        }
        if (response.status === -1) {
            runInAction(() => {
                this.errorMessage = 'Request failed, please try again.';
                this.isLoading = false;
            });
            return;
        } 
        if (response.status !== 200) {
            runInAction(() => {
                this.errorMessage = `Request failed, error code ${response.status}`;
                this.isLoading = false;
            });
            return;
        } 

        // Now we're logged in, store auth token
        const data: any = await response.data; // tsline:disable-line
        if (data.Auth) {

            // Save auth token to local storage
            storage.setAuthToken(data.Auth);

            runInAction(() => {
                this.errorMessage = '';
                this.isLoading = false;
                this.auth = data.Auth;
            });

        } else {
            runInAction(() => {
                this.errorMessage = 'Could not get auth token, please try to login again!';
                this.isLoading = false;
            });
        }
    }

    async logout() {
        storage.clearAuthToken();
        runInAction(() => {
            this.auth = "";
        });
    }

    isAuthenticated() : boolean {
        return this.auth.length > 0;
    }

    hasError(): boolean {
        return this.errorMessage.length > 0;
    }
}
