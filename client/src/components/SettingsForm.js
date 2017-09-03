import React from 'react';
import PropTypes from 'prop-types';

export default class SettingsForm extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func,
    onChange: PropTypes.func,
    user: PropTypes.object,
    errors: PropTypes.object
  };
  render = () => {
    const {onSubmit, onChange, user, errors} = this.props;
    return (
      <div className="container" >
        <form action="/" onSubmit={onSubmit} >
          <h2>Change Password</h2>
          {errors.summary && <p className="error-message">{errors.summary}</p>}
          <div>Current Password
            <div className="error-wrap">
              {errors.password && <p className="error-field">{errors.password}</p>}
              <input type="password" name="password"
                value={user.password} onChange={onChange} />
            </div>
          </div>
          <div>New Password
            <div className="error-wrap">
              {errors.new_password && <p className="error-field">{errors.new_password}</p>}
              <input type="password" name="new_password"
                value={user.new_password} onChange={onChange} />
            </div>
          </div>
          <div style={{margin:"10px"}}>
            <button type="submit" >Submit</button>
          </div>
        </form>
      </div>
    );
  };
}
