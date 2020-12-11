import { makeObservable, observable, runInAction } from 'mobx';
import { AuthStore } from './AuthStore';
import { BlogInfo } from './BlogInfo';
import OldReaderResource from '../clients/OldReaderResource';
import StringUtils from '../utils/StringUtils';
import _ from 'lodash';
import { BlogPost } from './BlogPost';

export class BlogStore {
    bloglist: BlogInfo[] = [];
    isUpdatingList: boolean = false;
    errorMessage: string = "";
    showAllFeeds: boolean = false;
    auth: AuthStore;
    currentBlogTitle: string = '';
    isLoadingPosts: boolean = false;
    blogUid: string = '';
    blogPostlist: BlogPost[] = [];
    postsBeingEdited: string[] = [];

    constructor(auth: AuthStore) {
        this.auth = auth;

        makeObservable(this, {
            isUpdatingList: observable,
            errorMessage: observable,
            bloglist: observable, 
            showAllFeeds: observable, 
            blogPostlist: observable,
            isLoadingPosts: observable, 
            postsBeingEdited: observable
        });
    }

    async getBlogList() {
        if (!this.isUpdatingList) {
            try {
                // First show loader in UI
                runInAction(() => this.isUpdatingList = true);

                // List subscriptions
                // tslint:disable-next-line
                let rsp: any = await OldReaderResource.listFeeds(this.auth.auth);
                this.checkHttpError(rsp, "Could not fetch subscriptions, please try again.");

                // Store subscriptions in state
                // tslint:disable-next-line
                let data: any = await rsp.data;
                for (let subscription of data.subscriptions) {
                    const uid = StringUtils.afterSlash(subscription.id);
                    const blogInfo = _.find(this.bloglist, { uid: uid });
                    if (!blogInfo) {
                        runInAction(() => 
                            this.bloglist.push(
                                new BlogInfo(uid, subscription.title, '', 0, 'https:' + subscription.iconUrl)
                            )
                        );
                    }
                }
                
                // Now fetch unread count
                rsp = await OldReaderResource.unreadCount(this.auth.auth);
                this.checkHttpError(rsp, "Could not fetch subscriptions, please try again.");
                data = await rsp.data;

                // Store unread count in blog list
                // tslint:disable-next-line
                for (let unread of (data as any).unreadcounts) {
                    const blogInfo = _.find(this.bloglist, { uid: StringUtils.afterSlash(unread.id) });
                    if (blogInfo) {
                        runInAction(() => blogInfo.unread = unread.count);
                    }
                }

            } finally {
                // Now turn off loader
                runInAction(() => {
                    this.isUpdatingList = false;
                });
            }
        }
    }

    async getBlogPosts(uid: string) {
        this.currentBlogTitle = '';
        runInAction(() => this.isLoadingPosts = true);
        console.log('Blog uid: ', uid);
        this.blogUid = uid;
        runInAction(() => this.blogPostlist = observable([]));

        // We will now fetch posts for the currently selected blog

         // Determine if we should fetch all or only unread
         const selectedBlog = _.find(this.bloglist, { uid: uid });
         let onlyUnread =  true;
         if (selectedBlog) {
             this.currentBlogTitle = selectedBlog.title;
             onlyUnread = selectedBlog.unread > 0;
         }

         // First fetch post ids

        // tslint:disable-next-line
        let rsp : any = await OldReaderResource.getPostIds(this.auth.auth, `feed/${uid}`, onlyUnread)
            .catch(err => {
                return {
                    status: -1
                };
            });
        if (rsp.status !== 200) {
            runInAction(() => {
                this.errorMessage = "Could not fetch posts, please try again.";
                this.isLoadingPosts = false;
            });
            return;
        }

        let data: any = await rsp.json(); // tslint:disable-line

        // Now create list of blog posts
        // tslint:disable-next-line
        runInAction(() => this.blogPostlist = _.map(data.itemRefs, (r: any) => { return new BlogPost(r.id, !onlyUnread); })); 
        // console.log(itemRefs)

        // Fetch first N unread posts
        if (this.blogPostlist.length > 0) {
            this.fetchFiveUnreadPosts();
        } else {
            runInAction(() => this.isLoadingPosts = false);
        }
    }

    async fetchFiveUnreadPosts() {
        runInAction(() => this.isLoadingPosts = true);
        
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
        let response = await OldReaderResource.getPosts(this.auth.auth, idsToFetch);
        let data: any = await response.json(); // tslint:disable-line
        // console.log(data);

        // Go through each post and add content and info to our post collection
        runInAction(() => {
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
        });
    }

    checkHttpError(response: any, httpErrorMessage: string) {
        if (response.status === -1) {
            this.errorMessage = response.message;
            throw new Error();
        }
        if (response.status !== 200) {
            this.errorMessage = httpErrorMessage;
            throw new Error();
        }
    }

    toggleShowAll() {
        runInAction(() => this.showAllFeeds = !this.showAllFeeds);
    }

    async markPostAsRead(uid: string, read: boolean) {
        // Tell UI we're waiting for API
        runInAction(() => this.postsBeingEdited.push(uid));

        // Mark post as read
        const blogPost = _.find(this.blogPostlist, { uid: uid });
        if (blogPost) {
            let response = await OldReaderResource.markAsRead(this.auth.auth, uid, read);
            if (response.status === 200) {
                runInAction(() => blogPost.read = read);
            }
        }

        // Tell view we're not waiting for API any more
        const index = this.postsBeingEdited.indexOf(uid, 0);
        if (index > -1) {
           runInAction(() => this.postsBeingEdited.splice(index, 1));
        }
    }
}
