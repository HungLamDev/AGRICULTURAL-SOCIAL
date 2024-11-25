const Report = require("../models/reportModel");

const reportController = {
  createReport: async (req, res) => {
    try {
      const newReport = new Report({ ...req.body, user: req.user });
      newReport.save();
      return res.status(200).json({
        newReport: {
          ...newReport._doc,
          user: req.user,
        },
        msg: "Tạo báo cáo mới thành công!",
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getReport: async (req, res) => {
    try {
        const report = await Report.find({ deleted_at: null }).populate("user");
        console.log(report);
        return res.status(200).json({ report });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
  },
  updateReport: async (req, res) => {
    try {
      const report = await Report.findByIdAndUpdate(req.params.id, req.body);
      return res.status(200).json({ report });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteReport: async (req, res) => {
    try {
        const reportId = req.params.id;

        const report = await Report.findById(reportId);
        if (!report) {
            return res.status(404).json({ msg: "Báo cáo không tồn tại!" });
        }

        report.deleted_at = new Date();
        await report.save();
        return res.json({ msg: "Xóa báo cáo thành công!" });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
  }
};
module.exports = reportController;
