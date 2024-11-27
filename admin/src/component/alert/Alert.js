import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setAlert } from "../../redux/actions/alertActions";
import Loading from "./Loading";
import Toast from "./Toast";

const Alert = () => {
  const notify = useSelector((state) => state.notify);
  const dispatch = useDispatch();

  const handleCloseToast = () => {
    dispatch(setAlert({ success: "", error: "" }));
  };

  return (
    <div>
      {notify.loading && <Loading />}
      {notify.error && (
        <Toast
          msg={{ title: "Error", body: notify.error }}
          handleShow={handleCloseToast}
          bgColor="bg-danger"
        />
      )}

      {notify.success && (
        <Toast
          msg={{ title: "Success", body: notify.success }}
          handleShow={handleCloseToast}
          bgColor="bg-success"
        />
      )}
    </div>
  );
};

export default Alert;
