import React from 'react';
import { BlogListView } from './BlogListView';
import { BlogListNavBar } from './BlogListNavBar';
import { useStores } from '../stores/RootStore';
import { ErrorMessage } from './ErrorMessage';

export const BlogListForm = () => {
    const { blog } = useStores();
    
    return (
        <div className="ui container">
            <BlogListNavBar />
            <BlogListView />
            <ErrorMessage message={blog.errorMessage} />
        </div>
    );
};