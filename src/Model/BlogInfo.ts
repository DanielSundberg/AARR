import { observable } from 'mobx';

export class BlogInfo {
    title: string;
    uid: string;
    category: string;
    @observable unread: number;
    iconUrl: string;

    constructor(uid: string, title: string, category: string, unread: number, iconUrl: string) {
        this.uid = uid;
        this.title = title;
        this.category = category;
        this.unread = unread;
        this.iconUrl = iconUrl;
    }  
}
