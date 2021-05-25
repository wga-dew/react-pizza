import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Categories = React.memo(function Categories({items, onClickItem, activeCategory, isLoaded}) {

  const [activeItem, setActiveItem] = React.useState(activeCategory);

  const onSelectItem = (index) => {
    setActiveItem(index);
    onClickItem(index);
  };

  return (
    <div className="categories">
      <ul>
        <li 
          className={classNames({
            'active': activeItem === null,
            'disabled': !isLoaded,
          })}
          onClick={() => onSelectItem(null)}
        >
          Все
        </li>
        {items &&
          items.map((name, index) => (
            <li
              key={`${name}_${index}`}
              onClick={() => onSelectItem(index)}
              className={classNames({
                'active': activeItem === index,
                'disabled': !isLoaded,
              })}
            >
              {name}
            </li>
          ))
        }
      </ul>
    </div>
  );
});

Categories.propTypes = {
  items: PropTypes.array.isRequired,
  onClickItem: PropTypes.func.isRequired,
  isLoaded: PropTypes.bool.isRequired,
};

Categories.defaultProps = {items: [], activeCategory: null}

export default Categories;