import { useReducer, useMemo } from "react";

const initialState = {
  orders: [{ id: 1, name: "Order 1", items: [], customer: null }],
  activeOrderId: 1,
  searchQuery: "",
  selectedCategory: "all",
};

const ACTION_TYPES = {
  SET_ACTIVE_ORDER: "SET_ACTIVE_ORDER",
  ADD_ORDER: "ADD_ORDER",
  DELETE_ORDER: "DELETE_ORDER",
  SET_CUSTOMER: "SET_CUSTOMER",
  ADD_ITEM: "ADD_ITEM",
  UPDATE_ITEM: "UPDATE_ITEM",
  REMOVE_ITEM: "REMOVE_ITEM",
  CLEAR_ORDER: "CLEAR_ORDER",
  INCREMENT_ITEM: "INCREMENT_ITEM",
  DECREMENT_ITEM: "DECREMENT_ITEM",
  SET_SEARCH_QUERY: "SET_SEARCH_QUERY",
  SET_CATEGORY: "SET_CATEGORY",
};

const mockCustomers = [
  { id: "1", name: "Walk-in Customer", phone: "" },
  { id: "2", name: "Ahmed Khan", phone: "03001234567" },
  { id: "3", name: "Sara Ali", phone: "03019876543" },
  { id: "4", name: "Bilal Hussain", phone: "03005678901" },
  { id: "5", name: "Fatima Zahra", phone: "03001112223" },
];

function cardViewReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.SET_ACTIVE_ORDER:
      return { ...state, activeOrderId: action.payload };

    case ACTION_TYPES.ADD_ORDER: {
      const newOrderId = Math.max(...state.orders.map((o) => o.id), 0) + 1;
      return {
        ...state,
        orders: [
          ...state.orders,
          {
            id: newOrderId,
            name: `Order ${newOrderId}`,
            items: [],
            customer: mockCustomers[0],
          },
        ],
        activeOrderId: newOrderId,
      };
    }

    case ACTION_TYPES.DELETE_ORDER: {
      if (state.orders.length <= 1) return state;
      const updatedOrders = state.orders.filter((o) => o.id !== action.payload);
      return {
        ...state,
        orders: updatedOrders,
        activeOrderId:
          state.activeOrderId === action.payload
            ? updatedOrders[0].id
            : state.activeOrderId,
      };
    }

    case ACTION_TYPES.SET_CUSTOMER: {
      const { orderId, customerId } = action.payload;
      const customer = mockCustomers.find((c) => c.id === customerId);
      if (!customer) return state;
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.id === orderId ? { ...order, customer } : order,
        ),
      };
    }

    case ACTION_TYPES.ADD_ITEM: {
      const { orderId, product } = action.payload;
      return {
        ...state,
        orders: state.orders.map((order) => {
          if (order.id !== orderId) return order;

          const existingItem = order.items.find(
            (item) => item.productId === product.id,
          );
          if (existingItem) {
            return {
              ...order,
              items: order.items.map((item) =>
                item.productId === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              ),
            };
          }

          return {
            ...order,
            items: [
              ...order.items,
              {
                id: Date.now() + Math.random(),
                productId: product.id,
                name: product.name,
                sku: product.sku,
                price: product.price,
                taxRate: product.taxRate,
                quantity: 1,
                image: product.image,
              },
            ],
          };
        }),
      };
    }

    case ACTION_TYPES.UPDATE_ITEM: {
      const { orderId, itemId, field, value } = action.payload;
      return {
        ...state,
        orders: state.orders.map((order) => {
          if (order.id !== orderId) return order;
          return {
            ...order,
            items: order.items.map((item) =>
              item.id === itemId ? { ...item, [field]: value } : item,
            ),
          };
        }),
      };
    }

    case ACTION_TYPES.REMOVE_ITEM: {
      const { orderId, itemId } = action.payload;
      return {
        ...state,
        orders: state.orders.map((order) => {
          if (order.id !== orderId) return order;
          return {
            ...order,
            items: order.items.filter((item) => item.id !== itemId),
          };
        }),
      };
    }

    case ACTION_TYPES.CLEAR_ORDER: {
      const orderId = action.payload;
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.id === orderId ? { ...order, items: [] } : order,
        ),
      };
    }

    case ACTION_TYPES.INCREMENT_ITEM: {
      const { orderId, itemId } = action.payload;
      return {
        ...state,
        orders: state.orders.map((order) => {
          if (order.id !== orderId) return order;
          return {
            ...order,
            items: order.items.map((item) =>
              item.id === itemId
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            ),
          };
        }),
      };
    }

    case ACTION_TYPES.DECREMENT_ITEM: {
      const { orderId, itemId } = action.payload;
      return {
        ...state,
        orders: state.orders.map((order) => {
          if (order.id !== orderId) return order;
          return {
            ...order,
            items: order.items.map((item) =>
              item.id === itemId
                ? { ...item, quantity: Math.max(1, item.quantity - 1) }
                : item,
            ),
          };
        }),
      };
    }

    case ACTION_TYPES.SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };

    case ACTION_TYPES.SET_CATEGORY:
      return { ...state, selectedCategory: action.payload };

    default:
      return state;
  }
}

