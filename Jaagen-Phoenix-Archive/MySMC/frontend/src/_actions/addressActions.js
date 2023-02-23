import { firebase } from '../firebase';
export const FETCH_ADDRESS_BEGIN = 'FETCH_ADDRESS_BEGIN';
export const FETCH_ADDRESS_SUCCESS = 'FETCH_ADDRESS_SUCCESS';
export const FETCH_ADDRESS_FAILURE = 'FETCH_ADDRESS_FAILURE';

export const fetchAddressBegin = () => ({
    type: FETCH_ADDRESS_BEGIN
});

export const fetchAddressSuccess = address => ({
    type: FETCH_ADDRESS_SUCCESS,
    payload: { address }
});

export let addressesdispatch = '';

export const fetchAddressError = error => ({
    type: FETCH_ADDRESS_FAILURE,
    payload: { error }
});

export function fetchAddress() {
    var user = firebase.auth.currentUser;
    if (user != null) {
        var email = user.email;
        return dispatch => {
            dispatch(fetchAddressBegin());
            return fetch("http://localhost:5000/api/user/"+email)
                .then(handleErrors)
                .then(res => res.json())
                // .then(rawDisplay)
                .then(json => {
                    dispatch(fetchAddressSuccess(json.personalwallets));
                    addressesdispatch = json.personalwallets;
                    return json.personalwallets;
                })
                .catch(error => dispatch => {
                    fetchAddressError(error);
                    console.log(error);
                }
            
            );
        };
    }
    else {
        return dispatch => {
            dispatch(fetchAddressError());
        };
    }      
}


export function fetchAddressWithMail(mail) {
        return dispatch => {
            dispatch(fetchAddressBegin());
            return fetch("http://localhost:5000/api/user/"+mail)
                .then(handleErrors)
                .then(res => res.json())
                .then(json => {
                    dispatch(fetchAddressSuccess(json.personalwallets));
                    addressesdispatch = json.personalwallets;
                    return json.personalwallets;
                })
                .catch(error => dispatch(fetchAddressError(error)));
        };     
}


// Handle HTTP errors since fetch won't.
function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

// function rawDisplay(response) {
//         console.log(response);
//     return response;
// }
