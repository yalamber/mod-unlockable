export const initialState = {
  isConnected: false,
};

export const AppReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'INIT_STORED': {
      return action.value;
    }
    case 'SET_CONNECTED': {
      return {
        ...state,
        isConnected: action.value,
      };
    }
  }
};
