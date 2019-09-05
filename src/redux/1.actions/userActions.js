import Axios from 'axios'
import {urlApi} from '../../3.helpers/database'
import swal from 'sweetalert'
import Cookie from 'universal-cookie'

const cookieObj = new Cookie()

export const onLogin = (userObject) => {
    /**
     * sama sepeerti loginObj
     * userObject = { 
     *      username : state/inputan,
     *      password : state/inputan
     * }
     * 
     * userObject = {asalNama : this.state.loginUsername, asalKunci : this.state.loginPassword}
     */

    return (dispatch) => {
        dispatch({
            type : 'IS_LOADING'
        })

        Axios.get(urlApi + 'users', {
            params : {
                // properti di kiri adalah column dari Database
                username : userObject.asalNama,
                password : userObject.asalKunci
            }
        })
        .then((res) => {
            console.log(res)
            if(res.data.length > 0){
                dispatch({
                    type : 'LOGIN_SUCCESS',
                    payload : {
                        a : res.data[0].username,
                        b : res.data[0].role,
                        c : res.data[0].id
                    }
                })
            }
        })
        .catch((err) => {
            console.log(err)
            swal('System Error', 'A problem has occured, please contact an administrator', 'error')
        })
    }
}

export const onRegister = (userObject) => {
    return (dispatch) => {
        dispatch({
            type : 'IS_LOADING'
        })

        Axios.get(urlApi + 'users', {
            params : {
                username : userObject.username
            }
        })
        .then((res) => {
            if(res.data.length > 0){
                dispatch({
                    type : 'USERNAME_UDAH_ADA',
                    hasil : 'Username taken'
                })
            }else{
                userObject.role = 'user'
                Axios.post(urlApi + 'users', userObject)
                .then((res) => {
                    dispatch({
                        type : 'LOGIN_SUCCESS',
                        payload : {
                            a : res.data.username,
                            b : res.data.role,
                            c : res.data.id
                        }
                    })
                    swal('Success', 'Registration Succesful!', 'success')
                })
                .catch((err) => {
                    console.log(err)
                })
            }
        })
        .catch((err) => {
            console.log(err)
        })
    }
}

export const keepLogin = (cookieData) => {
    return (dispatch) => {
        Axios.get(urlApi + 'users', {
            params : {
                username : cookieData
            }
        })
        .then((res) => {
            dispatch({
                type : 'KEEP_LOGIN',
                payload : {
                    username : res.data[0].username,
                    role : res.data[0].role,
                    id : res.data[0].id
                }
            })
        })
        .catch((err) => {
            console.log(err)
        })
    }
}

export const resetUser = () => {

    return (dispatch) => {
        dispatch({
            type : 'RESET_USER'
        })
    }
}

export const toggleUserId = () => {
    return(dispatch) => {
        dispatch({
            type : 'TOGGLE_ID'
        })
    }
}

export const cookieChecker = () => {
    return(dispatch) => {
        dispatch({
            type : 'COOKIE_CHECKED'
        })
    }
}