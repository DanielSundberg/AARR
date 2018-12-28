import { observable } from 'mobx';
import * as _ from 'lodash';
import { BlogInfo } from './BlogInfo';
import { BlogPost } from './BlogPost';
import OldReaderResource from './OldReaderResource';
import { RouterStore } from 'mobx-react-router';
import StringUtils from './StringUtils';

export enum LoggedInState {
    Unknown = 0, 
    NotLoggedIn = 1,
    LoggedIn = 2,
}

interface MyApiData {
    name: string;
}

class AppState {
    @observable bloglist: BlogInfo[] = [];
    @observable blogPostlist: BlogPost[] = [];
    @observable postsBeingEdited: string[] = [];
    @observable blogUid: string;
    @observable loggedIn: LoggedInState;
    auth: string;
    @observable isLoadingPosts: boolean;
    @observable isUpdatingList: boolean;
    @observable loginError: string;
    @observable currentBlogTitle: string = '';
    @observable addFeedMessage: string = 'No feed addad';
    @observable addFeedSuccess: boolean = false;
    @observable addedFeedId: string = '';
    @observable isAddingFeed: boolean = false;
    @observable showAllFeeds: boolean = false;
    @observable showMenu: boolean = false;
    @observable errorMessage: string = '';
    routing: RouterStore;
  
    constructor(routing: RouterStore) {
        this.bloglist = observable([]);
        this.blogPostlist = observable([]);
        this.isLoadingPosts = false;
        this.loggedIn = LoggedInState.Unknown;
        this.routing = routing;
        this.loginError = '';
    }

