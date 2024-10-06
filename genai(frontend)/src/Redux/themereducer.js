const initialState = {
    theme: 'Emotions', 
  };
  
  export const themeReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_THEME':
        return {
          ...state,
          theme: action.payload,
        };
      default:
        return state;
    }
  };
  