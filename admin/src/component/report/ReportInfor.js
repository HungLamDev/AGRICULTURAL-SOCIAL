import React, { useState } from "react";
import {
  REPORTS_LOADING,
  updateReports,
  deleteReport,
} from "../../redux/actions/reportAction";
import { useDispatch, useSelector } from "react-redux";
import ConfirmDeleteModal from "../ConfirmDeleteModal";

const ReportInfor = () => {
  const report = useSelector((state) => state.reports.report);
  const auth = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const initialState = {
    id: report._id,
    desc: report.act,
  };

  const [reportData, setReportData] = useState(initialState);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const handleChangeValue = (e) => {
    const { name, value } = e.target;
    setReportData({ ...reportData, [name]: value });
  };

  const handleClose = () => {
    dispatch({ type: REPORTS_LOADING.LOADING_REPORT, payload: false });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateReports({ reportData, auth }));
  };

  const handleOpenDeleteModal = () => setOpenDeleteModal(true);
  const handleCloseDeleteModal = () => setOpenDeleteModal(false);

  // Hàm xác nhận xóa
  const handleConfirmDelete = () => {
    dispatch(deleteReport({ reportData, auth }));
    setOpenDeleteModal(false);
    window.location.reload();
  };
  return (
    <div className="post_infor">
      <div className="post_infor_container">
        <div className="infor_title_post">
          <h5>Chi tiết báo cáo</h5>
          <span onClick={() => handleClose()}>&times;</span>
        </div>
        <table>
          <tbody>
            <tr>
              <th>ID</th>
              <td>{report._id}</td>
            </tr>
            <tr>
              <th>UserReport</th>
              <td>{report.user.username}</td>
            </tr>
            <tr>
              <th>Related</th>
              <td>{report.related}</td>
            </tr>
            <tr>
              <th>Desc</th>
              <td>{report.text}</td>
            </tr>
            <tr>
              <th>Type</th>
              <td>{report.type}</td>
            </tr>
            <tr>
              <th>Create</th>
              <td>{new Date(report.createdAt).toLocaleString()}</td>
            </tr>
            <tr>
              <th>Update Act</th>
              <td>{new Date(report.updatedAt).toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
        <form onSubmit={handleSubmit} className="pt-4">
          <label htmlFor="descTextInput" className="form-label">
            Act !
          </label>
          <textarea
            col={30}
            rows={4}
            type="text"
            id="descTextInput"
            className="form-control"
            value={reportData.desc}
            onChange={handleChangeValue}
            name="desc"
          />
          <div className="d-flex justify-content-end mt-2">
            <button className="btn btn-success me-2" type="submit">
              Cập nhật
            </button>
            <button className="btn btn-danger" onClick={handleOpenDeleteModal}>
              Xoá
            </button>
          </div>
        </form>
        <ConfirmDeleteModal
          open={openDeleteModal}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          title="Xóa người dùng"
          content="Bạn có chắc chắn muốn xóa báo cáo này?"
        />
      </div>
    </div>
  );
};

export default ReportInfor;
