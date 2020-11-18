import React, {Component} from 'react';
import styled from 'styled-components';
import {Link, withRouter} from "react-router-dom";
import {Button, Form, FormGroup, Label, Input, Card} from 'reactstrap';
import axios from "axios";
import cookie from 'react-cookies'

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userid: '',
            passwd: '',
            token: '',
            level: '',
            login: false
        };
    }

    handleClick = (e) => {
        e.preventDefault()
        if (!/^([a-z0-9]+)$/.test(this.state.userid)) {
            alert('아이디를 확인해주세요.')
        } else if (!/([a-zA-Z0-9_-])/.test(this.state.passwd)) {
            alert('비밀번호를 확인해주세요.')
        }
        let url = 'http://h2j22020.vps.phps.kr:5000/api/login';
        const post = {
            userid: this.state.userid,
            passwd: this.state.passwd
        }
        axios.post(url, post)
            .then(response => {
                if (response.data.login === "True") {
                    this.setState({
                        token: response.data.token,
                        userid: response.data.userid,
                        level: response.data.level,
                        login: response.data.login
                    })
                    let expires = new Date();
                    let tmp = expires.getDate();
                    expires.setDate(tmp + 1);
                    const cookieOptions = {
                        path: '/',
                        expires,
                        httponly: false,
                    }
                    cookie.save("userid", this.state.userid, cookieOptions);
                    cookie.save("token", this.state.token, cookieOptions);
                    cookie.save("level", this.state.level, cookieOptions);
                    cookie.save("login", this.state.login, cookieOptions);
                    window.location.href = '/mypage'
                } else if (!response.data.login) {
                    alert("다시 로그인 하세요")
                }
            })
            .catch(e => {
                console.log(e);
            })


        this.setState({
            login: false
        })
    }

    handleInput = (e) => {
        let nextState = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);
    }

    render() {
        return (
            <Div>
                <Card body outline color="primary">
                <h3>LOGIN</h3>
                <h5>당신의 건강 지킴이 ! 큐피트 </h5>
                <div><Form  inline onSubmit={this.handleClick}>
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <Input
                            type='text'
                            name='userid'
                            placeholder='아이디'
                            defaultValue={this.state.userid}
                            onInput={this.handleInput}
                        />
                    </FormGroup>
                </Form></div>
                <Form inline onSubmit={this.handleClick}>
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <Input
                            type='password'
                            name='passwd'
                            placeholder='패스워드'
                            defaultValue={this.state.passwd}
                            onInput={this.handleInput}
                        />
                    </FormGroup>
                </Form>
                <Form inline onSubmit={this.handleClick}>
                    <Button outline color="primary" type='submit'>로그인</Button>
                    <Link to="./register">
                        <Button outline color="primary">회원가입</Button>
                    </Link>
                </Form><br/>
                <h6>비밀번호 분실 시, 운영진에게 문의 해주세요! </h6>
                </Card>
            </Div>
        );
    }
}

const Div = styled.div`
    width: 50%;
    margin: 5% auto;
    `;

export default withRouter(Login);
