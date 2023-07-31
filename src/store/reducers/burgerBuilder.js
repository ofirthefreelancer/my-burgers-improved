import * as actionTypes from "../actions/actionTypes";

const initialState = {
  ingredient: null,
  totalPrice: 4,
  error: false,
  building: false,
};

const IngredientPrices = {
  salad: 0.5,
  bacon: 1.5,
  cheese: 0.4,
  meat: 1.2,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_PRICE:
      return {
        ...state,
        totalPrice: action.price,
      };
    case actionTypes.CHANGE_INGS:
      return {
        ...state,
        ingredient: {
          ...action.ings,
        },
      };

    case actionTypes.ADD_INGREDIENT:
      return {
        ...state,
        ingredient: {
          ...state.ingredient,
          [action.ingredientName]: state.ingredient[action.ingredientName] + 1,
        },
        totalPrice: state.totalPrice + IngredientPrices[action.ingredientName],
        building: true,
      };
    case actionTypes.REMOVE_INGREDIENT:
      return {
        ...state,
        ingredient: {
          ...state.ingredient,
          [action.ingredientName]: state.ingredient[action.ingredientName] - 1,
        },
        totalPrice: state.totalPrice - IngredientPrices[action.ingredientName],
        building: true,
      };
    case actionTypes.SET_INGREDIENT: {
      return {
        ...state,
        ingredient: {
          salad: action.ingredients.salad,
          bacon: action.ingredients.bacon,
          cheese: action.ingredients.cheese,
          meat: action.ingredients.meat,
        },
        error: false,
        totalPrice: 4,
        building: false,
      };
    }
    case actionTypes.FETCH_INGREDIENT_FAILED: {
      return {
        ...state,
        error: true,
      };
    }
    default:
      return state;
  }
};

export default reducer;
