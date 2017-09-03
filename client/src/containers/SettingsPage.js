import React from 'react';
import SettingsForm from '../components/SettingsForm';
import Actions from './Actions';
import Auth from '../modules/Auth';

export default class SettingsPage extends React.Component {
  state = {
    errors: {},
    user: { password:"", new_password: ""}
  };
  changeUser = ( event) => {
    // event target name not user name!
    const {name, value} = event.target;
    const user = this.state.user;
    user[name] = value;
    this.setState( {user});
  };
  processForm = (event) => {
    event.preventDefault();
    const {password, new_password} = this.state.user;
    const email = Auth.getEmail();
    console.log( `email:[${email}] passwords current:[${password}] new[${new_password}] `);
    Actions.postChangePassword( {email, password, new_password})
    .then( (response) => {
      console.log( "change password response:", response);
      Auth.authenticateUser( {token: response.token, name: response.user.name, email: email});
      this.setState( { errors: { summary: response.message }});
    })
    .catch( (err) => {
      console.error( "change password failed:", err);
      err.response.json().then( (res) => {
        console.log( res);
        const ne = { ...res.errors, summary: res.message};
        this.setState( { errors: ne});
      });
    });
  };
  render = () => {
    return (
        <SettingsForm onSubmit={this.processForm} onChange={this.changeUser}
          user={this.state.user} errors={this.state.errors} />
    );
  };
}