    async checkAuth() {
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
            this.auth = authToken;
            this.loggedIn = LoggedInState.LoggedIn;
        } else {
            this.loggedIn = LoggedInState.NotLoggedIn;
        }
    }

    async showBlog(uid: string) {
        this.currentBlogTitle = '';
        this.isLoadingPosts = true;
        // console.log('Blog uid: ', uid);
        this.blogUid = uid;
        this.blogPostlist = observable([]);
        this.addedFeedId = '';

        this.checkAuth();

        // Fetch posts for currently selected blog
        const selectedBlog = _.find(this.bloglist, { uid: uid });
        let onlyUnread =  true;
        if (selectedBlog) {
            this.currentBlogTitle = selectedBlog.title;
            onlyUnread = selectedBlog.unread > 0;
        }

        // First fetch post ids
        let response = await OldReaderResource.getPostIds(this.auth, `feed/${uid}`, onlyUnread);
        let data: MyApiData = await response.json();

        // Now create list of blog posts
        this.blogPostlist = _.map((data as any).itemRefs, (r: any) => { return new BlogPost(r.id, !onlyUnread); }); // tslint:disable-line
        // console.log(itemRefs)

        // Fetch first 5 unread posts
        if (this.blogPostlist.length > 0) {
            this.fetchFiveUnreadPosts();
        } else {
            this.isLoadingPosts = false;
        }
    }

    async fetchFiveUnreadPosts() {
        this.isLoadingPosts = true;
        
        // Get posts not previously fetched
        const notFetchedPosts = _.filter(this.blogPostlist, { fetched: false });
        if (!notFetchedPosts) {
            return;
        }        
        // console.log('Not fetched posts: ', notFetchedPosts);
        const nofPostsToFetch = notFetchedPosts.length > 5 ? 5 : notFetchedPosts.length;
        const postsToFetch = _.filter(notFetchedPosts, (p, i) => {
            return i < nofPostsToFetch;
        });
        const idsToFetch = _.map(postsToFetch, (p) => { return p.uid; });
        // console.log('Fetching: ', idsToFetch);

        // Fetch actual post content
        let response = await OldReaderResource.getPosts(this.auth, idsToFetch);
        let data: any = await response.json(); // tslint:disable-line
        // console.log(data);

        // Go through each post and add content and info to our post collection
        for (var post of data.items) {
            // console.log('Fetched post id: ', post.id);
            // console.log(post.title);
            // console.log(post.summary.content)
            const altnernate = _.head(post.alternate) as any; // tslint:disable-line
            let url = '';
            if (altnernate) {
                url = altnernate.href;
            }
            // console.log(altnernate.href);
            var n = post.id.lastIndexOf('/');
            var uidToMatch = post.id.substring(n + 1);
            const blogPost = _.find(this.blogPostlist, { uid: uidToMatch as string });
            if (blogPost) {
                // console.log('Setting post content: ', blogPost.uid);
                blogPost.title = post.title;
                blogPost.content = post.summary.content;
                blogPost.fetched = true;
                blogPost.date = new Date(post.timestampUsec / 1000);
                blogPost.author = post.author;
                blogPost.url = url;
                // console.log(blogPost.date);
            }
        }

        this.isLoadingPosts = false;
    }

    async markPostAsRead(uid: string, read: boolean) {
        // Tell UI we're waiting for API
        this.postsBeingEdited.push(uid);

        // Mark post as read
        let blogPost = _.find(this.blogPostlist, { uid: uid });
        if (blogPost) {
            let response = await OldReaderResource.markAsRead(this.auth, uid, read);
            if (response.status === 200) {
                blogPost.read = read;
            }
        }

        // Tell view we're not waiting for API any more
        const index = this.postsBeingEdited.indexOf(uid, 0);
        if (index > -1) {
           this.postsBeingEdited.splice(index, 1);
        }
    }

    async login(username: string, password: string) {
        // console.log(`Logged in with ${username}`);        
        // tslint:disable-next-line
        let data: any = await OldReaderResource.login(username, password, (e) => { this.setErrorMessage(e); });
        if (this.errorMessage.length > 0) {
            this.loginError = 'Could not log in, bad username or password?';
            this.dismissError();
            return;
        } 
        
        // Now we're logged in
        if (data.Auth) {
            this.loginError = '';
            this.auth = data.Auth;

            // Save auth token to local storage
            localStorage.setItem('authToken', this.auth);
            this.routing.push('/blogs');
        } else {
            this.loginError = 'Could not get auth token, please try to login again!';  
        }
    }

    async add(feedUrl: string) {
        // console.log(`Adding feed ${feedUrl}`); 
        this.isAddingFeed = true;       
        let response = await OldReaderResource.add(this.auth, feedUrl);
        if (response.status !== 200) {
            this.addFeedMessage = 'Could not add feed!';
            this.addFeedSuccess = false;
        } else {
            let data : any = await response.json(); // tslint:disable-line
            // "numResults":1,"streamId":"feed/00157a17b192950b65be3791"
            let numResults = data.numResults;
            if (numResults > 0) {
                this.addFeedMessage = `Successfully added ${numResults} feed!`;
                this.addFeedSuccess = true;
                this.addedFeedId = data.streamId;
                // TODO: would have been nice to display feed title here 
                //       but then we would have to fetch complete blog 
                //       list here. We'll do that when we go back instead... 
        } else {
                this.addFeedMessage = 'Could not add feed!';
                this.addFeedSuccess = false;
            }
        }
        this.isAddingFeed = false;
    }

    toggleShowAll() {
        this.showAllFeeds = !this.showAllFeeds;
    }

    toggleShowMenu() {
        this.showMenu = !this.showMenu;
    }

    dismissError() {
        this.errorMessage = '';
    }

    setErrorMessage(errorMessage: string) {
        this.errorMessage = errorMessage;
    }

    logout() {
        // Clear auth token from storage
        localStorage.removeItem("authToken");

        // Cleanup data
        this.bloglist = observable([]);
        this.blogPostlist = observable([]);
        this.routing.push('/login');
    }

    async getListOfBlogs() {
        try {
            // First show loader in UI
            this.isUpdatingList = true;

            this.checkAuth();

            // List subscriptions
            // tslint:disable-next-line
            let data: any = await OldReaderResource.listFeeds(this.auth, (e) => { this.setErrorMessage(e); });
            if (this.errorMessage.length > 0) {
                return;
            }

            // Store subscriptions in state
            for (let subscription of data.subscriptions) {
                const uid = StringUtils.afterSlash(subscription.id);
                const blogInfo = _.find(this.bloglist, { uid: uid });
                if (!blogInfo) {
                    this.bloglist.push(
                        new BlogInfo(uid, subscription.title, '', 0, 'https:' + subscription.iconUrl)
                    );            
                }
            }
            
            // Now fetch unread count
            data = await OldReaderResource.unreadCount(this.auth, (e) => { this.setErrorMessage(e); });
            if (this.errorMessage.length > 0) {
                return;
            }

            // Store unread count in blog list
            // tslint:disable-next-line
            for (let unread of (data as any).unreadcounts) {
                const blogInfo = _.find(this.bloglist, { uid: StringUtils.afterSlash(unread.id) });
                if (blogInfo) {
                    blogInfo.unread = unread.count;
                }
            }
            
        } finally {
            // Now turn off loader
            this.isUpdatingList = false;
        }
    }
}

export default AppState;