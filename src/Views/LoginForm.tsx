import * as React from 'react';
import RootStore from '../Model/RootStore';
import { inject, observer } from 'mobx-react';
import { default as resource } from '../Model/OldReaderResource';

@inject("appState")
@inject("theme")
@observer
class LoginForm extends React.Component<RootStore, {}> {
    constructor(props: RootStore) {
      super(props);
    }

    loginClicked(self: any) { // tslint:disable-line
      self.props.appState.login(self.state.username, self.state.password);
      this.state = {
        username: '',
        password: ''
      };
    }

    componentWillMount() {
        document.body.style.backgroundColor = this.props.theme.theme.listBackground;
    }

    render() {
      return (
        <div className="ui grid middle center container">
          <div className="row">
            <div className="two wide column" />
            <div className="twelve wide column">
              <h2 className="ui image header">
                <div className="content" style={this.props.theme.settingsHeader()}>
                  Log-in to The Old Reader
                </div>
              </h2>
              <form className="ui large form">
                <div className="ui segment" style={this.props.theme.listBackground()}>
                  <div className="field">
                    <div className="ui left icon input">
                      <i className="user icon" />
                      <input 
                        type="text" 
                        name="email" 
                        placeholder="E-mail address" 
                        style={this.props.theme.input()}
                        // tslint:disable-next-line
                        onChange={(ev: any) => this.setState({ username: ev.target.value }) } 
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
                        style={this.props.theme.input()}
                        // tslint:disable-next-line
                        onChange={(ev: any) => this.setState({ password: ev.target.value })}
                      />
                    </div>
                  </div>
                  <div 
                    className="ui fluid large primary submit button" 
                    style={this.props.theme.activeButton()}
                    // tslint:disable-next-line
                    onClick={(ev: any) => this.loginClicked(this)}
                  >
                    Login
                  </div>
                </div>
              </form>
              {this.props.appState.loginError !== '' ? 
                // tslint:disable-next-line
                <div className="ui negative message" style={this.props.theme.errorMessage()}>{this.props.appState.loginError}</div> : 
                null}
              <div className="ui message" style={this.props.theme.infoMessage()}>
                <i className="large info circle icon" />
                {/* tslint:disable-next-line */}
                New to The Old Reader? <a href={resource.signUpUrl} target="_new">Sign Up</a>, <a href={resource.forgotPwdUrl} target="_new">forgot password?</a>
              </div>
            </div>
            <div className="two wide column" />
          </div>
        </div>);
    }
  }
  
export default LoginForm;