import { LOGIN_USER,REGISTER_USER } from '../_actions/types';

export default function user (state={}, action) {
    //action type를 받아서 각각 처리
    switch (action.type) {
        case LOGIN_USER:
            return { ...state, loginSuccess: action.payload }
            break;
            
        case REGISTER_USER:
            return { ...state, registerSuccess: action.payload }
            break;
        default:
            return state;
    }
}