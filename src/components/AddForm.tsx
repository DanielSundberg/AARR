import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { useStores } from '../stores/RootStore';
import { SimpleLoader } from './SimpleLoader';
import { Link } from 'react-router-dom';
import { SimpleNavBar } from './SimpleNavBar';
import { fullscreenBelowMenuStyle } from './CustomStyles';

export const AddForm = observer(() => {
    const { theme, addBlog } = useStores();
    const [feedUrl, setFeedUrl] = useState('');

    let buttonClasses = feedUrl.length > 0 ?
        "ui large primary floated fluid submit button" :
        "ui large primary floated fluid submit disabled button";
    let buttonContentOrLoader = addBlog.isAddingFeed ?
        <SimpleLoader /> : (
            <div>Add</div>
        );

    let button = addBlog.addFeedSuccess ? (
        <Link to="/">
            <button 
                className={buttonClasses}
                style={theme.activeButton()}
            >
                Close
            </button>
        </Link>
    ) : (
            <button
                className={buttonClasses}
                // tslint:disable-next-line
                onClick={(ev: any) => addBlog.add(feedUrl)}
                style={theme.activeButton()}
            >
                {buttonContentOrLoader}
            </button>
        );

    let infoMessageIcon = addBlog.addFeedSuccess ? "info icon" : "error icon";

    let infoMessageClasses = addBlog.addFeedSuccess ? "ui info message" : "ui error message";
    let infoMessage = addBlog.addFeedMessage.length > 0 && (
        <div className={infoMessageClasses}>
            <i className={infoMessageIcon}></i>
            {addBlog.addFeedMessage}
        </div>
    );

    return (
        <div className="container">
            <SimpleNavBar title="Add feed" />
            <div className="ui grid" style={fullscreenBelowMenuStyle}>
                <div className="row">

                    <div className="sixteen wide column">
                        <h3 className="ui header center" style={theme.settingsHeader()}>
                            Url of RSS feed to add:
                        </h3>
                    </div>
                </div>
                <div className="row">
                    <div className="ui sixteen wide column">
                        <form className="ui large form">
                            <div className="field">
                                <div className="ui left input">
                                    <input
                                        type="text"
                                        name="feed-url"
                                        placeholder="RSS Feed Url"
                                        style={theme.input()}
                                        // tslint:disable-next-line
                                        onChange={(ev: any) => setFeedUrl(ev.target.value)}
                                    />
                                </div>
                            </div>
                        </form>
                        {infoMessage}
                    </div>
                </div>
                <div className="row">
                    <div className="ui sixteen wide column">
                        {button}
                    </div>
                </div>
            </div>
        </div>
    );
});
