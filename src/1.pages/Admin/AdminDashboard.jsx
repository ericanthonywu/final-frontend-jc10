import React, { Component } from 'react';
import Axios from 'axios'
import swal from 'sweetalert'
import {urlApi} from '../../3.helpers/database'
import './style.css'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import ManageProduct from './ManageProduct';
import ParaSultan from './ParaSultan';


class AdminDashboard extends Component {
    state = {
        tabMenu : 1
    }

    // componentDidMount(){
    //     Axios.request
    // }

    render() {
        if(this.props.role !== 'admin')
        return <Redirect to="/" />

        return (
            <>
                <div className="admin-tab text-center d-flex mt-2 shadow">
                    <div style={{flex:1}} onClick={() => this.setState({tabMenu : 1})} className={'admin-tab-menu ' + (this.state.tabMenu == 1 ? "admin-tab-selected" : null)}>Manage Product</div>
                    <div style={{flex:1}} onClick={() => this.setState({tabMenu : 2})} className={'admin-tab-menu ' + (this.state.tabMenu == 2 ? "admin-tab-selected" : null)}>Best Selling Products</div>
                    <div style={{flex:1}} onClick={() => this.setState({tabMenu : 3})} className={'admin-tab-menu ' + (this.state.tabMenu == 3 ? "admin-tab-selected" : null)}>Para Sultan</div>
                </div>
                <div className="admin-content">
                    {this.state.tabMenu == 1 ? <ManageProduct/> : null}
                    {this.state.tabMenu == 3 ? <ParaSultan/> : null}
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        role : state.user.role
    }
}

export default connect(mapStateToProps)(AdminDashboard);