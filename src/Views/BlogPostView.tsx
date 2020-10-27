import * as React from 'react';
import * as _ from 'lodash';
import { inject, observer } from 'mobx-react';
import RootStore from '../Model/RootStore';
import renderHTML from 'react-render-html';
import Headroom from 'react-headroom';
import { belowMainMenuStyle } from '../Model/CustomStyles';
import ScrollToTopOnMount from './ScrollToTop';
import StringUtils from '../Model/StringUtils';
import { scroller as scroll } from 'react-scroll';
import * as readingTime from 'reading-time';
import { HeaderErrorMessage } from './HeaderErrorMessage';
import * as InfiniteScroll from 'react-infinite-scroller';

const Loader: React.SFC = () => {
    return (
        <div className="item right">
            <div className="ui tiny active inline loader"/>
        </div>
    );
};

interface YARRAndroidInterface {
    shareUrl: Function;
}
declare var YARRAndroid: YARRAndroidInterface;

@inject('appState')
@inject('routing')
@inject('themeEngine')
@observer
class BlogPostView extends React.Component<RootStore, {}> {
    constructor(props: RootStore) {
        super(props);
    }

    componentWillMount() {
        const { location } = this.props.routing;

        if (location) {
            const uid = StringUtils.afterSlash(location.pathname);
            this.props.appState.showBlog(uid);
        }
        document.body.style.backgroundColor = this.props.themeEngine.listBackgroundColor();
    }
  
    markAsReadAndScroll(self: BlogPostView, uid: string, read: boolean, nextPostIndex: number) {
        self.props.appState.markPostAsRead(uid, read);
        self.goToNextPost(nextPostIndex);
    }

    goToNextPost(nextPostIndex: number) {
        scroll.scrollTo(`bottomOfPost${nextPostIndex}`, null);
    }

    goToPrevPost(nextPostIndex: number) {
        scroll.scrollTo(`topOfPost${nextPostIndex}`, null);
    }

    shareUrl(title: String, url: String) {
        try {
            YARRAndroid.shareUrl(title, url);
        } catch (e) {
            // tslint:disable-next-line
            console.log("Not running in WebView or yarrAndroid object not found, exception: ", e);
            alert(`Will share ${url} with title '${title}'!`);
        }
    }

    loadMore(): void {
        if (this.moreToFetch()) {
            this.props.appState.fetchFiveUnreadPosts();
        }
    }

    moreToFetch(): boolean {
        const moreToFetch = _.some(this.props.appState.blogPostlist, (b) => {
            return !b.fetched;
        });
        return moreToFetch;
    }

