import {
    REQUEST_STATE_CHANGE,
} from '../constants';


const initialState = {
    currentRequest: null,
};


export const request = (state = initialState, action) => {
    
    switch (action.type) {
        
        case 'a7a':
            console.log('55555555555555555555555555555actoin type5555555555555555555555555555555555555555555555',action.type)
            console.log('im in a7a SUCCESS------------------------------------------------------', action.currentRequest)
            return {
                ...state,
                   currentRequest: action.currentRequest,
            };
        default:
            console.log('im in default case________________________________________________')
            return { ...state };
    }
}