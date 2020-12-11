import React from 'react';
import { observer } from 'mobx-react';
import { useStores } from '../stores/RootStore';
import { SimpleNavBar } from './SimpleNavBar';
import { fullscreenBelowMenuStyle } from './CustomStyles';

export const AboutForm = observer(() => {
    const { theme } = useStores();

    return (
        <div className="container">
            <SimpleNavBar title="About AARR v2.1" />
            <div className="ui grid" style={fullscreenBelowMenuStyle}>
                <div className="row" style={theme.blogText()}>
                    <div className="sixteen wide column">
                        <p>This is an RSS reader for <a href="http://theoldreader.com/">The Old Reader</a>.</p>

                        <p>When Google shut down their reader I had to find a new way to read my RSS feeds. 
                        After trying all services out there my pick was <a href="http://theoldreader.com/">
                        The Old Reader</a>, probably because the service reminded me the most of the Google 
                        reader experience. </p>

                        <p>However, what was lacking was a nice mobile user experience. So after a while I 
                        decided to implement my own. And here we are...</p>

                        <p>The design philosophy behind this app is pretty simple:</p>
                        <div className="ui bulleted list">
                            <div className="item"><b>Focus on the reading experience</b>, blogs these days 
                            contains a lot of text and information. There not time enough to read everything. 
                            It should be easy to scan the content on the mobile device. If I have time I 
                            save the post as unread and continue later. If I'm not interested in the topic 
                            I just keep scrolling.</div>
                            <div className="item"><b>User in control</b>, don't try to be too smart when 
                            marking content as read or not. It should also be possible to undo an 
                            unintentional action.</div>
                            <div className="item"><b>The app should be fun to use</b>, how do you make an 
                            app fun to use? I don't know but I think it's a combination of an appealing 
                            user interface and having the proper controls and actions in the right place.
                            </div>
                        </div>

                        <p>Please try it out and tell me what you think!</p>

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
                        <h2 className="ui header center" style={theme.settingsHeader()}>
                            Open source software
                    </h2>
                    </div>
                </div>
                <div className="row" style={theme.blogText()}>
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
                        <h2 className="ui header center" style={theme.settingsHeader()}>
                            Licenses
                    </h2>
                    </div>
                </div>
                <div className="row" style={theme.blogText()}>
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
                                <tr><td>@types/lodash</td><td>MIT</td></tr>
                                <tr><td>@types/react-dom</td><td>MIT</td></tr>
                                <tr><td>@types/react-router-dom</td><td>MIT</td></tr>
                                <tr><td>@types/react-scroll</td><td>MIT</td></tr>
                                <tr><td>lodash</td><td>MIT</td></tr>
                                <tr><td>mobx</td><td>MIT</td></tr>
                                <tr><td>mobx-react</td><td>MIT</td></tr>
                                <tr><td>react</td><td>MIT</td></tr>
                                <tr><td>react-dom</td><td>MIT</td></tr>
                                <tr><td>react-headroom</td><td>MIT</td></tr>
                                <tr><td>react-infinite-scroller</td><td>MIT</td></tr>
                                <tr><td>react-router</td><td>MIT</td></tr>
                                <tr><td>react-router-dom</td><td>MIT</td></tr>
                                <tr><td>react-scroll</td><td>MIT</td></tr>
                                <tr><td>reading-time</td><td>MIT</td></tr>
                                <tr><td>semantic-ui-react</td><td>MIT</td></tr>
                                <tr><td>typescript</td><td>Apache-2.0</td></tr>
                                <tr><td>html-react-parser</td><td>MIT</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );

});