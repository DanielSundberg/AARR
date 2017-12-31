import * as React from 'react';
import * as _ from 'lodash';
import { inject, observer } from 'mobx-react';
import RootStore from '../Model/RootStore';
import { gridStyleWithTopPadding as gridStyle } from '../Model/gridStyle';
import { BlogInfo } from '../Model/BlogInfo';
import { Link } from 'react-router-dom';

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
        const unreadList = _.filter(this.props.appState.bloglist, (b: BlogInfo) => {
            return b.unread > 0;
        });
        const imgStyle = { paddingRight: '0.75em' };
        const blogPosts = _.map(unreadList, (b, i) => {
            return (
              <div className="item" key={i}>
                <div className="content left floated">
                  <Link to={`/blogs/${b.uid}`}>
                    {/* <i className="large bookmark middle aligned icon" /> */}
                    <img src={b.iconUrl} style={imgStyle} />
                    <b>{b.title}</b>
                  </Link>
                </div>
                <div className="right floated content">
                  <b>{b.unread}</b>
                </div>
              </div>);
        });

        const loaderOrRefreshButton = this.props.appState.isUpdatingList ? (
            <div className="item">
                <div className="ui tiny active inline loader"/>
            </div>
        ) : (
            <a className="item" onClick={() => this.props.appState.getListOfBlogs()}>
                <i className="icon refresh" />
            </a>);

        return (
          <div className="ui container">
            <header className="ui inverted icon fixed top menu">
              {/* <a className="item">
                <i className="icon sidebar" />
              </a> */}
              {loaderOrRefreshButton}
              <div className="header borderless item">Yarr RSS - Subscriptions</div>
              <div className="right menu">
                <a className="item" onClick={() => this.props.appState.logout()}>
                  <i className="icon sign out" />
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
          </div>
        );
    }
}

export default BlogListView;