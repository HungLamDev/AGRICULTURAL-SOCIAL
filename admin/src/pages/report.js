import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { REPORTS_LOADING, getReports } from "../redux/actions/reportAction";
import ReportInfor from "../component/report/ReportInfor";

const Report = () => {
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth);
  const reports = useSelector((state) => state.reports.reports);
  const loadingReport = useSelector((state) => state.reports.loadingReport);

  const [filteredReports, setFilteredReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleFilter = (event) => {
    const filterValue = event.target.value.toLowerCase();
    const filtered = reports.filter((report) =>
      (report._id && report._id.toLowerCase().includes(filterValue)) ||
      (report.user?.username && report.user.username.toLowerCase().includes(filterValue)) ||
      (report.type && report.type.toLowerCase().includes(filterValue)) ||
      (report.text && report.text.toLowerCase().includes(filterValue))
    );
    setFilteredReports(filtered);
    setCurrentPage(1); // Reset to first page after filtering
  };

  const handleGetReport = (item) => {
    dispatch({ type: REPORTS_LOADING.LOADING_REPORT, payload: true });
    dispatch({ type: REPORTS_LOADING.GET_REPORT, payload: item });
  };

  useEffect(() => {
    if (reports.length === 0) dispatch(getReports({ auth }));
  }, [reports.length, dispatch, auth]);

  useEffect(() => {
    setFilteredReports(reports);
  }, [reports]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  return (
    <div className="report">
      {loadingReport && <ReportInfor />}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Tìm kiếm..."
          onChange={handleFilter}
        />
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>UserReport</th>
            <th>Type</th>
            <th>Related</th>
            <th>Desc</th>
            <th>Create</th>
            <th>Update</th>
            <th>Check</th>
            <th>Act</th>
          </tr>
        </thead>
        <tbody>
          {currentReports.map((item) => (
            <tr key={item._id}>
              <td>{item.user?.username}</td>
              <td>{item.type}</td>
              <td>{item.related}</td>
              <td>{item.text}</td>
              <td>{new Date(item.createdAt).toLocaleString()}</td>
              <td>{new Date(item.updatedAt).toLocaleString()}</td>
              <td>{item.act}</td>
              <td onClick={() => handleGetReport(item)}>Xem</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Report;
