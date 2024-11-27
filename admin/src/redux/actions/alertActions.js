// actions/alertActions.js
export const GLOBALTYPES = {
      ALERT: "ALERT",
    };
    
export const setAlert = (payload) => ({
type: GLOBALTYPES.ALERT,
payload,
});