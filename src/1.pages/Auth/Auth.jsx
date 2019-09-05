import React, { Component } from 'react';
import './Auth.css'
// 1. Import action itu sendiri
import {onLogin, onRegister} from './../../redux/1.actions'
// 2. Import connect dari react-redux
import {connect} from 'react-redux'
import Cookie from 'universal-cookie'
import {Redirect} from 'react-router-dom'
import swal from 'sweetalert';


let cookieObj = new Cookie()

class Auth extends Component {
    state = {
        page : 'REGISTER',
        registerUsername : '',
        registerPassword : '',
        repeatPassword : '',
        registerEmail : '',
        loginUsername : '',
        loginPassword: '',
        isSame : true
    }

    componentWillReceiveProps(newProps){
        cookieObj.set('userData', newProps.username, {path : '/'})
    }

    onLoginBtnHandler = () => {
        // let loginObj = {
        //     username : this.state.loginUsername,
        //     password : this.state.loginPassword
        // }
        // this.props.onLogout()
        this.props.onLogin({asalNama : this.state.loginUsername, asalKunci : this.state.loginPassword})
    }

    onRegisterBtnHandler = () => {
        if(this.state.repeatPassword !== this.state.registerPassword || (this.state.repeatPassword == '' && this.state.registerPassword == '')){
            this.setState({isSame : false})
        }
        if(!this.state.registerEmail){
            this.refs.registerEmail.className += ' invalid-input'
        }
        if(!this.state.registerUsername){
            this.refs.registerUsername.className += ' invalid-input'
        }
        if(!this.state.repeatPassword){
            this.refs.repeatPassword.className += ' invalid-input'
        }
        if(!this.state.registerPassword){
            this.refs.registerPassword.className += ' invalid-input'
        }
        if(this.state.registerEmail && this.state.registerPassword && this.state.repeatPassword && this.state.registerUsername){
            let registerObj = {
                username : this.state.registerUsername,
                password : this.state.registerPassword,
                email : this.state.registerEmail
            }
    
            this.props.onRegister(registerObj)
        }else{
            swal('input')
        }
    }

    validateInputRegister = () => {
        
    }

    passwordChecker = () => {
        if(!this.state.isSame){
            return(
                <div className="alert alert-danger">Password belom sama</div>
            )
        }
    }

    onBtnEnter = (e) => {
        if(e.key === 'Enter'){
            // alert("masuk")
            this.refs.loginBtn.click()
        }
    }

    render() {
        if(this.props.username !== ''){
            return <Redirect to="/" exact />
        }
        return (
            <div className="container auth">
                {
                    this.props.message !== ''
                    ?
                    <h3>{this.props.message}</h3>
                    :
                    null
                }
                <div className="row">
                    <div className="col-3 text-center auth-left">
                        <h3>Welcome!</h3>
                        <p>Belanja anti ribet di Popokpedia, mari bergabung bersama kami!</p>
                        <br/>
                        <br/>
                        <div className="tab-auth">
                            <div className={"d-inline-block m-1 text-center " + (this.state.page == "LOGIN" ? "active-auth" : '')} onClick={() => this.setState({page : 'LOGIN'})}>
                                Login
                            </div>
                            <div className={"d-inline-block m-1 text-center " + (this.state.page == "REGISTER" ? 'active-auth' : '')} onClick={() => this.setState({page : "REGISTER"})}>
                                Register
                            </div>
                        </div>
                    </div>
                    <div className="col-9 auth-right text-center pb-5">
                        {
                            this.state.page == "REGISTER" 
                            ?
                            <div className="container-fluid">
                                <h3 className="pb-3" style={{color : '#495057', marginTop:'8%'}}>Register Now!</h3>
                                <div className="row">
                                    <div className="col-6">
                                        <div className="form-group">
                                            <input type="text" ref='registerUsername' onChange={(e) => this.setState({registerUsername : e.target.value})} className="form-control" placeholder="Username"/>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="form-group">
                                            <input type="text" ref="registerEmail" onChange={(e) => this.setState({registerEmail : e.target.value})} className="form-control" placeholder="Email"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <div className="form-group">
                                            <input type="password" ref='registerPassword' onChange={(e) => this.setState({registerPassword : e.target.value})} className="form-control" placeholder="Password"/>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="form-group">
                                            <input type="password" ref="repeatPassword" onChange={(e) => this.setState({repeatPassword : e.target.value})} className="form-control" placeholder="Repeat Password"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-8">
                                        {this.passwordChecker()}
                                    </div>
                                    <div className="col-4">
                                        {
                                            !this.props.isLoading
                                            ?
                                            <input type="button" onClick={this.onRegisterBtnHandler} ref="btnLogin" className="btn float-right btn-register" value="Register"/>
                                            :
                                            <div className="spinner-border text-primary">
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                            :
                            <div className="container-fluid">
                                <h3 className="pb-3" style={{color : '#495057', marginTop:'8%'}}>Login Now!</h3>
                                <div className="row">
                                    <div className="col-6">
                                        <div className="form-group">
                                            <input type="text" className="form-control" placeholder="Username" onChange={(e) => this.setState({loginUsername : e.target.value})}/>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="form-group">
                                            <input type="password" className="form-control" placeholder="Password" onKeyDown={this.onBtnEnter} onChange={(e) => this.setState({loginPassword : e.target.value})}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <input type="button" className="btn float-right btn-register" value="Login" ref='loginBtn' onClick={this.onLoginBtnHandler}/>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoading : state.user.loading,
        message : state.user.msg,
        username : state.user.username
    }
}

// 3. connect (<MAPSTATETOPROPS>, {<ACTION>})(<COMPONENT>)
export default connect(mapStateToProps, {onLogin, onRegister})(Auth);