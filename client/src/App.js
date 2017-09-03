import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, NavLink } from 'react-router-dom';
import './App.css';
import HomePage from './containers/HomePage';
import LoginPage from './containers/LoginPage';
import SignupPage from './containers/SignupPage';
import SettingsPage from './containers/SettingsPage';
import Auth from './modules/Auth';

export default class App extends Component {
  state = {
    is_logged_in : Auth.isUserAuthenticated(),
    user : {name:"", email:""}
  };
  componentWillMount = () => {
    if( Auth.isUserAuthenticated()){
      const username = Auth.getUsername();
      const email = Auth.getEmail();
      this.setState( { user : {name: username?username:"", email: email?email:""}});
    }
  };
  logout = () => {
    Auth.deauthenticateUser();
    this.setState( {is_logged_in: false, user: {name:"", email:""}});
  };
  // FIXME: this is horrible right?
  login = ( user) => {
    this.setState( {is_logged_in: true, user: {name: user.name, email: user.email}});
  };

  render() {
    const username = this.state.user.name;
    const right_margin = {
      marginRight: "10px"
    };
    return (
      <Router>
        <div>
          <div className="nav">
            <ul>
              <div className="nav-box">
                <li><NavLink to="/" exact>Home</NavLink></li>
              </div>
              <div className="nav-box">
                { Auth.isUserAuthenticated()?
                    <div className="nav-box">
                      <li style={right_margin}>{this.state.user.name?`Hi ${username}`:""}</li>
                      <li style={right_margin}><NavLink to='/settings' exact >&#x2699;</NavLink></li>
                      <li><a onClick={this.logout}>Logout</a></li>
                    </div>
                  :
                  <li><NavLink to="/login" exact>Login</NavLink></li>
                }
                { Auth.isUserAuthenticated()?"":
                  <li><NavLink to="/signup" exact>Signup</NavLink></li>
                }
              </div>
            </ul>
          </div>

          <hr/>
          <Switch>
            <Route exact path="/" component={HomePage}/>
            <Route path="/login" render={props=>
                <LoginPage {...props} onLogin={this.login} />} />
            <Route path="/signup" component={SignupPage} />
            <AuthRoute path="/settings" component={SettingsPage} />
            <Route path="*" render={props => <Redirect to='/' {...props} /> } />
          </Switch>
        </div>
      </Router>
    );
  }
};

const AuthRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    Auth.isUserAuthenticated() ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }}/>
    )
  )}/>
)
