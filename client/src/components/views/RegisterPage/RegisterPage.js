import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../_actions/user_action';
import { withRouter } from 'react-router-dom';


function RegisterPage(props) {
    const dispatch = useDispatch();
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [Name, setName] = useState('');
    const [ConfirmPassword, setConfirmPassword] = useState('');
    const onEmailHandler = (e) => {
        setEmail(e.currentTarget.value);
    }
    const onNameHandler = (e) => {
        setName(e.currentTarget.value);
    }
    const onPasswordHandler = (e) => {
        setPassword(e.currentTarget.value);
    }
    const onConfirmPasswordHandler = (e) => {
        setConfirmPassword(e.currentTarget.value);
    }
    const onSubmitHandler = (e) => {
        e.preventDefault(); //refresh 방지
        
        if (Password !== ConfirmPassword) {
            return alert('비밀번호와 비밀번호 확인은 같아야 합니다.');
        }
        let body = {
            email: Email,
            name:Name,
            password: Password,
            confirmpassword:ConfirmPassword
        }
        dispatch(registerUser(body))
            .then(response => {
                if (response.payload.registerSuccess) {
                    alert(body.name+'님, 회원가입을 축하합니다!');
                    props.history.push('/login')
                } else {
                    alert('회원가입에 실패했습니다! 관리자에게 문의하세요.');
                }
            })
}
    return (
        <RegisterPageStyled>
            <form onSubmit={onSubmitHandler}>
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />

                <label>Name</label>
                <input type="text" value={Name} onChange={onNameHandler} />

                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />

                <label>Confirm Password</label>
                <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler} />

                <br />
                <button>
                    회원가입
                </button>
            </form>
        </RegisterPageStyled>
    );
}
const RegisterPageStyled = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;
    form{
        display: flex;
        flex-direction: column;
    }
`;

export default withRouter(RegisterPage);