import { observable } from 'mobx';

export class BlogInfo {
    title: string;
    uid: string;
    category: string;
    @observable unread: number;

    constructor(uid: string, title: string, category: string, unread: number) {
        this.uid = uid;
        this.title = title;
        this.category = category;
        this.unread = unread;
    }  
}
