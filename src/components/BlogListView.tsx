import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useStores } from '../stores/RootStore';
import _ from 'lodash';
import { BlogInfo } from '../stores/BlogInfo';
import { Link } from 'react-router-dom';
import { gridStyleWithTopPadding as gridStyle } from './CustomStyles';

// This value is has been estimated from trial and 
// error using different longer sample titles
// On a 320px wide screen we have room for ~21 'e' (iPhone 4)
// On a 445px wide screen we have room for ~33 'e' (Nexus 5X)
const titleMaxChars = window.innerWidth > 445 ? 33 : 21;

export const BlogListView = observer(() => {
    const { theme, blog } = useStores();

    // Fetch blog list
    useEffect(() => { blog.getBlogList(); }, [blog.getBlogList, blog]);

    const blogListItems = _.map(blog.bloglist, (b: BlogInfo, key: number) => {
        if (!blog.showAllFeeds && b.unread === 0) {
            return null;
        }
        return (
            <div className="item" key={key}>
              <div className="content left floated">
                <Link to={`/blogs/${b.uid}`} style={theme.blogListLink()}>
                  <img src={b.iconUrl} style={{ paddingRight: '0.75em' }} />
                  <b>{b.displayTitle(titleMaxChars)}</b>
                </Link>
              </div>
              <div className="right floated content" style={theme.blogListCount()}>
                {b.unread > 0 ? <b>{b.unread}</b> : null}
              </div>
            </div>
        );
    });

    return (
        <div className="ui grid" style={{...gridStyle}}>
            <div className="sixteen wide column">
                <div className="ui relaxed big divided list">
                    {blogListItems}
                </div>
            </div>
        </div>
    );
});