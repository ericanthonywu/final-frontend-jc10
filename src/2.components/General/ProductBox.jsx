import React from 'react';
import './style.css'
import {Link} from 'react-router-dom'
import axios from 'axios'
import {urlApi} from "../../3.helpers/database";
import {connect} from 'react-redux'
import {toast, ToastContainer} from "react-toastify";
import {setCart} from "../../redux/1.actions";

class ProductBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    addToCart = e => {
        axios.get(urlApi + `cart?productId=${this.props.id}&userId=${this.props.userId}`).then(res => {
            if (res.data.length) {
                axios.put(urlApi + `cart/${res.data[0].id}`, {
                    productId: this.props.id,
                    userId: this.props.userId,
                    price: this.props.harga,
                    img: this.props.img,
                    discount: this.props.discount,
                    productName: this.props.nama,
                    quantity: res.data[0].quantity + 1
                }).then(() => {
                    axios.get(`${urlApi}cart?userId=${this.props.userId}`).then(res => {
                        this.props.setCart({
                            totalCart: res.data.length
                        })
                    })
                    toast.success(`Products ${this.props.nama} Successfully added!`)
                })
            } else {
                axios.post(urlApi + "cart", {
                    productId: this.props.id,
                    userId: this.props.userId,
                    quantity: 1,
                    price: this.props.harga,
                    img: this.props.img,
                    discount: this.props.discount,
                    productName: this.props.nama,
                }).then(() => {
                    axios.get(`${urlApi}cart?userId=${this.props.userId}`).then(res => {
                        this.props.setCart({
                            totalCart: res.data.length
                        })
                    })
                    toast.success(`Products ${this.props.nama} Successfully added!`)
                })
            }
        });
    };


    render() {
        return (
            <div className="card col-md-3 m-3" style={{width: '18rem'}}>
                <Link to={"/product-details/" + this.props.id}>
                    <img className="card-img-top img" height='200px' src={this.props.img} alt="Card"/>
                </Link>
                {
                    this.props.discount > 0
                        ?
                        <div className="discount">{this.props.discount}%</div>
                        :
                        null
                }
                <div className="card-body">
                    <h4 className="card-text">{this.props.nama}</h4>
                    {
                        this.props.discount > 0
                            ?
                            <p style={{
                                textDecoration: 'line-through',
                                color: 'red'
                            }}>Rp. {new Intl.NumberFormat('id-ID').format(this.props.harga)}</p>
                            :
                            null
                    }
                    <p className="card-text">Rp. {new Intl.NumberFormat('id-ID').format(this.props.harga - (this.props.harga * (this.props.discount / 100)))}</p>
                </div>
                <div className="card-footer" style={{backgroundColor: 'inherit'}}>
                    <input type='button' onClick={this.addToCart} className='d-block btn btn-primary btn-block'
                           value='Add To Cart'/>
                </div>
            </div>
        );
    }
}

const mapToStateProps = state => {
    return {
        userId: state.user.id
    }
};

export default connect(mapToStateProps,{setCart})(ProductBox);
