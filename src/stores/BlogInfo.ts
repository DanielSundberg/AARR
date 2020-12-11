import { makeObservable, observable } from 'mobx';

// This value is has been estimated from trial and 
// error using different longer sample titles
// On a 320px wide screen we have room for ~21 'e' (iPhone 4)
// On a 445px wide screen we have room for ~33 'e' (Nexus 5X)
const titleMaxChars = window.innerWidth > 445 ? 33 : 21;

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

    displayTitle(): string {
        const dots = this.title.length > titleMaxChars ? '...' : '';
        return this.title.substr(0, titleMaxChars - 2) + dots;
    }
}
