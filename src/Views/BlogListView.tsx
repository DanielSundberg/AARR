import * as React from 'react';
import * as _ from 'lodash';
import { inject, observer } from 'mobx-react';
import RootStore from '../Model/RootStore';
import { gridStyle } from '../Model/gridStyle';
import { BlogInfo } from '../Model/BlogInfo';
import { Link } from 'react-router-dom';

@inject("appState")
@inject("routing")
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
        // onClick={() => this.props.appState.showBlog(b.uid)}
        const blogPosts = _.map(unreadList, (b, i) => {
            return (
              <div className="item" key={i}>
                <div className="content left floated">
                  <Link to={`/blogs/${b.uid}`}>
                    <i className="large bookmark middle aligned icon" />
                    <b>{b.title}</b>
                  </Link>
                </div>
                <div className="right floated content">
                  <b>{b.unread}</b>
                </div>
              </div>);
        });

        const loader = this.props.appState.isUpdatingList && (
          <div className="row">
            <div className="sixteen wide column">
              <div className="ui mini text active centered inline loader">Refreshing list</div>
            </div>
          </div>);
              
        return (
          <div className="App-header">
            <div className="ui attached inverted icon menu">
              {/* <a className="item">
                <i className="icon sidebar" />
              </a> */}
              <a className="item" onClick={() => this.props.appState.getListOfBlogs()}>
                <i className="icon refresh" />
              </a>
              
              <div className="right menu">
                <a className="item" onClick={() => this.props.appState.logout()}>
                  <i className="icon sign out" />
                </a>
              </div>
            </div>
            <div className="ui grid" style={gridStyle}>
              {loader}
              <div className="row">
                <div className="sixteen wide column">
                  <div className="ui relaxed big divided list">
                    {blogPosts}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
}

export default BlogListView;