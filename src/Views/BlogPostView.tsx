import * as React from 'react';
import * as _ from 'lodash';
import { inject, observer } from 'mobx-react';
import RootStore from '../Model/RootStore';
import renderHTML from 'react-render-html';
import Headroom from 'react-headroom';
import { gridStyle } from '../Model/gridStyle';
import ScrollToTopOnMount from './ScrollToTop';
import StringUtils from '../Model/StringUtils';

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
  
    render() {
        const blogPosts = _.map(this.props.appState.blogPostlist, (b, i) => {
            if (!b.title) { return null; }
            let buttonClasses = b.read ? 'ui bottom attached button' : 'ui bottom attached primary button';
            if (this.props.appState.postsBeingEdited.indexOf(b.uid, 0) > -1) {
               buttonClasses += ' inline loading';
            }
            const buttonText = b.read ? 'Mark as unread' : 'Mark as read';          
            const headerCardStyle = b.read ? {} : {color: '#FFFFFF'};
            const headerContentStyle = b.read ? { background: '#DFE0E1' } : { background: '#3B83C0' } ;

            return (
                <div key={i}>
                    <div className="row">
                        <div className="ui fluid card">
                            <div className="content" style={headerContentStyle}>
                                <h1>
                                    <a style={headerCardStyle} href={b.url} target="_new">{b.title}</a>
                                </h1>
                                <span style={headerCardStyle}>Posted {b.date.toLocaleString()} by {b.author}</span>
                            </div>
                            <div className="content">                    
                                <div className="description">
                                    {renderHTML(b.content)}
                                </div>
                            </div>
                            
                            <div 
                                className={buttonClasses} 
                                onClick={() => this.props.appState.markPostAsRead(b.uid, !b.read)}
                            >
                                <i className="checkmark icon" />
                                {buttonText}
                            </div>
                        </div>
                    </div>
                    <div className="row"><br/></div>
                </div>);
        });

        const moreToFetch = _.some(this.props.appState.blogPostlist, (b) => {
            return !b.fetched;
        });
        const moreToFetchButton = moreToFetch && (
            <div className="row">
                <div 
                    className="ui primary fluid button"
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
                    <div className="ui attached inverted icon menu">
                        <a className="item" onClick={() => this.props.routing.goBack()}>
                            <i className="icon angle left" />
                        </a>
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