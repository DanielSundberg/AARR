import * as React from 'react';
import RootStore from '../Model/RootStore';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import Headroom from 'react-headroom';
import { fullscreenBelowMenuStyle } from '../Model/CustomStyles';

interface AddFormState {
    feedUrl: string;
}

const Loader: React.SFC = () => {
    return (
        <div className="item">
            <div className="ui tiny active inline loader" />
        </div>
    );
};

@inject("appState")
@inject("routing")
@inject("theme")
@observer
class AddForm extends React.Component<RootStore, AddFormState> {

    constructor(props: RootStore) {
        super(props);
        this.state = {
            feedUrl: ''
        };
    }

    addFeedClicked(self: any) { // tslint:disable-line
        self.props.appState.add(self.state.feedUrl);
    }

    componentWillMount() {
        this.props.appState.addFeedSuccess = false;
        this.props.appState.addFeedMessage = '';
        this.props.appState.addedFeedId = '';
        document.body.style.backgroundColor = this.props.theme.theme.listBackground;
    }

    render() {
        let buttonClasses = this.state.feedUrl.length > 0 ?
            "ui large primary floated fluid submit button" :
            "ui large primary floated fluid submit disabled button";
        let buttonContentOrLoader = this.props.appState.isAddingFeed ?
            <Loader /> : (
                <div>Add</div>
            );

        let button = this.props.appState.addFeedSuccess ? (
            <Link to="/blogs">
                <button 
                    className={buttonClasses}
                    style={this.props.theme.activeButton()}
                >
                    Close
                </button>
            </Link>
        ) : (
                <button
                    className={buttonClasses}
                    // tslint:disable-next-line
                    onClick={(ev: any) => this.addFeedClicked(this)}
                    style={this.props.theme.activeButton()}
                >
                    {buttonContentOrLoader}
                </button>
            );
        let infoMessageIcon = this.props.appState.addFeedSuccess ?
            "info icon" : "error icon";

        let infoMessageClasses = this.props.appState.addFeedSuccess ?
            "ui info message" : "ui error message";
        let infoMessage = this.props.appState.addFeedMessage.length > 0 && (
            <div className={infoMessageClasses}>
                <i className={infoMessageIcon}></i>
                {this.props.appState.addFeedMessage}
            </div>
        );

        return (
            <div className="container">
                 <Headroom>
                    <div className="ui attached inverted icon menu" >
                        <a 
                            className="item" 
                            onClick={() => this.props.routing.goBack()} 
                            style={this.props.theme.headerText()}
                        >
                            <i className="icon angle left" />
                        </a>
                        <div className="header borderless item left" style={this.props.theme.softMenu()}>Add feed</div>
                    </div>
                </Headroom>
                <div className="ui grid" style={fullscreenBelowMenuStyle}>
                    <div className="row">

                        <div className="sixteen wide column">
                            <h3 className="ui header center" style={this.props.theme.settingsHeader()}>
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
                                            style={this.props.theme.input()}
                                            // tslint:disable-next-line
                                            onChange={(ev: any) => this.setState({ feedUrl: ev.target.value })}
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
            </div>);
    }
}

export default AddForm;