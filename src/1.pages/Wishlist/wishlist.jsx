import React from "react";
import {connect} from 'react-redux'
import axios from 'axios'
import {urlApi} from "../../3.helpers/database";
import {Link} from "react-router-dom";
import {toast} from "react-toastify";
import {numberWithCommas} from "../../3.helpers/function";

class Wishlist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            empty: false,
            wishList: [],
        }
    }

    componentDidMount() {
        if (this.props.id) {
            axios.get(`${urlApi}wishlist?userId=${this.props.id}`).then(res => {
                this.setState({
                    wishList: res.data
                })
            })
        } else {
            toast.warn('You Need to Logged In');
            this.props.history.push('/')
        }
    }

    render() {
        return (
            <div className={"container"}>
                <div className="row">
                    <div className="col-lg-12">
                        <table className="table mt-3 text-center">
                            <thead>
                            <tr>
                                <th>No</th>
                                <th>Item Name</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.wishList.map((o,id) => {
                                    return (
                                        <tr>
                                            <td>{id+1}</td>
                                            <td><Link to={'/product-details/'+o.productsId}>{o.productName}</Link></td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
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
export default connect(mapStateToProps)(Wishlist)
