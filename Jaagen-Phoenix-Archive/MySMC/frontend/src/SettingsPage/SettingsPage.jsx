import React from 'react';  // u put the brackets when the import is not the default import of the component 
import { withRouter } from 'react-router-dom';

const MySettingsPage = ({ history }) =>
  <div>
    <h3>Settings Page</h3>
  </div>


const SettingsPage = withRouter(MySettingsPage);
export { SettingsPage };
