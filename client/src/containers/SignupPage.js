import React from 'react';
import {Redirect} from 'react-router-dom';
import SignupForm from '../components/SignupForm';
import Actions from './Actions';

export default class SignupPage extends React.Component {
  state = {
    errors: {},
    user: {
      email: "",
      name: "",
      password: ""
    },
    redirectToReferrer: false
  };
  changeUser = ( event) => {
    // event target name, not user name!
    const {name, value} = event.target;
    const user = this.state.user;
    user[name] = value;
    this.setState( {user});
  };
  processForm = (event) => {
    event.preventDefault();
    const {name, email, password} = this.state.user;
    console.log( `name:[${name}] email:[${email}] password:[${password}]`);
    Actions.postSignup( this.state.user)
    .then( (response) => {
      this.setState( {errors: {}, redirectToReferrer: true});
      console.log( "signup page post response:", response);
    })
    .catch( (err) => {
      // FIXME: this can't be right
      err.response.json().then( (res) => {
        console.log( res);
        const ne = { ...res.errors, summary: res.message};
        this.setState( { errors: ne});
      });
    });
  };
  render = () => {
    // not referer, always login
    const { redirectToReferrer } = this.state;
    if (redirectToReferrer) {
      return (
        <Redirect to="/login"/>
      );
    }
    return (
      <SignupForm onSubmit={this.processForm} onChange={this.changeUser}
        user={this.state.user} errors={this.state.errors} />
    );
  };
}
