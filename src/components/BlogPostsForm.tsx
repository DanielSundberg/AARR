import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useStores } from '../stores/RootStore';
import _ from 'lodash';
import { fullscreenBelowMenuStyle } from './CustomStyles';
import { useParams } from 'react-router';
import { BlogPostView } from './BlogPostView';
import Headroom from 'react-headroom';
import { BlogPostNavBar } from './BlogPostNavBar';
import { ErrorMessage, ErrorMessageType } from './ErrorMessage';
import InfiniteScroll from 'react-infinite-scroller';

export const BlogPostsForm = observer(() => {
    const { blog, theme } = useStores();
    const { blogId } = useParams<{blogId: string}>();

    // Fetch blog list
    useEffect(() => { blog.getBlogPosts(blogId); }, [blog.getBlogPosts, blog, blogId]);

    const moreToFetch = () =>  {
        const moreToFetch = _.some(blog.blogPostlist, (b) => {
            return !b.fetched;
        });
        return moreToFetch;
    }

    const loadMore = () => {
        if (moreToFetch()) {
            blog.fetchFiveUnreadPosts();
        }
    };

    const blogPosts = _.map(blog.blogPostlist, (b, i) => {
            return (
                <BlogPostView
                    key={i}
                    index={i}
                    title={b.title}
                    date={b.date}
                    author={b.author}
                    url={b.url}
                    content={b.content}
                    read={b.read}
                    uid={b.uid}
                />
            );
        });

    const moreToFetchloader = (
        <div className="row" key={65535}>
            <div className="sixteen wide column">
            <div 
                className="ui mini text active centered inline loader" 
                style={theme.blogText()}
            >
                Loading posts...
            </div>
            </div>
        </div>);

    return (
        <div className="container" style={theme.listBackground()}>
            {/* <ScrollToTop /> */}
            <Headroom>
                <BlogPostNavBar title={blog.currentBlogTitle}/>
            </Headroom>
            <ErrorMessage message={blog.errorMessage} type={ErrorMessageType.Header} />
            <div className="ui contianer" style={fullscreenBelowMenuStyle}>
                {/* There's a bug in the hasMore property, the loadMore() callback will be called 
                        even if hasMore is set to false: 
                        https://github.com/CassetteRocks/react-infinite-scroller/issues/44

                        I work around this by checking moreToFetch in loadMore() method.
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={() => this.loadMore()}
                        hasMore={moreToFetch}
                        loader={moreToFetchloader}
                    >
                        {blogPosts}
                    </InfiniteScroll> */}
                    <InfiniteScroll
                        pageStart={0}
                        initialLoad={false}
                        loadMore={() => loadMore()}
                        hasMore={moreToFetch()}
                        loader={moreToFetchloader}
                        threshold={1000}
                    >
                        {blogPosts}
                    </InfiniteScroll>
            </div>
        </div>
    );
});