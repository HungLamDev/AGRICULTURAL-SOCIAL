import React from "react";
import Avatar from "../Avatar";
import { useSelector, useDispatch } from "react-redux";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";

const Status = () => {
  const auth = useSelector((state) => state.auth);
  const theme = useSelector((state) => state.theme);

  const dispatch = useDispatch();
  return (
    <div className="status my-3 d-flex">
      <Avatar src={auth.user.avatar} size="big-avatar" theme={theme} />

      <button
        className="statusBtn flex-fill"
        onClick={() => dispatch({ type: GLOBALTYPES.STATUS, payload: true })}
      >
        {auth.user.username} ơi , bạn đang nghĩ gì thế?
      </button>
    </div>
  );
};

export default Status;
