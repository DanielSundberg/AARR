import { observable } from 'mobx';
import * as _ from 'lodash';

export class BlogPost {
    uid: string;
    @observable fetched: boolean;
    title: string;
    content: string;
    @observable read: boolean;
    date: Date;
    author: string;
    url: string;
    blogInfoUid: string;

    constructor(uid: string, read: boolean) {
        this.uid = uid;
        this.fetched = false;
        this.title = '';
        this.content = '';
        this.read = read;
        this.author = '';
        this.url = '';
        this.date = new Date(_.now());
    }
}
