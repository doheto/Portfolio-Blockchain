import { fromJS } from 'immutable';

const INITIAL_STATE = fromJS({ //{
    authUser: null,
  //};
});
  
  const applySetAuthUser = (state, action) => ({
    ...state,
    authUser: action.authUser
  });
  
  function mysessionReducer(state = INITIAL_STATE, action) {
    switch(action.type) {
      case 'AUTH_USER_SET' : {
        //return applySetAuthUser(state, action);
        return state
                .set('authUser', action.authUser);
      }
      default : return state;
    }
  }
  
  export { mysessionReducer as sessionReducer};