const parseNumber = (val) => {
  const n = parseFloat(val);
  return Number.isFinite(n) ? n : 0;
};

export const calculateOrderTotals = (orderItems) => {
  let subTotal = 0;
  let taxTotal = 0;

  orderItems.forEach((item) => {
    const qty = parseNumber(item.quantity);
    const price = parseNumber(item.price);
    const taxRate = parseNumber(item.taxRate || 18);
    const lineBase = qty * price;
    const lineTax = (lineBase * taxRate) / 100;
    subTotal += lineBase;
    taxTotal += lineTax;
  });

  return { subTotal, taxTotal, grandTotal: subTotal + taxTotal };
};

export function useCardViewReducer() {
  const [state, dispatch] = useReducer(cardViewReducer, initialState);

  const activeOrder = useMemo(
    () =>
      state.orders.find((o) => o.id === state.activeOrderId) || state.orders[0],
    [state.orders, state.activeOrderId],
  );

  const actions = {
    setActiveOrder: (orderId) =>
      dispatch({ type: ACTION_TYPES.SET_ACTIVE_ORDER, payload: orderId }),
    addOrder: () => dispatch({ type: ACTION_TYPES.ADD_ORDER }),
    deleteOrder: (orderId) =>
      dispatch({ type: ACTION_TYPES.DELETE_ORDER, payload: orderId }),
    setCustomer: (customerId) =>
      dispatch({
        type: ACTION_TYPES.SET_CUSTOMER,
        payload: { orderId: state.activeOrderId, customerId },
      }),
    addItem: (product) =>
      dispatch({
        type: ACTION_TYPES.ADD_ITEM,
        payload: { orderId: state.activeOrderId, product },
      }),
    updateItem: (itemId, field, value) =>
      dispatch({
        type: ACTION_TYPES.UPDATE_ITEM,
        payload: { orderId: state.activeOrderId, itemId, field, value },
      }),
    removeItem: (itemId) =>
      dispatch({
        type: ACTION_TYPES.REMOVE_ITEM,
        payload: { orderId: state.activeOrderId, itemId },
      }),
    clearOrder: () =>
      dispatch({
        type: ACTION_TYPES.CLEAR_ORDER,
        payload: state.activeOrderId,
      }),
    incrementItem: (itemId) =>
      dispatch({
        type: ACTION_TYPES.INCREMENT_ITEM,
        payload: { orderId: state.activeOrderId, itemId },
      }),
    decrementItem: (itemId) =>
      dispatch({
        type: ACTION_TYPES.DECREMENT_ITEM,
        payload: { orderId: state.activeOrderId, itemId },
      }),
    setSearchQuery: (query) =>
      dispatch({ type: ACTION_TYPES.SET_SEARCH_QUERY, payload: query }),
    setCategory: (category) =>
      dispatch({ type: ACTION_TYPES.SET_CATEGORY, payload: category }),
  };

  return { state, activeOrder, actions };
}
