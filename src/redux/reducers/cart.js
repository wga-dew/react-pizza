const initialState = {
  items: JSON.parse(window.sessionStorage.getItem('cartItems')) || {},
  totalPrice: JSON.parse(window.sessionStorage.getItem('totalPrice')) || 0,
  totalCount: JSON.parse(window.sessionStorage.getItem('totalCount')) || 0,
};

const setSessionStorage = (params = {}) => {
  const keys = Object.keys(params);
  Object.values(params).map((val, i) => window.sessionStorage.setItem(keys[i], JSON.stringify(val)))
}

const deleteSessionStorageItem = (params = []) => {
  for(let i = 0; i < params.length; i++) {
    window.sessionStorage.removeItem(params[i])
  }
};

const _get = (obj, path) => {
  const [firstKey, ...keys] = path.split('.');
  return keys.reduce((val, key) => {
    return val[key];
  }, obj[firstKey]);
};

const getTotalSum = (obj, path) => {
  return Object.values(obj).reduce((sum, obj) => {
    const value = _get(obj, path);
    return sum + value;
  }, 0)
};

const getTotalPrice = arr => arr.reduce((sum, obj) => obj.price + sum, 0);

const cart = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_PIZZA_CART': {
      const currentPizzaItems = !state.items[action.payload.id] ? [action.payload] : [...state.items[action.payload.id].items, action.payload];

      const newItems = {
        ...state.items,
        [action.payload.id]: {
          items: currentPizzaItems,
          totalPrice: getTotalPrice(currentPizzaItems)
        }
      }

      // console.log(_get(newItems, 'items.length'))
      const totalCount = getTotalSum(newItems, 'items.length');
      const totalPrice = getTotalSum(newItems, 'totalPrice');

      setSessionStorage({cartItems: newItems, totalPrice, totalCount})

      return {
        ...state, 
        items: newItems,
        totalCount,
        totalPrice
      }; 
    }
    case 'PLUS_CART_ITEM': {
      const newObjItems = [
        ...state.items[action.payload].items,
        state.items[action.payload].items[0],
      ];
      const newItems = {
        ...state.items,
        [action.payload]: {
          items: newObjItems,
          totalPrice: getTotalPrice(newObjItems),
        },
      };

      const totalCount = getTotalSum(newItems, 'items.length');
      const totalPrice = getTotalSum(newItems, 'totalPrice');

      setSessionStorage({cartItems: newItems, totalPrice, totalCount})

      return {
        ...state,
        items: newItems,
        totalCount,
        totalPrice,
      };
    }
    case 'MINUS_CART_ITEM': {
      const oldItems = state.items[action.payload].items;
      const newObjItems = oldItems.length > 1 ? state.items[action.payload].items.slice(1) : oldItems;
      const newItems = {
        ...state.items,
        [action.payload]: {
          items: newObjItems,
          totalPrice: getTotalPrice(newObjItems),
        },
      };

      const totalCount = getTotalSum(newItems, 'items.length');
      const totalPrice = getTotalSum(newItems, 'totalPrice');

      setSessionStorage({cartItems: newItems, totalPrice, totalCount})

      return {
        ...state,
        items: newItems,
        totalCount,
        totalPrice,
      };
    }

    case 'REMOVE_CART_ITEM' : {
      const newItems = {
        ...state.items,
      };

      const currentTotalPrice = newItems[action.payload].totalPrice;
      const currentTotalCount = newItems[action.payload].items.length;
      const totalPrice = state.totalPrice - currentTotalPrice;
      const totalCount = state.totalCount - currentTotalCount;

      delete newItems[action.payload];

      setSessionStorage({cartItems: newItems, totalPrice, totalCount})

      return {
        ...state,
        items: newItems,
        totalPrice,
        totalCount
      };
    }

    
    case 'CLEAR_CART': {
      deleteSessionStorageItem(['cartItems', 'totalPrice', 'totalCount'])

      return {
        ...state,
        items: {},
        totalCount: 0,
        totalPrice: 0
      };
    }

    default: return state;
  }
};

export default cart;