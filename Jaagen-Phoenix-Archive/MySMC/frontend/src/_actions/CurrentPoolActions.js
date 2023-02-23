export const FETCH_CURRENTPOOL_BEGIN = 'FETCH_CURRENTPOOL_BEGIN';
export const FETCH_CURRENTPOOL_SUCCESS = 'FETCH_CURRENTPOOL_SUCCESS';
export const FETCH_CURRENTPOOL_FAILURE = 'FETCH_CURRENTPOOL_FAILURE';

export const fetchCurrentPoolBegin = () => ({
    type: FETCH_CURRENTPOOL_BEGIN
});

export const fetchCurrentPoolSuccess = currentpool => ({
    type: FETCH_CURRENTPOOL_SUCCESS,
    payload: { currentpool }
});

export const fetchCurrentPoolError = error => ({
    type: FETCH_CURRENTPOOL_FAILURE,
    payload: { error }
});

export function fetchCurrentPool(poolid) {
    if (poolid) {
        return dispatch => {
            dispatch(fetchCurrentPoolBegin());
            return fetch("http://localhost:5000/api/pool/byadr/"+poolid)
                .then(handleErrors)
                .then(res => res.json())
                .then(rawDisplay)
                .then(json => {
                    dispatch(fetchCurrentPoolSuccess(json));
                    return json;
                })
                .catch(error => dispatch => {
                    fetchCurrentPoolError(error);
                    console.log(error);
                }
            
            );
        };
    }
    else {
        return dispatch => {
            dispatch(fetchCurrentPoolError());
        };
    }      
}


// Handle HTTP errors since fetch won't.
function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

function rawDisplay(response) {
        console.log(response);
    return response;
}
