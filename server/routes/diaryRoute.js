const router = require("express").Router();
const diaryController = require("../controllers/diaryController");
const auth = require("../middleware/auth");
router.get("/diary/:id", auth, diaryController.getDiaryById);

router.get("/diary", auth, diaryController.getDiaries);

router.get("/diary/g/:id", auth, diaryController.getDiary);

router.get(
  "/diary/getSaveDiaries/result",
  auth,
  diaryController.getSaveDiaries
);

router.post("/diary", auth, diaryController.createDiary);

router.put("/diary/:id", auth, diaryController.updateDiary);

router.delete("/diary/:id", auth, diaryController.deleteDiary);

router.put("/diary/saveDiary/:id", auth, diaryController.saveDiary);

router.put("/diary/unSaveDiary/:id", auth, diaryController.unSaveDiary);

module.exports = router;
