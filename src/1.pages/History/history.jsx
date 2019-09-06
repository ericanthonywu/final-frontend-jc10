import React from "react";
import {connect} from 'react-redux'
import axios from 'axios'
import {urlApi} from "../../3.helpers/database";
import {Link} from "react-router-dom";
import {toast} from "react-toastify";
import {numberWithCommas} from "../../3.helpers/function";

class History extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            empty: false,
            userHistory: [],
            detail: null
        }
    }

    componentDidMount() {
        if (this.props.id) {
            axios.get(`${urlApi}history?userId=${this.props.id}`).then(res => {
                this.setState({
                    userHistory: res.data
                })
            })
        } else {
            toast.warn('You Need to Logged In');
            this.props.history.push('/')
        }
    }

    getDetails = id => {
        axios.get(`${urlApi}history/${id}`).then(res => {
            this.setState({
                detail: res.data
            })
        })
    };

    render() {
        return (
            <div>
                {
                    this.state.userHistory.length ?
                        <div>
                            <table className="table mt-3 text-center">
                                <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Date</th>
                                    <th>Items</th>
                                    <th>Total Price</th>
                                    <th>Details</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    this.state.userHistory.map((o, id) => {
                                        return (
                                            <tr>
                                                <td>{id + 1}</td>
                                                <td>{o.time}</td>
                                                <td>{numberWithCommas(o.items.length)}</td>
                                                <td>Rp. {numberWithCommas(o.totalPrice)}</td>
                                                <td>
                                                    <button className={"btn btn-primary"}
                                                            onClick={() => this.getDetails(o.id)}> See Details
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                </tbody>
                            </table>
                            {
                                this.state.detail ?
                                    <div style={{width: "80%", margin: "auto"}}>
                                        <h1>Detail {this.state.detail.time}</h1>
                                        <table className="table mt-3 text-center">
                                            <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Product Name</th>
                                                <th>Quantity</th>
                                                <th>Price</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                this.state.detail.items.map((o, id) => {
                                                    return (
                                                        <tr>
                                                            <td>{id + 1}</td>
                                                            <td>{o.productName}</td>
                                                            <td>{numberWithCommas(o.quantity)}</td>
                                                            <td>Rp. {numberWithCommas(o.price - (o.price * (o.discount / 100)))}</td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                            </tbody>
                                        </table>
                                        <div className={"row"}>
                                            <div className={"col-3"} style={{textAlign: "center"}}>
                                                <span>Received By : {this.state.detail.recipient}</span>
                                            </div>
                                            <div className={"col-3"} style={{textAlign: "center"}}>
                                                <span>Address : {this.state.detail.address}</span>
                                            </div>
                                            <div className={"col-3"} style={{textAlign: "center"}}>
                                                <span>Postal Code : {this.state.detail.postalCode}</span>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    null
                            }
                        </div>

                        :
                        <div className="alert alert-danger" role="alert">
                            Your History is Empty, Let's <Link to={'/'} style={{color: "green"}}> Go Shopping </Link>
                        </div>
                }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        id: state.user.id,
        username: state.user.username
    }
};
export default connect(mapStateToProps)(History)
