import { useReducer } from "react";

const initialState = {
  items: [],
  searchQuery: "",
};

const ACTION_TYPES = {
  ADD_ITEM: "ADD_ITEM",
  UPDATE_ITEM: "UPDATE_ITEM",
  REMOVE_ITEM: "REMOVE_ITEM",
  CLEAR_ALL: "CLEAR_ALL",
  SET_SEARCH_QUERY: "SET_SEARCH_QUERY",
};

function tableViewReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.ADD_ITEM: {
      const { product } = action.payload;
      const existingItem = state.items.find(item => item.productId === product.id);
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      
      return {
        ...state,
        items: [...state.items, {
          id: Date.now(),
          productId: product.id,
          name: product.name,
          sku: product.sku,
          price: product.price,
          taxRate: product.taxRate,
          quantity: 1,
        }],
      };
    }

    case ACTION_TYPES.UPDATE_ITEM: {
      const { itemId, field, value } = action.payload;
      return {
        ...state,
        items: state.items.map(item =>
          item.id === itemId ? { ...item, [field]: value } : item
        ),
      };
    }

    case ACTION_TYPES.REMOVE_ITEM: {
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
    }

    case ACTION_TYPES.CLEAR_ALL:
      return { ...state, items: [] };

    case ACTION_TYPES.SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };

    default:
      return state;
  }
}

const parseNumber = (val) => {
  const n = parseFloat(val);
  return Number.isFinite(n) ? n : 0;
};

export const calculateTableTotals = (items) => {
  let total = 0;
  
  items.forEach(item => {
    const qty = parseNumber(item.quantity);
    const price = parseNumber(item.price);
    const taxRate = parseNumber(item.taxRate || 18);
    const lineBase = qty * price;
    const lineTax = (lineBase * taxRate) / 100;
    total += lineBase + lineTax;
  });
  
  return {
    itemCount: items.length,
    total,
  };
};

export function useTableViewReducer() {
  const [state, dispatch] = useReducer(tableViewReducer, initialState);

  const actions = {
    addItem: (product) => dispatch({ type: ACTION_TYPES.ADD_ITEM, payload: { product } }),
    updateItem: (itemId, field, value) => dispatch({ 
      type: ACTION_TYPES.UPDATE_ITEM, 
      payload: { itemId, field, value } 
    }),
    removeItem: (itemId) => dispatch({ type: ACTION_TYPES.REMOVE_ITEM, payload: itemId }),
    clearAll: () => dispatch({ type: ACTION_TYPES.CLEAR_ALL }),
    setSearchQuery: (query) => dispatch({ type: ACTION_TYPES.SET_SEARCH_QUERY, payload: query }),
  };

  return { state, actions };
}
