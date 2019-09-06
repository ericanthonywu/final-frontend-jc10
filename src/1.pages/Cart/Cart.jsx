import React, {Component} from 'react';
import Axios from 'axios'
import {connect} from 'react-redux'
import {urlApi} from '../../3.helpers/database'
import swal from 'sweetalert'
import axios from 'axios'
import {numberWithCommas} from "../../3.helpers/function";
import {toast} from "react-toastify";
import moment from "moment";
import {Link} from "react-router-dom";
import {setCart} from "../../redux/1.actions";

class Cart extends Component {
    state = {
        cartData: [],
        isCheckout: false,
        inputPenerima: '',
        inputAlamat: '',
        inputKodePos: '',
        inputUang: 0,
        empty: false
    };

    componentWillReceiveProps(newProps) {
        axios.get(urlApi + `cart?userId=${this.props.id}`).then(res => {
            if (res.data.length) {
                this.getDataCart(newProps.id)
            }else{
                this.setState({
                    empty: true
                })
            }
        })
    }

    componentDidMount() {
        if(this.props.id) {
            axios.get(urlApi + `cart?userId=${this.props.id}`).then(res => {
                if (res.data.length) {
                    this.getDataCart(this.props.id)
                } else {
                    this.setState({
                        empty: true
                    })
                }
            })
        }else{
            toast.warn('You Need to Logged In');
            this.props.history.push('/')
        }

    }

    deleteCartItem = (id) => {
        Axios.delete(urlApi + 'cart/' + id)
            .then((res) => {
                swal('Success', 'Item Deleted', 'success');
                this.getDataCart(this.props.id)
                axios.get(`${urlApi}cart?userId=${this.props.id}`).then(res => {
                    this.props.setCart({
                        totalCart: res.data.length
                    })
                })
                axios.get(urlApi + `cart?userId=${this.props.id}`).then(res => {
                    if (res.data.length) {
                        this.getDataCart(this.props.id)
                    } else {
                        this.setState({
                            empty: true
                        })
                    }
                })
            })
            .catch((err) => {
                swal('Error', 'There is an error', 'error')
            })
    };

    getDataCart = (id) => {
        Axios.get(urlApi + 'cart?userId=' + id)
            .then(res => {
                console.log(res);
                this.setState({cartData: res.data})
            })
            .catch(err => {
                console.log(err)
            })
    };

    renderCart = () => {
        const jsx = this.state.cartData.map((val, idx) => {
            return (
                <tr>
                    <td>{val.productName}</td>
                    <td>Rp. {numberWithCommas(val.price - (val.price * (val.discount / 100)))}</td>
                    <td>
                        <div className="btn-group">
                            <button type="button" className="btn btn-secondary"
                                    onClick={() => this.onBtnEditQty('min', idx)}>-
                            </button>
                            <button type="button"
                                    className="btn btn-secondary">{numberWithCommas(val.quantity)}</button>
                            <button type="button" className="btn btn-secondary"
                                    onClick={() => this.onBtnEditQty('add', idx)}>+
                            </button>
                        </div>
                    </td>
                    <td>{numberWithCommas((val.price - (val.price * (val.discount / 100))) * val.quantity)}</td>
                    <td><input type="button" className="btn btn-danger btn-block"
                               onClick={() => this.deleteCartItem(val.id)} value="Delete"/></td>
                </tr>
            )
        });

        return jsx
    };

    onBtnEditQty = (action, idx) => {
        let arrCart = this.state.cartData;

        if (action == 'min') {
            if (arrCart[idx].quantity > 1) {
                arrCart[idx].quantity -= 1;
                Axios.put(urlApi + 'cart/' + arrCart[idx].id, arrCart[idx])
                    .then(res => this.getDataCart(this.props.id))
                    .catch(err => console.log(err))
            }
        } else if (action == 'add') {
            arrCart[idx].quantity += 1;
            Axios.put(urlApi + 'cart/' + arrCart[idx].id, arrCart[idx])
                .then(res => this.getDataCart(this.props.id))
                .catch(err => console.log(err))
        }
    };

