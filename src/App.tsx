import React from 'react';
import './semantic/semantic.min.css';
import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route
  } from "react-router-dom";
import { rootStore, RootStoreContext } from './stores/RootStore';
import { CheckAuth } from './components/CheckAuth';
import { ThemeBackground } from './components/ThemeBackground';
import { BlogListForm } from './components/BlogListForm';
import { SettingsForm } from './components/SettingsForm';
import { AboutForm } from './components/AboutForm';
import { BlogPostsForm } from './components/BlogPostsForm';
import { AddForm } from './components/AddForm';

const App = () => {
    console.log('Starting AARR!'); // tslint:disable-line
    return (
        <Router>
            <RootStoreContext.Provider value={rootStore}>
                <ThemeBackground>
                    <CheckAuth>
                        <Switch>
                            <Route exact path="/" component={BlogListForm} />
                            <Route path="/blogs/:blogId" component={BlogPostsForm} />
                            <Route path="/add" component={AddForm} />
                            <Route path="/settings" component={SettingsForm} />
                            <Route path="/about" component={AboutForm} />
                            <Route path="/logout" component={SettingsForm} />
                        </Switch>
                    </CheckAuth>
                </ThemeBackground>
            </RootStoreContext.Provider>
        </Router>
    );
}

export default App;
