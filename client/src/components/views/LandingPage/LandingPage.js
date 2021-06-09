import React, { useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
function LandingPage(props) {
    useEffect(() => {
        axios.get('/api/hello')
            .then(response => { console.log(response)})
    }, [])
    
    const onClickHandler = () => {
        axios.get('/api/users/logout')
            .then(response => {
                if (response.data.logoutSuccess) {
                    alert('로그아웃되었습니다');
                    //history.push 부분이 react-router-dom에서 지원.
                    props.history.push('/login')
                } else {
                    alert('로그아웃 하는데 실패했습니다.');
                }
        })
    }

    return (
        <LandingPageStyled>
            <h2>시작페이지</h2>
            <button onClick={onClickHandler}>로그아웃</button>
        </LandingPageStyled>
    );
}

const LandingPageStyled = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;
`;

export default withRouter(LandingPage);