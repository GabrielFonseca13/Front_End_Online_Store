import React from 'react';
import { Link } from 'react-router-dom';
import Produto from '../components/Produto';
import { getProductsFromCategoryAndQuery } from '../services/api';
import Categories from '../components/Categories';

class Principal extends React.Component {
  constructor() {
    super();
    this.state = {
      campoDeBusca: '',
      valor: false,
      resultadoDaBusca: {},
      quantidadeCarrinho: 0,
    };
  }

  componentDidMount() {
    this.calculaTotal();
  }

  onChange = ({ target }) => {
    const { name, value } = target;
    this.setState({
      [name]: value,
    });
  };

  handleClick = async () => {
    const { campoDeBusca } = this.state;
    const categories = await getProductsFromCategoryAndQuery(false, campoDeBusca);
    if (!categories) {
      this.setState({
        valor: false,
      });
    } else {
      this.setState({
        valor: true,
        resultadoDaBusca: categories,
      });
    }
  };

  getCategorieProducts = async ({ target }) => {
    const response = await getProductsFromCategoryAndQuery(target.id);
    const { results } = response;
    this.setState({
      valor: true,
      resultadoDaBusca: { results },
    });
  };

  salvarQuantidade = (elemento) => {
    let antes = localStorage.getItem(elemento);
    if (antes === null) {
      antes = 0;
    }
    const novo = parseInt(antes, 10) + 1;
    localStorage.setItem(elemento, novo);
    //-------------------
    this.calculaTotal();
  };

  calculaTotal = () => {
    const listaDeItens = JSON.parse(localStorage.getItem('product'));
    if (listaDeItens != null) {
      const setArray = new Set();
      const filtredArray = listaDeItens.filter((item) => {
        const duplicatedItem = setArray.has(item.id);
        setArray.add(item.id);
        return !duplicatedItem;
      });
      const ids = filtredArray.map((item) => item.id);
      const soma = ids.reduce((acc, numero) => {
        const quantidade = localStorage.getItem(`quantidade:${numero}`);
        acc += Number(quantidade);
        return acc;
      }, 0);
      this.setState({ quantidadeCarrinho: soma });
    }
  };

  render() {
    const { campoDeBusca, valor, resultadoDaBusca, quantidadeCarrinho } = this.state;
    return (
      <div>
        <div className="header">
          <input
            value={ campoDeBusca }
            onChange={ this.onChange }
            name="campoDeBusca"
            type="text"
            data-testid="query-input"
            className="inputSearch"
          />
          <button
            type="button"
            data-testid="query-button"
            onClick={ this.handleClick }
            className="buttonSearch"
          >
            Pesquisar
          </button>
        </div>
        <Categories getProducts={ this.getCategorieProducts } />
        <h3
          data-testid="home-initial-message"
        >
          Digite algum termo de pesquisa ou escolha uma categoria.

        </h3>
        {valor ? resultadoDaBusca.results.map((ele) => (
          <Produto
            // getCartItens={ this.getCartItens }
            objItem={ ele }
            key={ ele.title }
            productName={ ele.title }
            productPrice={ ele.price }
            productImage={ ele.thumbnail }
            productId={ ele.id }
            freeShipping={ ele.shipping.free_shipping }
            salvarQuantidade={ this.salvarQuantidade }
          />)) : <p>Nenhum produto foi encontrado</p> }

        <Link to="/cart" data-testid="shopping-cart-button">
          <div>
            <p>Cart</p>
            <p data-testid="shopping-cart-size">{quantidadeCarrinho}</p>
          </div>
        </Link>
      </div>
    );
  }
}

export default Principal;
