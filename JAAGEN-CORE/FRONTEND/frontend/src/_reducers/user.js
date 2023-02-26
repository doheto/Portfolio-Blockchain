import { fromJS } from 'immutable';
const INITIAL_STATE = fromJS({ //{
    users: {},
  //};
});
  
  const applySetUsers = (state, action) => ({
    ...state,
    users: action.users
  });
  
  function myuserReducer(state = INITIAL_STATE, action) {
    switch(action.type) {
      case 'USERS_SET' : {
        //return applySetUsers(state, action);
        return state
                .set('users', action.users);
      }
      default : return state;
    }
  }
  
  export { myuserReducer as userReducer };