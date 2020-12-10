import { makeObservable, observable } from 'mobx';

export class BlogInfo {
    title: string;
    uid: string;
    category: string;
    unread: number;
    iconUrl: string;

    constructor(uid: string, title: string, category: string, unread: number, iconUrl: string) {
        this.uid = uid;
        this.title = title;
        this.category = category;
        this.unread = unread;
        this.iconUrl = iconUrl;

        makeObservable(this, {
            unread: observable
        });
    }

    displayTitle(titleMaxChars: number): string {
        const dots = this.title.length > titleMaxChars ? '...' : '';
        return this.title.substr(0, titleMaxChars - 2) + dots;
    }
}
