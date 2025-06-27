// mapReducer.js
export const initialState = {
    map: null,
    view: null,
    featurelayer:null
  };
  
  export function mapReducer(state, action) {
    switch (action.type) {
      case 'SET_MAP':
        return { ...state, map: action.payload };
      case 'SET_VIEW':
        return { ...state, view: action.payload };
      case 'SET_LAYER':
            return { ...state, featurelayer: action.payload };
      default:
        return state;
    }
  }
  