    render() {
        const activeStyle = this.props.themeEngine.blogHeaderActiveStyle();
        const inactiveStyle = this.props.themeEngine.blogHeaderInactiveStyle();

        const blogPosts = 
            this.props.appState.blogPostlist.length === 0 && 
            this.props.appState.errorMessage.length === 0 &&
            !this.props.appState.isLoadingPosts ? (
            <HeaderErrorMessage
                errorMessage="No posts..."
                dismissError={() => this.props.appState.dismissError()} 
            />) : 
            _.map(this.props.appState.blogPostlist, (b, i) => {
                if (!b.title) { return null; }

                const markAsReadButtonText = b.read ? 'Mark as unread' : 'Mark as read';          
                const headerTextStyle = b.read ? {} : { color: this.props.themeEngine.theme.headerTextColor };
                const whiteTextStyle = this.props.themeEngine.headerTextStyle();
                const headerContentStyle = b.read ? inactiveStyle : activeStyle ;
                const menuSegmentStyle = b.read ? 
                    { ...this.props.themeEngine.blogHeaderInactiveStyle(), ...{padding: '2px'} } : 
                    { ...this.props.themeEngine.blogHeaderActiveStyle(), ...{padding: '2px'} };
                const menuIconStyle = b.read ? 
                    this.props.themeEngine.blogHeaderInactiveStyle() :
                    this.props.themeEngine.blogHeaderActiveStyle();

                const upperLoaderOrCheckItem = this.props.appState.postsBeingEdited.indexOf(b.uid, 0) > -1 ? (
                    <Loader />
                ) : (
                    <div className="item link right" onClick={() => this.markAsReadAndScroll(this, b.uid, !b.read, i)} style={menuSegmentStyle}>
                        <i className="icon check" />
                        {markAsReadButtonText}
                    </div>
                );
                const lowerLoaderOrCheckItem = this.props.appState.postsBeingEdited.indexOf(b.uid, 0) > -1 ? (
                    <Loader />
                ) : (
                    <div className="item link right" onClick={() => this.props.appState.markPostAsRead(b.uid, !b.read)} style={menuSegmentStyle}>
                        <i className="icon check" />
                        {markAsReadButtonText}
                    </div>
                );

                const contentSegmentClasses = b.read ? "ui segment" : "ui segment";
                const fontScale = `${this.props.appState.contentFontScale}rem`;
                let contentStyle = b.read ? { color: '#808080', fontSize: fontScale } : { fontSize: fontScale };
                contentStyle = {...contentStyle, ...this.props.themeEngine.listBackgroundStyle()};
                const readingTimeInfo = readingTime(b.content);

                return (
                    <div key={i}>              
                        <div id={`topOfPost${i}`} />
                        <div className="row">
                            <div className="ui segments">
                                <div className="ui segment" style={headerContentStyle}>
                                    <h1>
                                        <a style={whiteTextStyle} href={b.url} target="_new">{b.title}</a>
                                    </h1>
                                    <span style={headerTextStyle}>
                                        Posted {b.date.toLocaleString()} by {b.author}<br/>
                                        {readingTimeInfo.text}
                                    </span>
                                </div>
                                <div className="ui segment" style={menuSegmentStyle} >
                                    <div className="ui top attached inverted menu borderless" style={menuSegmentStyle}>
                                        <div className="item link icon" onClick={() => this.goToPrevPost(i - 1)} style={menuIconStyle}>
                                            <i className="arrow up icon"></i>
                                        </div>
                                        <div className="item link icon" onClick={() => this.goToNextPost(i)} style={menuIconStyle}>
                                            <i className="arrow down icon"></i>
                                        </div>
                                        {upperLoaderOrCheckItem}
                                    </div>
                                </div>
                                <div className={contentSegmentClasses} style={contentStyle} >
                                    <div className="content">     
                                        <div className="description" style={this.props.themeEngine.headerTextStyle()}>
                                            {renderHTML(b.content)}
                                        </div>
                                    </div>
                                </div>
                                <div className="ui segment" style={menuSegmentStyle} >
                                    <div 
                                        className="ui bottom attached inverted menu borderless" 
                                        style={menuSegmentStyle}
                                    >
                                        
                                        <div className="item link icon" onClick={() => this.goToPrevPost(i)}  style={menuIconStyle}>
                                            <i className="arrow up icon"></i>
                                        </div>
                                        <a className="item icon" href={b.url} target="_new" style={menuIconStyle}>
                                            <i className="external icon"></i>
                                        </a>
                                        <div className="item link icon" onClick={() => this.shareUrl(b.title, b.url)} style={menuIconStyle}>
                                            <i className="share icon"></i>
                                        </div>
                                        {lowerLoaderOrCheckItem}                                
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id={`bottomOfPost${i}`} className="row"><br/></div>
                    </div>);
            });

        const moreToFetchloader = (
            <div className="row" key={0}>
              <div className="sixteen wide column">
                <div className="ui mini text active centered inline loader">Loading posts...</div>
              </div>
            </div>);

        return (
            <div className="container" style={this.props.themeEngine.listBackgroundStyle()}>
                <ScrollToTopOnMount />
                <Headroom>
                    <div className="ui attached inverted icon menu" >
                        <a className="item" onClick={() => this.props.routing.goBack()} style={this.props.themeEngine.headerTextStyle()}>
                            <i className="icon angle left" />
                        </a>
                        <div className="header borderless item left">{this.props.appState.currentBlogTitle}</div>
                        <div className="right menu">
                            <a className="item" onClick={() => this.props.appState.decreseFontSize()} style={this.props.themeEngine.headerTextStyle()}>
                                <i className="icon minus" />
                            </a>
                            <a className="item right" onClick={() => this.props.appState.increaseFontSize()} style={this.props.themeEngine.headerTextStyle()}>
                                <i className="icon plus" />
                            </a>
                        </div>
                    </div>
                </Headroom>
                <HeaderErrorMessage 
                    errorMessage={this.props.appState.errorMessage}
                    dismissError={() => this.props.appState.dismissError()} 
                />
                <div className="ui grid" style={belowMainMenuStyle}>
                    <div className="sixteen wide column">

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
                            loadMore={() => this.loadMore()}
                            hasMore={this.moreToFetch()}
                            loader={moreToFetchloader}
                            threshold={1000}
                        >
                            {blogPosts}
                        </InfiniteScroll>

                    </div>
                </div>
            </div>);
    }
}

export default BlogPostView;