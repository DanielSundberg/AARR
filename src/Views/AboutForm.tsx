import * as React from 'react';
import RootStore from '../Model/RootStore';
import { inject, observer } from 'mobx-react';
import Headroom from 'react-headroom';
import { fullscreenBelowMenuStyle } from '../Model/CustomStyles';

@inject("theme")
@inject("routing")
@observer
class AboutForm extends React.Component<RootStore, {}> {

    constructor(props: RootStore) {
        super(props);

    }

    componentWillMount() {
        document.body.style.backgroundColor = this.props.theme.theme.listBackground;
    }

    render() {
        // console.log("Url: ", this.props.containerAppCallbacks.url); // tslint:disable-line
        document.body.style.backgroundColor = this.props.theme.colors().listBackground;

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
                        <div 
                            className="header borderless item left" 
                            style={this.props.theme.softMenu()}
                        >
                            About AARR
                        </div>
                    </div>
                </Headroom>
                <div className="ui grid" style={fullscreenBelowMenuStyle}>
                    <div className="row" style={this.props.theme.blogText()}>
                        <div className="sixteen wide column">
                            <p>This is an RSS reader for <a href="http://theoldreader.com/">The Old Reader</a>.</p>

                            <p>When Google shut down their reader I had to find a new way to read my RSS feeds. 
                            After trying all services out there my pick was <a href="http://theoldreader.com/">
                            The Old Reader</a>, probably because the service reminded me the most of the Google 
                            reader experience. </p>

                            <p>However, what was lacking was a nice mobile user experience. So after a while I 
                            decided to implement my own. And here we are... Please try it out and tell me what 
                            you think!</p>

                            <p>Github 
                            repository: <a href="https://github.com/DanielSundberg/AARR">
                            https://github.com/DanielSundberg/AARR/</a></p>

                            <p>Please report any feedback <a href="https://github.com/DanielSundberg/AARR/issues">
                            in a Github issue</a>.</p>

                            <p>The actual Android container app is in another 
                            repository: <a href="https://github.com/DanielSundberg/AARR-Android">YARR-Android</a>.</p>
                        </div>
                    </div>

                    <div className="row">
                        <div className="sixteen wide column">
                            <h2 className="ui header center" style={this.props.theme.settingsHeader()}>
                                Open source software
                        </h2>
                        </div>
                    </div>
                    <div className="row" style={this.props.theme.blogText()}>
                        <div className="sixteen wide column">
                            <p>This application uses a lot of different open source libraries to accomplish this 
                            fantastic user expreience. The following is the high level components used to 
                            develop AARR:</p>
                            <div className="ui bulleted list">
                                <div className="item">Typescript</div>
                                <div className="item">React</div>
                                <div className="item">Mobx</div>
                                <div className="item">React-router</div>
                                <div className="item">Semantic-UI</div>
                                <div className="item">Create React App</div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="sixteen wide column">
                            <h2 className="ui header center" style={this.props.theme.settingsHeader()}>
                                Licenses
                        </h2>
                        </div>
                    </div>
                    <div className="row" style={this.props.theme.blogText()}>
                        <div className="sixteen wide column">
                            <p>AARR is is licensed under the MIT License, a short and simple permissive 
                            license with conditions only requiring preservation of copyright and license 
                            notices. Licensed works, modifications, and larger works may be distributed 
                            under different terms and without source code.</p>

                            Full license 
                            terms: <a href="https://raw.githubusercontent.com/DanielSundberg/AARR/master/LICENSE">
                            AARR MIT LICENSE</a>

                            <h4>Other licenses:</h4>
                            <table>
                                <thead>
                                    <tr><th>Package</th><th>License Type</th></tr>
                                </thead>
                                <tbody>
                                    <tr><td>@types/crypto-js</td><td>MIT</td></tr>
                                    <tr><td>@types/history</td><td>MIT</td></tr>
                                    <tr><td>@types/lodash</td><td>MIT</td></tr>
                                    <tr><td>@types/react-infinite-scroller</td><td>MIT</td></tr>
                                    <tr><td>@types/react-router</td><td>MIT</td></tr>
                                    <tr><td>@types/react-router-dom</td><td>MIT</td></tr>
                                    <tr><td>@types/react-scroll</td><td>MIT</td></tr>
                                    <tr><td>@types/uuid</td><td>MIT</td></tr>
                                    <tr><td>crypto-js</td><td>MIT</td></tr>
                                    <tr><td>lodash</td><td>MIT</td></tr>
                                    <tr><td>mobx</td><td>MIT</td></tr>
                                    <tr><td>mobx-react</td><td>MIT</td></tr>
                                    <tr><td>mobx-react-router</td><td>MIT</td></tr>
                                    <tr><td>react</td><td>MIT</td></tr>
                                    <tr><td>react-dom</td><td>MIT</td></tr>
                                    <tr><td>react-headroom</td><td>MIT</td></tr>
                                    <tr><td>react-infinite-scroller</td><td>MIT</td></tr>
                                    <tr><td>react-router</td><td>MIT</td></tr>
                                    <tr><td>react-router-dom</td><td>MIT</td></tr>
                                    <tr><td>react-scripts-ts</td><td>BSD-3-Clause</td></tr>
                                    <tr><td>react-scroll</td><td>MIT</td></tr>
                                    <tr><td>reading-time</td><td>MIT</td></tr>
                                    <tr><td>semantic-ui-react</td><td>MIT</td></tr>
                                    <tr><td>typescript</td><td>Apache-2.0</td></tr>
                                    <tr><td>uuid</td><td>MIT</td></tr>
                                    <tr><td>html-react-parser</td><td>MIT</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AboutForm;