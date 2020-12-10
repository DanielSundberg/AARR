import { makeObservable, observable } from 'mobx';
import * as _ from 'lodash';

export class BlogPost {
    uid: string;
    fetched: boolean = false;
    title: string = '';
    content: string = '';
    read: boolean;
    date: Date = new Date(_.now());;
    author: string = '';
    url: string = '';
    blogInfoUid: string = '';

    constructor(uid: string, read: boolean) {
        this.uid = uid;
        this.read = read;

        makeObservable(this, {
            fetched: observable,
            read: observable,
            blogInfoUid: observable
        });
    }
}
