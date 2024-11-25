import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { GLOBALTYPES } from "../../redux/actions/globalTyle";
import Loading from "../Loading";
import Toast from "./Toast";
const Alert = () => {
  const notify = useSelector((state) => state.notify);
  if (notify.success) {
    console.log("Đang render Toast:", notify.success);
  }
  const dispatch = useDispatch();
  return (
    <div>
      {notify.loading && <Loading />}
      {notify.error && (
        <Toast
          msg={{ title: "error", body: notify.error }}
          handleShow={() => dispatch({ type: GLOBALTYPES.NOTIFY, payload: {} })}
          bgColor="bg-danger"
        />
      )}

      {notify.success && (
        <Toast
          msg={{ title: "success", body: notify.success }}
          handleShow={() => dispatch({ type: GLOBALTYPES.NOTIFY, payload: {} })}
          bgColor="bg-success"
        />
      )}
    </div>
  );
};

export default Alert;
