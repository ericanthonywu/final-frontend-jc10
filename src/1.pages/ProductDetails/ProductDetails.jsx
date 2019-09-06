import React, {Component} from 'react';
import {FavoriteBorderOutlined, Favorite} from '@material-ui/icons'
import Axios from 'axios'
import {urlApi} from '../../3.helpers/database'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import swal from 'sweetalert'
import {toast} from "react-toastify";
import {setCart} from "../../redux/1.actions";

class ProductDetails extends Component {

    state = {
        product: {},
        wishlist: false,
        qtyInput: 0
    };

    componentDidMount() {
        this.getProductDetails()
    }

    getProductDetails = () => {
        // localhost:2000/products/2
        Axios.get(urlApi + 'products/' + this.props.match.params.id)
            .then((res) => {
                console.log(res);
                this.setState({product: res.data})
                Axios.get(`${urlApi}wishlist?userId=${this.props.id}&productsId=${this.props.match.params.id}`).then(wishlist => {
                    if(wishlist.data.length){
                        this.setState({
                            wishlist: true
                        })
                    }
                })
            })
            .catch((err) => {
                console.log(err)
            })
    };

    addToCart = () => {
        let cartObj = {
            productId: this.state.product.id,
            userId: this.props.id,
            quantity: parseInt(this.state.qtyInput),
            price: this.state.product.harga,
            img: this.state.product.img,
            discount: this.state.product.discount,
            productName: this.state.product.nama
        };
        // localhost:2000/cart?userId=2&productId=1
        Axios.get(urlApi + `cart?userId=${this.props.id}&productId=${this.state.product.id}`)
            .then((res) => {
                if (res.data.length > 0) {
                    cartObj.quantity = parseInt(res.data[0].quantity) + parseInt(this.state.qtyInput);
                    Axios.put(urlApi + 'cart/' + res.data[0].id, cartObj)
                        .then((res) => {
                            swal('Add to cart', 'Item added to cart', 'success');
                            Axios.get(`${urlApi}cart?userId=${this.props.id}`).then(res => {
                                this.props.setCart({
                                    totalCart: res.data.length
                                })
                            })
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                } else {
                    Axios.post(urlApi + 'cart', cartObj)
                        .then((res) => {
                            swal('Add to cart', 'Item added to cart', 'success');
                            Axios.get(`${urlApi}cart?userId=${this.props.id}`).then(res => {
                                this.props.setCart({
                                    totalCart: res.data.length
                                })
                            })
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            })
            .catch((err) => {
                console.log(err)
            })
    };
    toogleWishlist = async () => {
        await this.setState({wishlist: !this.state.wishlist});
        if (this.state.wishlist) {
            await Axios.post(urlApi + "wishlist", {
                userId: this.props.id,
                productsId: this.state.product.id,
                productName: this.state.product.nama
            })
        } else {
            Axios.get(`${urlApi}wishlist?userId=${this.props.id}&productsId=${this.state.product.id}`).then(res => {
                Axios.delete(`${urlApi}wishlist/${res.data[0].id}`)
            })
        }
    };


    render() {
        var {nama, harga, discount, deskripsi, img} = this.state.product;
        return (
            <div className='container mt-3'>
                <div className="row">
                    <div className='col-md-4'>
                        <div className="card" style={{width: '100%'}}>
                            <img className="card-img-top" src={img} alt="Card cap"/>
                            <div className="card-body">
                            </div>
                        </div>
                    </div>

                    <div className='col-md-8'>
                        <h1 style={{color: '#4c4c4c'}}>{nama} &nbsp;{this.state.wishlist ?
                            <Favorite onClick={this.toogleWishlist}
                                      style={{color: 'red', fontSize: 32, cursor: 'pointer'}}/> :
                            <FavoriteBorderOutlined onClick={this.toogleWishlist}
                                                    style={{color: 'red', fontSize: 32, cursor: 'pointer'}}/>}</h1>
                        <div style={{
                            backgroundColor: '#D50000',
                            width: "50px",
                            height: '22px',
                            color: 'white',
                            textAlign: 'center',
                            display: 'inline-block'
                        }}>
                            {discount}%
                        </div>
                        <span style={{
                            fontSize: '12px',
                            fontWeight: '600',
                            color: "#606060",
                            marginLeft: '10px',
                            textDecoration: 'line-through'
                        }}>Rp. {harga} </span>

                        <div style={{
                            fontSize: '24px',
                            fontWeight: '700',
                            color: '#FF5722',
                            marginTop: '20px'
                        }}>Rp. {harga - (harga * (discount / 100))}</div>

                        <div className='row'>
                            <div className='col-md-2'>
                                <div style={{
                                    marginTop: '15px',
                                    fontSize: '16px',
                                    fontWeight: '700',
                                    color: '#606060'
                                }}>Jumlah
                                </div>
                                <input ref="qty" onChange={(e) => this.setState({qtyInput: e.target.value})}
                                       type="number" min={0} className="form-control"
                                       style={{width: '60px', marginTop: '10px'}}/>
                            </div>
                            <div className='col-md-6'>
                                <div style={{
                                    marginTop: '15px',
                                    fontSize: '16px',
                                    fontWeight: '700',
                                    color: '#606060'
                                }}>Catatan Untuk Penjual (Opsional)
                                </div>
                                <input type='text' style={{marginTop: '12px'}}
                                       placeholder="Contoh: Warna Putih, Ukuran XL" className='form-control'/>
                            </div>
                        </div>
                        <div className='row mt-4'>
                            <div className='col-md-8'>
                                <p style={{color: '#606060', fontStyle: "italic"}}>{deskripsi}
                                </p>
                            </div>
                        </div>
                        <div className='row mt-4'>
                            <div className="col-md-4">
                                {
                                    this.props.username !== ''
                                        ?
                                        <input type="button" onClick={this.addToCart}
                                               className='btn btn-success btn-block' value="Tambah ke Keranjang"/>
                                        :
                                        <Link to="/auth" style={{textDecoration: 'none'}}>
                                            <input type="button" className='btn btn-success btn-block'
                                                   value="Tambah ke Keranjang"/>
                                        </Link>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        username: state.user.username,
        id: state.user.id
    }
};

export default connect(mapStateToProps, {setCart})(ProductDetails)
