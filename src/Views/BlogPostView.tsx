import * as React from 'react';
import * as _ from 'lodash';
import { inject, observer } from 'mobx-react';
import RootStore from '../Model/RootStore';
import renderHTML from 'react-render-html';
import Headroom from 'react-headroom';
import { gridStyle } from '../Model/gridStyle';
import ScrollToTopOnMount from './ScrollToTop';
import StringUtils from '../Model/StringUtils';
import { scroller as scroll } from 'react-scroll';
import * as readingTime from 'reading-time';

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
        }
    }

    render() {
        const activeStyle = { color: '#FFFFFF', background: '#3B83C0' };
        const inactiveStyle = { color: '#FFFFFF', background: '#808080' };

        const blogPosts = this.props.appState.blogPostlist.length === 0 && !this.props.appState.isLoadingPosts ? (
            <div className="item right">
                No posts... <i className="icon meh"></i>  
            </div>) : 
            _.map(this.props.appState.blogPostlist, (b, i) => {
                if (!b.title) { return null; }

                const markAsReadButtonText = b.read ? 'Mark as unread' : 'Mark as read';          
                const headerTextStyle = b.read ? {} : {color: '#FFFFFF'};
                const whiteTextStyle = { color: '#FFFFFF'};
                const headerContentStyle = b.read ? inactiveStyle : activeStyle ;
                const menuSegmentStyle = b.read ? 
                    { background: '#808080', padding: '2px' } : 
                    { background: '#3B83C0', padding: '2px' };

                const upperLoaderOrCheckItem = this.props.appState.postsBeingEdited.indexOf(b.uid, 0) > -1 ? (
                    <Loader />
                ) : (
                    <div className="item link right" onClick={() => this.markAsReadAndScroll(this, b.uid, !b.read, i)}>
                        <i className="icon check" />
                        {markAsReadButtonText}
                    </div>
                );
                const lowerLoaderOrCheckItem = this.props.appState.postsBeingEdited.indexOf(b.uid, 0) > -1 ? (
                    <Loader />
                ) : (
                    <div className="item link right" onClick={() => this.props.appState.markPostAsRead(b.uid, !b.read)}>
                        <i className="icon check" />
                        {markAsReadButtonText}
                    </div>
                );

                const contentSegmentClasses = b.read ? "ui segment" : "ui segment";
                const contentStyle = b.read ? { color: '#808080'} : {};
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
                                        <div className="item link icon" onClick={() => this.goToPrevPost(i - 1)}>
                                            <i className="arrow up icon"></i>
                                        </div>
                                        <div className="item link icon" onClick={() => this.goToNextPost(i)}>
                                            <i className="arrow down icon"></i>
                                        </div>
                                        {upperLoaderOrCheckItem}
                                    </div>
                                </div>
                                <div className={contentSegmentClasses} style={contentStyle} >
                                    <div className="content">     
                                        <div className="description">
                                            {renderHTML(b.content)}
                                        </div>
                                    </div>
                                </div>
                                <div className="ui segment" style={menuSegmentStyle} >
                                    <div 
                                        className="ui bottom attached inverted menu borderless" 
                                        style={menuSegmentStyle}
                                    >
                                        
                                        <div className="item link icon" onClick={() => this.goToPrevPost(i)}>
                                            <i className="arrow up icon"></i>
                                        </div>
                                        <a className="item icon" href={b.url} target="_new">
                                            <i className="external icon"></i>
                                        </a>
                                        <div className="item link icon" onClick={() => this.shareUrl(b.title, b.url)}>
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

        const moreToFetch = _.some(this.props.appState.blogPostlist, (b) => {
            return !b.fetched;
        });
        const moreToFetchButton = moreToFetch && (
            <div className="row">
                <div 
                    className="ui fluid button"
                    style={activeStyle}
                    onClick={() => this.props.appState.fetchFiveUnreadPosts()}
                >
                    Fetch more posts...
                </div>
            </div> 
        );

        const moreToFetchloader = this.props.appState.isLoadingPosts && (
            <div className="row">
              <div className="sixteen wide column">
                <div className="ui mini text active centered inline loader">Loading posts...</div>
              </div>
            </div>);

        return (
            <div className="container">
                <ScrollToTopOnMount />
                <Headroom>
                    <div className="ui attached inverted icon menu" >
                        <a className="item" onClick={() => this.props.routing.goBack()}>
                            <i className="icon angle left" />
                        </a>
                        <div className="header borderless item">{this.props.appState.currentBlogTitle}</div>
                    </div>
                </Headroom>
                <div className="ui grid" style={gridStyle}>
                    <div className="sixteen wide column">
                        {blogPosts}
                        {moreToFetchloader}
                        {!this.props.appState.isLoadingPosts && moreToFetchButton}
                    </div>
                </div>
            </div>);
    }
}

export default BlogPostView;