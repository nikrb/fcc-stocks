import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

export default class LoginForm extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func,
    onChange: PropTypes.func,
    user: PropTypes.object,
    errors: PropTypes.object
  };
  render = () => {
    const {onSubmit,onChange,user,errors} = this.props;
    // TODO: show signup success
    return (
      <div className="container" >
        <h2>Login</h2>
        <form action="/" onSubmit={onSubmit} >
          {errors.summary && <p className="error-message">{errors.summary}</p>}
          <div className="form-row">Email
            <input type="text" name="email"
              value={user.email} onChange={onChange} />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>
          <div className="form-row">Password&nbsp;
            <input type="password" name="password"
              value={user.password} onChange={onChange} />
            {errors.password && <p className="error-message">{errors.password}</p>}
          </div>
          <div style={{margin:"10px"}}>
            <button type="submit" >Login</button>
          </div>
          <div style={{fontSize:"12px",textAlign:"center"}}>
            Dont have an account? <Link to={"/signup"}>Sign Up</Link>
          </div>
        </form>
      </div>
    );
  };
}
