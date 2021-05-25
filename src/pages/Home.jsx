import React from 'react';
import {useSelector, useDispatch} from 'react-redux';

import { setCategory, setSortBy } from '../redux/actions/filters';
import {fetchPizzas} from '../redux/actions/pizzas';
import {addPizzaToCart} from '../redux/actions/cart';

import {Categories, SortPopup, PizzaBlock, PizzaLoadingBlock} from '../components';

const categoryNames = ['Мясные', 'Вегетарианская', 'Гриль', 'Острые', 'Закрытые'];
const sortIems = [
  { name: 'популярности', type: 'popular', order: 'desc' },
  { name: 'цене', type: 'price', order: 'desc' },
  { name: 'алфавит', type: 'name', order: 'asc' },
];

const Home = React.memo(function Home() {
  const dispatch = useDispatch();
  const items = useSelector(({pizzas}) => pizzas.items);
  const cartItems = useSelector(({cart}) => cart.items);
  const isLoaded = useSelector(({ pizzas }) => pizzas.isLoaded);
  const { category, sortBy } = useSelector(({ filters }) => filters);

  React.useEffect(() => {
    dispatch(fetchPizzas(category, sortBy));
  }, [category, sortBy]);


  const onSelectCategory = React.useCallback((index) => {
    dispatch(setCategory(index));
  }, []);

  const onSelectSortType = React.useCallback((type) => {
    dispatch(setSortBy(type));
  }, []);

  const handleAddPizza = (obj) => {
    dispatch(addPizzaToCart(obj));
  };

  return (
    <div className="container">
      <div className="content__top">
        <Categories
          isLoaded={isLoaded}
          activeCategory={category}
          onClickItem={onSelectCategory}
          items={categoryNames}
        />
        <SortPopup
          activeSortType={sortBy.type}
          items={sortIems}
          onClickSortType={onSelectSortType}
        />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      <div className="content__items">
        {
          isLoaded 
          ? items && items.map(obj => <PizzaBlock onClickAddPizza={handleAddPizza} addedCount={cartItems[obj.id] && cartItems[obj.id].items.length} key={obj.id} {...obj}/>)
          : Array(12).fill(0).map((_, index) => <PizzaLoadingBlock key={index} />)
        }
      </div>
    </div>
  )
});

export default Home
