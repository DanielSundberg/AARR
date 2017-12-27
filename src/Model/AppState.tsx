import { observable } from 'mobx';
import * as _ from 'lodash';
import { BlogInfo } from './BlogInfo';
import { BlogPost } from './BlogPost';
import OldReaderResource from './OldReaderResource';
import { RouterStore } from 'mobx-react-router';

export enum Route {
    BlogList = 1,
    BlogPost = 2,
    Loader = 3,
    NoPosts = 4,
    CheckAuth = 5,
    Login = 6,
}

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
    @observable route: Route = Route.CheckAuth;
    auth: string;
    @observable isLoadingPosts: boolean;
    @observable isUpdatingList: boolean;
    @observable loginError: string;
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
        const authToken = localStorage.getItem("authToken");
        if (authToken) {
            this.auth = authToken;
            this.loggedIn = LoggedInState.LoggedIn;
            // this.getListOfBlogs();
        } else {
            this.loggedIn = LoggedInState.NotLoggedIn;
        }
    }

    async showBlog(uid: string) {
        this.isLoadingPosts = true;
        // console.log('Blog uid: ', uid);
        this.blogUid = uid;
        this.blogPostlist = observable([]);

        this.checkAuth();

        // Fetch posts for currently selected blog

        // First fetch post ids
        let response = await OldReaderResource.getPostIds(this.auth, `feed/${uid}`);
        let data: MyApiData = await response.json();
        // console.log(data);

        // Now create list of blog posts
        this.blogPostlist = _.map((data as any).itemRefs, (r: any) => { return new BlogPost(r.id); });
        // console.log(itemRefs)

        // Fetch first 5 unread posts
        this.fetchFiveUnreadPosts();
    }

    async fetchFiveUnreadPosts() {
        this.isLoadingPosts = true;
        const notFetchedPosts = _.filter(this.blogPostlist, { fetched: false });
        if (!notFetchedPosts) {
            this.route = Route.NoPosts;
            return;
        }        
        // console.log('Not fetched posts: ', notFetchedPosts);
        const nofPostsToFetch = notFetchedPosts.length > 5 ? 5 : notFetchedPosts.length;
        const postsToFetch = _.filter(notFetchedPosts, (p, i) => {
            return i < nofPostsToFetch;
        });
        const idsToFetch = _.map(postsToFetch, (p) => { return p.uid; });
        console.log('Fetching: ', idsToFetch);
        let response = await OldReaderResource.getPosts(this.auth, idsToFetch);
        let data: any = await response.json();
        // console.log(data);
        for (var post of data.items) {
            // console.log('Fetched post id: ', post.id);
            // console.log(post.title);
            // console.log(post.summary.content)
            const altnernate = _.head(post.alternate) as any;
            let url = '';
            if (altnernate) {
                url = altnernate.href;
            }
            // console.log(altnernate.href);
            var n = post.id.lastIndexOf('/');
            var uidToMatch = post.id.substring(n + 1);
            const blogPost = _.find(this.blogPostlist, { uid: uidToMatch });
            if (blogPost) {
                console.log('Setting post content: ', blogPost.uid);
                blogPost.title = post.title;
                blogPost.content = post.summary.content;
                blogPost.fetched = true;
                blogPost.date = new Date(post.timestampUsec / 1000);
                blogPost.author = post.author;
                blogPost.url = url;
                console.log(blogPost.date);
            }
        }

        this.route = Route.BlogPost;
        this.isLoadingPosts = false;
    }

    async markPostAsRead(uid: string, read: boolean) {
        this.postsBeingEdited.push(uid);
        let blogPost = _.find(this.blogPostlist, { uid: uid });
        if (blogPost) {
            let response = await OldReaderResource.markAsRead(this.auth, uid, read);
            if (response.status === 200) {
                blogPost.read = read;
            }
        }
        
        const index = this.postsBeingEdited.indexOf(uid, 0);
        if (index > -1) {
           this.postsBeingEdited.splice(index, 1);
        }
    }

    async login(username: string, password: string) {
        this.route = Route.BlogList;
        // console.log(`Logged in with ${username}`);        
        let response = await OldReaderResource.login(username, password);
        if (response.status !== 200) {
            this.loginError = 'Could not log in, bad username or password?';
        } else {
            this.loginError = '';
            let data: any = await response.json();
            
            // TODO: Check for login error

            // Now we're logged in
            if (data.Auth) {
                this.auth = data.Auth;

                // Save token to local storage
                localStorage.setItem("authToken", this.auth);
                this.routing.push('/blogs')
            }
        }
    }

    logout() {
        localStorage.removeItem("authToken");
        this.bloglist = observable([]);
        this.blogPostlist = observable([]);
        this.routing.push('/login');
    }

    async getListOfBlogs() {
        this.route = Route.BlogList;
        this.isUpdatingList = true;

        this.checkAuth();

        let response = await OldReaderResource.listFeeds(this.auth);
        let data : any = await response.json();

        // Store subscriptions
        for (let subscription of (data as any).subscriptions) {
            const uid = this.afterSlash(subscription.id);
            const blogInfo = _.find(this.bloglist, { uid: uid });
            if (!blogInfo) {
                this.bloglist.push(new BlogInfo(uid, subscription.title, '', 0));            
            }
        }
        
        // Now fetch unread count
        response = await OldReaderResource.unreadCount(this.auth);
        data = await response.json();

        // Store unread count in blog list
        for (let unread of (data as any).unreadcounts) {
            const blogInfo = _.find(this.bloglist, { uid: this.afterSlash(unread.id) });
            if (blogInfo) {
                blogInfo.unread = unread.count;
            }
        }

        this.isUpdatingList = false;
    }

    private afterSlash(s: string) : string {
        const lastslashindex = s.lastIndexOf('/');
        if (s.length > lastslashindex) 
            return s.substring(lastslashindex + 1);
        else 
            return '';
    }
}

export default AppState;