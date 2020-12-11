import React from 'react';
import { observer } from 'mobx-react';
import { useStores } from '../stores/RootStore';
import parse from 'html-react-parser';
import { SimpleLoader } from './SimpleLoader';
import { scroller as scroll } from 'react-scroll';
import readingTime from 'reading-time';

const nodeType = (node: { type: string, name: string, attribs: [] }, name: string, attrib: string = "") => {
    const tagAndNameMatch = node.type === 'tag' && node.name === name;

    if (tagAndNameMatch && attrib.length > 0) {
        return node.type === 'tag' && node.name === name && node.attribs && attrib in node.attribs;
    } else {
        return tagAndNameMatch;
    }
};

const addHostnameToUrl = (node: { attribs: any }, urlAttr: string, blogUrl: string) => {
    const hrefUrl: string = node.attribs[urlAttr];
    if (hrefUrl.startsWith("/") && blogUrl && blogUrl.length > 0) {
        // console.log('Blog url: ', b.url);
        const urlObj = new URL(blogUrl);
        node.attribs[urlAttr] = `${urlObj.protocol}//${urlObj.hostname}${hrefUrl}`;
        // console.log("Replaced url: ", node.attribs[urlAttr]);
    }
    return node;
};

const addStyles = (node: { attribs: any }, styles: string) => {
    node.attribs["style"] = styles;
    return node;
};

// tslint:disable-next-line
const adjustTags = (node: any, hostname: string) => {
    // If links (a) starts with / we add the hostname
    if (nodeType(node, 'a', 'href')) {
        return addHostnameToUrl(node, "href", hostname);
    } 

    // If images (img) starts with / we add the hostname
    if (nodeType(node, 'img', 'src')) {
        return addHostnameToUrl(node, "src", hostname);
    }

    // Prevent table from overflowing
    if (nodeType(node, 'table')) {
        return addStyles(node, "width:100%;table-layout: fixed;");
    }

    // Remove 40px margins on figures
    if (nodeType(node, 'figure')) {
        return addStyles(node, "margin-left: 0.5em; margin-right: 0.5em;");
    }

    return;
};

interface BlogPostViewProps {
    index: number;
    title: string;
    date: Date;
    uid: string;
    author: string;
    url: string;
    content: string;
    read: boolean;
}

interface YARRAndroidInterface {
    shareUrl: Function;
}
declare var YARRAndroid: YARRAndroidInterface;

export const BlogPostView = observer((props: BlogPostViewProps) => {
    const { theme, blog, settings } = useStores();

    if (!props.title) { return null; }

    const markAsReadAndScroll = (uid: string, read: boolean, nextPostIndex: number) => {
        blog.markPostAsRead(uid, read);
        if (read) {
            goToNextPost(nextPostIndex);
        }
    };

    const goToNextPost = (nextPostIndex: number) => {
        scroll.scrollTo(`bottomOfPost${nextPostIndex}`, null);
    };

    const goToPrevPost = (nextPostIndex: number) => {
        scroll.scrollTo(`topOfPost${nextPostIndex}`, null);
    };

    const shareUrl = (title: String, url: String) => {
        try {
            YARRAndroid.shareUrl(title, url);
        } catch (e) {
            // tslint:disable-next-line
            console.log("Not running in WebView or yarrAndroid object not found, exception: ", e);
            alert(`Will share ${url} with title '${title}'!`);
        }
    };

    const activeStyle = theme.blogHeaderActive();
    const inactiveStyle = theme.blogHeaderInactive();
    const markAsReadButtonText = props.read ? 'Mark as unread' : 'Mark as read';          
    const headerTextStyle = props.read ? {} : { color: theme.theme.headerTextColor };
    const headerContentStyle = props.read ? inactiveStyle : activeStyle ;
    const menuSegmentStyle = props.read ? 
        { ...theme.blogHeaderInactive(), ...{padding: '2px'} } : 
        { ...theme.blogHeaderActive(), ...{padding: '2px'} };
    const menuIconStyle = props.read ? 
        theme.blogHeaderInactive() :
        theme.blogHeaderActive();

    const upperLoaderOrCheckItem = blog.postsBeingEdited.indexOf(props.uid, 0) > -1 ? (
        <SimpleLoader right={true} />
    ) : (
        <div 
            className="item link right" 
            onClick={() => markAsReadAndScroll(props.uid, !props.read, props.index)} 
            style={menuSegmentStyle}
        >
            <i className="icon check" />
            {markAsReadButtonText}
        </div>
    );
    const lowerLoaderOrCheckItem = blog.postsBeingEdited.indexOf(props.uid, 0) > -1 ? (
        <SimpleLoader right={true}/>
    ) : (
        <div 
            className="item link right" 
            onClick={() => blog.markPostAsRead(props.uid, !props.read)} 
            style={menuSegmentStyle}
        >
            <i className="icon check" />
            {markAsReadButtonText}
        </div>
    );

    const contentSegmentClasses = props.read ? "ui segment" : "ui segment";
    const fontScale = `${settings.contentFontScale}rem`;
    let contentStyle = props.read ? { color: '#808080', fontSize: fontScale } : { fontSize: fontScale };
    contentStyle = {...contentStyle, ...theme.listBackground()};
    const readingTimeInfo = readingTime(props.content);


    return (
        <div key={props.index}>              
            <div id={`topOfPost${props.index}`} />
            <div className="row">
                <div className="ui segments">
                    <div className="ui segment" style={headerContentStyle}>
                        <h1>
                            <a 
                                style={theme.headerText()}
                                href={props.url}
                                target="_new"
                            >
                                {props.title}
                            </a>
                        </h1>
                        <span style={headerTextStyle}>
                            Posted {props.date.toLocaleString()} by {props.author}<br/>
                            {readingTimeInfo.text}
                        </span>
                    </div>
                    <div className="ui segment" style={menuSegmentStyle} >
                        <div className="ui top attached inverted menu borderless" style={menuSegmentStyle}>
                            <div 
                                className="item link icon" 
                                onClick={() => goToPrevPost(props.index - 1)} 
                                style={menuIconStyle}
                            >
                                <i className="arrow up icon"></i>
                            </div>
                            <div 
                                className="item link icon" 
                                onClick={() => goToNextPost(props.index)} 
                                style={menuIconStyle}
                            >
                                <i className="arrow down icon"></i>
                            </div>
                            {upperLoaderOrCheckItem}
                        </div>
                    </div>
                    <div className={contentSegmentClasses} style={contentStyle} >
                        <div className="content">     
                            <div className="description" style={theme.blogText()}>
                                {parse(props.content, {
                                    replace: (node) => adjustTags(node, props.url)
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="ui segment" style={menuSegmentStyle} >
                        <div 
                            className="ui bottom attached inverted menu borderless" 
                            style={menuSegmentStyle}
                        >
                            
                            <div 
                                className="item link icon" 
                                onClick={() => goToPrevPost(props.index)}  
                                style={menuIconStyle}
                            >
                                <i className="arrow up icon"></i>
                            </div>
                            <a className="item icon" href={props.url} target="_new" style={menuIconStyle}>
                                <i className="external icon"></i>
                            </a>
                            <div 
                                className="item link icon" 
                                onClick={() => shareUrl(props.title, props.url)} 
                                style={menuIconStyle}
                            >
                                <i className="share icon"></i>
                            </div>
                            {lowerLoaderOrCheckItem}
                        </div>
                    </div>
                </div>
            </div>
            <div id={`bottomOfPost${props.index}`} className="row"><br/></div>
        </div>
    );
});
