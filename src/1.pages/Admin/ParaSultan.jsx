import React, {Component} from 'react';
import axios from 'axios'
import {urlApi} from '../../3.helpers/database';
import {numberWithCommas} from "../../3.helpers/function";
import {Link} from "react-router-dom";

class ParaSultan extends Component {
    state = {
        data: [],
        isiCart: 0
    };

    componentDidMount() {
        axios.get(urlApi + 'history')
            .then(res => {
                const max = this.getMax(res.data, 'totalPrice');
                axios.get(`${urlApi}users/${max.userId}`).then(user => {
                    const html = (
                        <div>
                            <h1>User Tersultan adalah {user.data.username}</h1>
                            <p>Total belanjaan tertingginya Rp. {numberWithCommas(max.totalPrice)}</p>
                        </div>
                    );
                    this.setState({isiCart: html})
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    getMax = (arr, prop) => {
        let max;
        for (let i = 0; i < arr.length; i++) {
            if (!max || parseInt(arr[i][prop]) > parseInt(max[prop]))
                max = arr[i];
        }
        return max;
    };

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
                                Ayo <Link to={'/'}>kalahkan admin!</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ParaSultan;