    renderTotalCart = () => {
        let result = 0;
        this.state.cartData.map(val => {
            result += val.quantity * (val.price - (val.price * (val.discount / 100)))
        });

        return result
    };

    onBtnPay = async () => {
        if (this.state.inputPenerima && this.state.inputAlamat && this.state.inputKodePos && this.state.inputUang) {
            if (this.state.inputUang < this.renderTotalCart()) {
                toast.error("Uang Kurang")
            } else {
                toast.success("Terima kasih telah berbelanja di popok pedia");
                let result = 0;
                this.state.cartData.map(val => {
                    result += val.quantity * (val.price - (val.price * (val.discount / 100)))
                });
                if (this.state.inputUang > this.renderTotalCart()) {
                    toast.success(`Kembalian anda Rp. ${numberWithCommas(Number(this.state.inputUang) - result)}`)
                }
                axios.get(urlApi + `cart?userId=${this.props.id}`).then(prodData => {
                    axios.post(urlApi + "history", {
                        userId: this.props.id,
                        items: prodData.data,
                        time: moment().format("YYYY-MM-DD"),
                        totalPrice: this.renderTotalCart(),
                        recipient: this.props.username,
                        postalCode: this.state.inputKodePos,
                        address: this.state.inputAlamat,
                    }).then(async res => {
                        const truncateCart = () => {
                            prodData.data.forEach(async o => {
                                await axios.delete(urlApi + `cart/${o.id}`); //biar lama
                            });
                        };
                        await truncateCart();
                        this.props.history.push('/');
                    }).catch(err => {
                        toast.error(err);
                        console.log(err)
                    });
                }).catch(err => {
                    toast.error(err);
                    console.log(err)
                });
            }
        } else {
            toast.error('Input Kurang')
        }
    };

    render() {
        return (
            <div className="container">
                {
                    this.state.empty ?
                        <div className="alert alert-danger" role="alert">
                            Your Cart is Empty, Let's <Link to={'/'} style={{color: "green"}}> Go Shopping </Link>
                        </div>
                        :
                        <div>
                            <table className="table mt-3 text-center">
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Total Price</th>
                                    <th>Delete</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.renderCart()}
                                </tbody>
                            </table>
                            <div className="row">
                                <div className="col-8">
                                    <input type="button" onClick={() => {
                                        axios.get(urlApi + `cart?userId=${this.props.id}`).then(res => {
                                            if (res.data.length) {
                                                this.setState({isCheckout: !this.state.isCheckout})
                                            } else {
                                                toast.info('Cart Empty');
                                                this.props.history.push('/')
                                            }
                                        })
                                    }}
                                           className="btn btn-success btn-block" value="CHECKOUT"/>
                                </div>
                                <div className="col-4">
                                    <h3>Total Harga = Rp. {numberWithCommas(this.renderTotalCart())}</h3>
                                </div>
                            </div>
                            {this.state.isCheckout
                                ?
                                <div className="row mt-4">
                                    <div className="col-10">
                                        <div className="row">
                                            <div className="col-6">
                                                <input type="text" onChange={(e) => {
                                                    this.setState({inputPenerima: e.target.value})
                                                }} className="form-control" placeholder="Nama Penerima"/>
                                            </div>
                                            <div className="col-6">
                                                <input type="button" value="PAY" onClick={this.onBtnPay}
                                                       className="btn btn-primary btn-block"/>
                                            </div>
                                        </div>
                                        <div className="row mt-3">
                                            <div className="col-8">
                                                <input type="text" onChange={(e) => {
                                                    this.setState({inputAlamat: e.target.value})
                                                }} className="form-control" placeholder="Alamat"/>
                                            </div>
                                            <div className="col-4">
                                                <input type="text" onChange={(e) => {
                                                    this.setState({inputKodePos: e.target.value})
                                                }} className="form-control" placeholder="Kode Pos"/>
                                            </div>
                                        </div>
                                        <div className="row mt-3">
                                            <div className="col-12">
                                                <input type="number" onChange={(e) => {
                                                    this.setState({inputUang: e.target.value})
                                                }} className="form-control" placeholder="Uang situ"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                :
                                null}
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

export default connect(mapStateToProps,{setCart})(Cart)
