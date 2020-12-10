import React, { useState } from 'react';
import { useContext } from 'react';
import { observer } from 'mobx-react';
import { RootStoreContext } from '../stores/RootStore';
import { default as resources } from '../clients/OldReaderResource';
import { gridStyleWithTopPadding } from './CustomStyles';

export const LoginForm = observer(() => {
    const auth = useContext(RootStoreContext).auth;
    const theme = useContext(RootStoreContext).theme;
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // const loaderOrText = auth.isLoading ? 
    //     <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/> : "Login";

    return (
        <div className="ui grid middle center container" style={gridStyleWithTopPadding}>
            <div className="row">
                <div className="two wide column" />
                <div className="twelve wide column">
                    <h2 className="ui image header">
                        <div className="content" style={theme.settingsHeader()}>
                            Log-in to The Old Reader
                    </div>
                    </h2>
                    <form className="ui large form">
                        <div className="ui segment" style={theme.listBackground()}>
                            <div className="field">
                                <div className="ui left icon input">
                                    <i className="user icon" />
                                    <input
                                        type="text"
                                        name="email"
                                        placeholder="E-mail address"
                                        style={theme.input()}
                                        // tslint:disable-next-line
                                        onChange={(ev: any) => setUsername(ev.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="field">
                                <div className="ui left icon input">
                                    <i className="lock icon" />
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        style={theme.input()}
                                        // tslint:disable-next-line
                                        onChange={(ev: any) => setPassword(ev.target.value)}
                                    />
                                </div>
                            </div>
                            <div
                                className="ui fluid large primary submit button"
                                style={theme.activeButton()}
                                // tslint:disable-next-line
                                onClick={(ev: any) => auth.login(username, password)}
                            >
                                Login
                        </div>
                        </div>
                    </form>
                    {auth.hasError() ?
                        // tslint:disable-next-line
                        <div className="ui negative message" style={theme.errorMessage()}>{auth.errorMessage}</div> :
                        null}
                    <div className="ui message" style={theme.infoMessage()}>
                        <i className="large info circle icon" />
                        {/* tslint:disable-next-line */}
                        New to The Old Reader? <a href={resources.signUpUrl} target="_new">Sign Up</a>, <a href={resources.forgotPwdUrl} target="_new">forgot password?</a>
                    </div>
                </div>
                <div className="two wide column" />
            </div>
        </div>)
});
