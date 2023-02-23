import React from 'react';

import { auth } from '../firebase';

const MySignOutButton = () =>
  <button
    type="button"
    onClick={auth.doSignOut}
  >
    Sign Out
  </button>

export { MySignOutButton as SignOutButton };