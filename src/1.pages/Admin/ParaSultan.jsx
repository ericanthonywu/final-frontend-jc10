import React, { Component } from 'react';
import Axios from 'axios'
import { urlApi } from '../../3.helpers/database';

class ParaSultan extends Component {
    state = {
        data : [],
        isiCart : 0
    }

    componentDidMount(){
        Axios.get(urlApi + 'cart?userId=1')
        .then(res => {
            console.log(res)
            this.setState({isiCart : res.data.length})
        })
        .catch(err => {
            console.log(err)
        })
    }

    renderResult = () => {
        let totalQty = 0

        this.state.data.map(val => {
            totalQty += parseInt(val.quantity)
        })

        return totalQty
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="card shadow mt-3">
                            <div className="card-header border-0 pt-5">
                                {/* <h3>Admin Dashboard</h3> */}
                            </div>
                            <div className="card-body">
                                {this.state.isiCart}
                            </div>
                            <div className="card-footer align-items-center">
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ParaSultan;