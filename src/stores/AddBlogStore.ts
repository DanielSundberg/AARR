import { makeObservable, observable, runInAction } from 'mobx';
import { AuthStore } from './AuthStore';
import OldReaderResource from '../clients/OldReaderResource';

export class AddBlogStore {
    auth: AuthStore;

    // Add
    isAddingFeed: boolean = false;
    addFeedSuccess: boolean = false;
    addFeedMessage: string = '';

    constructor(auth: AuthStore) {
        this.auth = auth;

        makeObservable(this, {
            isAddingFeed: observable, 
            addFeedSuccess: observable, 
            addFeedMessage: observable, 
        });
    }

    async add(feedUrl: string) {
        // console.log(`Adding feed ${feedUrl}, auth=${this.auth}`); 
        try {
            runInAction(() => this.isAddingFeed = true);
            let response = await OldReaderResource.add(this.auth.auth, feedUrl);
            if (response.status === -1) {
                runInAction(() => this.addFeedMessage = 'Could not add feed, request failed. Please try again.');
                return;
            }
            if (response.status !== 200) {
                runInAction(() => this.addFeedMessage = 'Could not add feed!');
                return;
            }
            
            let data : any = await response.data; // tslint:disable-line
            // "numResults":1,"streamId":"feed/00157a17b192950b65be3791"
            let numResults = data.numResults;
            if (numResults > 0) {
                runInAction(() => {
                    this.addFeedMessage = `Successfully added ${numResults} feed!`;
                    this.addFeedSuccess = true;
                });
                // TODO: would have been nice to display feed title here 
                //       but then we would have to fetch complete blog 
                //       list here. We'll do that when we go back instead... 
            } else {
                runInAction(() => {
                    this.addFeedMessage = 'Could not add feed! Invalid url?';
                    this.addFeedSuccess = false;
                });
            }
        } finally {
            runInAction(() => this.isAddingFeed = false);
        }
    }
}
