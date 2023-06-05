import React from 'react';
import PropTypes from 'prop-types';
import { getCategories } from '../services/api';

class Categories extends React.Component {
  constructor() {
    super();
    this.state = {
      categoriesList: [],
    };
  }

  componentDidMount() {
    this.getListCategories();
  }

  getListCategories = async () => {
    const categoriesList = await getCategories();
    this.setState({ categoriesList });
  };

  render() {
    const { categoriesList } = this.state;
    const { getProducts } = this.props;
    return (
      <nav>
        <h1>Categorias:</h1>
        <div className="line1" />
        {categoriesList.map((categorie) => (
          <div className="" key={ categorie.id }>
            <button
              key={ categorie.id }
              id={ categorie.id }
              type="button"
              data-testid="category"
              onClick={ getProducts }

            >
              {categorie.name}

            </button>
          </div>
        ))}
      </nav>
    );
  }
}

Categories.propTypes = {
  getProducts: PropTypes.func.isRequired,
};

export default Categories;
