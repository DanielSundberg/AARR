import * as React from 'react';
import * as _ from 'lodash';
import { inject, observer } from 'mobx-react';
import RootStore from '../Model/RootStore';
import { gridStyleWithTopPadding as gridStyle } from '../Model/gridStyle';
import { BlogInfo } from '../Model/BlogInfo';
import { Link } from 'react-router-dom';
import { Dropdown, Icon } from 'semantic-ui-react';

@inject('appState')
@inject('routing')
@observer
class BlogListView extends React.Component<RootStore, {}> {
    constructor(props: RootStore) {
        super(props);
    }

    componentWillMount() {
        this.props.appState.getListOfBlogs();
    }

    render() {
        // const unreadList = _.filter(this.props.appState.bloglist, (b: BlogInfo) => {
        //     return b.unread > 0;
        // });
        const imgStyle = { paddingRight: '0.75em' };
        let self = this;
        const blogPosts = _.map(this.props.appState.bloglist, (b: BlogInfo, i) => {
            if (!this.props.appState.showAllFeeds && b.unread === 0) {
              return null;
            }
            const newBlog = (('feed/' + b.uid) === self.props.appState.addedFeedId) && (<i className="icon star"></i>);
            return (
              <div className="item" key={i}>
                <div className="content left floated">
                  <Link to={`/blogs/${b.uid}`}>
                    {/* <i className="large bookmark middle aligned icon" /> */}
                    <img src={b.iconUrl} style={imgStyle} />
                    <b>{b.title}</b>
                    {newBlog}
                  </Link>
                </div>
                <div className="right floated content">
                  {b.unread > 0 ? <b>{b.unread}</b> : null}
                </div>
              </div>);
        });

        const loaderOrRefreshButton = this.props.appState.isUpdatingList ? (
            <div className="item">
                <div className="ui mini active inline loader"/>
            </div>
        ) : (
            <a className="item" onClick={() => this.props.appState.getListOfBlogs()}>
                <i className="icon small refresh" />
            </a>);

        const hamburger = (
            <Dropdown item={true} icon='bars' onClick={() => this.props.appState.toggleShowMenu()}>
                <Dropdown.Menu>
                    <Dropdown.Item onClick={() => this.props.routing.push("/add")}>
                        <Icon name="plus" />
                        <span className='text'>Add feed...</span>
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => this.props.appState.logout()}>                    
                        <Icon name="sign out" />
                        <span className='text'>Sign out...</span>
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        );

        const filterItemClasses = this.props.appState.showAllFeeds ? "item" : "item active";

        return (
            <div className="ui container">
                <header className="ui inverted icon fixed top menu">
                    {hamburger}
                    <div className="header borderless item">Yarr RSS - Subscriptions</div>
                    <div className="right menu">
                        {loaderOrRefreshButton}
                        <a className={filterItemClasses} onClick={() => this.props.appState.toggleShowAll()}>
                            <i className="icon filter" />
                        </a>
                    </div>
                </header>

                <div className="ui grid" style={gridStyle}>
                    <div className="sixteen wide column">
                        <div className="ui relaxed big divided list">
                            {blogPosts}
                       </div>
                    </div>
                </div>

              {/* {this.props.appState.errorMessage != '' && (
                <div className="row">
                  <div className="sixteen wide column">
                    <div className="ui negative message">
                      <i className="close icon" onClick={() => this.props.appState.clearErrorMessage()}></i>
                      <i className="warning icon" />{this.props.appState.errorMessage}
                    </div>
                  </div>
                </div>
              )} */}
            </div>
        );
    }
}

export default BlogListView;