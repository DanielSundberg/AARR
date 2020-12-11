import { createContext, useContext } from 'react';
import { AuthStore } from './AuthStore';
import { ThemeStore } from './ThemeStore';
import { BlogStore } from './BlogStore';
import { SettingsStore } from './SettingsStore';
import { AddBlogStore } from './AddBlogStore';

class RootStore {
    auth: AuthStore;
    theme: ThemeStore;
    blog: BlogStore;
    settings: SettingsStore;
    addBlog: AddBlogStore;

    constructor() {
        this.auth = new AuthStore();
        this.theme = new ThemeStore();
        this.blog = new BlogStore(this.auth);
        this.addBlog = new AddBlogStore(this.auth);
        this.settings = new SettingsStore();
    }
}

export const rootStore = new RootStore();
export const RootStoreContext = createContext<RootStore>(rootStore);
export const useStores = () => useContext(RootStoreContext);