import React, {Component} from 'react';
import {connect} from 'react-redux'
import ProductBox from '../../2.components/General/ProductBox';
import Axios from 'axios'
import {urlApi} from '../../3.helpers/database'
import swal from 'sweetalert'
import Carousel from '../../2.components/General/Carousel'
import {toggleUserId} from '../../redux/1.actions';

// GIT PULL ORIGIN MASTER
class Home extends Component {
    state = {
        productData: []
    };


    componentDidMount() {
        this.getDataProducts()
    }

    getDataProducts = () => {
        Axios.get(urlApi + 'products')
            .then((res) => {
                this.setState({productData: res.data})
            })
            .catch((err) => {
                console.log(err);
                swal('Error', 'System Error', 'error')
            })
    };

    renderProducts = () => {
        return this.state.productData.map(val => {
            return (
                <ProductBox nama={val.nama} harga={val.harga} discount={val.discount} img={val.img} id={val.id}/>
            )
        })
    };

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-lg-3 mt-4">
                        <div className="input-group mb-2">
                            <input type="text" ref="searchBook" className="form-control"
                                   placeholder="Masukkan kata kunci ... "/>
                            <div className="input-group-append">
                                <button className="btn btn-info" type="button" id="button-addon2"
                                        onClick={this.props.toggleUserId}>Go
                                </button>
                            </div>
                        </div>
                        <div className="card p-2">

                            <form ref="formFilter" style={{boxShadow: "none", fontSize: "14px"}}>
                                <div
                                    className="form-label col-sm-6 text-left font-weight-bold pl-1 text-secondary  -1">Cari
                                    Produk
                                </div>
                                <input className="form-control form-control-sm mb-2" placeholder="Cari Produk"></input>

                                <div
                                    className="form-label col-sm-6 text-left font-weight-bold pl-1 text-secondary mb-1">Cari
                                    Toko
                                </div>
                                <input className="form-control form-control-sm mb-2" placeholder="Cari Toko"></input>

                                <div
                                    className="form-label col-sm-6 text-left font-weight-bold pl-1 text-secondary mb-1">Cari
                                    User
                                </div>
                                <input className="form-control form-control-sm mb-2" placeholder="Cari User"></input>

                                <button className="btn btn-info"><i class="fas fa-filter"></i> Filter</button>
                            </form>

                        </div>
                    </div>
                    <div className="col-lg-9 mt-4">
                        <div>
                            <Carousel/>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row justify-content-center">
                        {this.renderProducts()}
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(state => {
    return {
        username: state.user.username
    }
}, {toggleUserId})(Home)
