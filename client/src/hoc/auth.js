import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action';
import { withRouter } from 'react-router-dom';
// eslint-disable-next-line import/no-anonymous-default-export
export default function (SpecificComponent, option, adminRoute = null) {
    //specificcomponent>>auth 로 감싸줄 컴퍼넌트, option>>null>아무나 출입이 가능한 페이지 true>로그인한 유저만 출입이 가능한 페이지 false>로그인 한 유저는 출입 불가 한 페이지 , adminRoute는 기본이 null true면 어드민만.
    function AuthenticationCheck(props) {
        //backend에서 user state가져오기. api get으로 가져오는부분 있음. 리덕스사용할거임.
        const dispatch = useDispatch();
        useEffect(() => {
            dispatch(auth()).then(response => {
                console.log(response);

                //로그인 하지 않은 상태
                if (!response.payload.isAuth) {
                    if (option === true) {
                        props.history.push('/')
                    }
                } else {
                    //로그인 한 상태
                    if (adminRoute && !response.payload.isAdmin) {
                        //adminRoute >>어드민만 들어갈수있는페이지이고  !response.payload.isAdmin>>로그인한사람이 어드민이 아니라면
                        props.history.push('/')
                    } else {
                        //로그인 한 유저가 못들어가는페이지
                        if (option === false) {
                            props.history.push('/')
                        }
                    }
                }
            })
        }, [])
        return (<SpecificComponent />)
    }
    return withRouter(AuthenticationCheck);
}