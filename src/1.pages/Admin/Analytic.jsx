import React from "react";
import {Link} from "react-router-dom";
import {numberWithCommas} from "../../3.helpers/function";
import axios from 'axios'
import {urlApi} from "../../3.helpers/database";

class Analytic extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            total:0,
            num:0
        }
    }
    componentDidMount() {
        axios.get(urlApi+"history").then(res => {
            let total = 0
            res.data.forEach(o => {
                total += o.totalPrice
            })
            this.setState({
                num: res.data.length,
                total: total
            })
        })
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
                                <h1>Total Income</h1>
                                <p>Total pendapatan dari user belanda adalah Rp. {numberWithCommas(this.state.total)}</p>
                            </div>
                            <div className="card-footer align-items-center">
                                Pendapatan dihitung dari {this.state.num} transaksi yang berhasil
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}
export default Analytic
