const express = require('express');
const { getNotices, getNotice, createNotice, updateNotice, deleteNotice } = require('../controllers/noticeController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/multerUpload');
const router = express.Router();

router.get('/', getNotices);
router.get('/:id', getNotice);
router.post('/', authMiddleware, upload.array('attachments'), createNotice);
router.put('/:id', authMiddleware, upload.array('attachments'), updateNotice);
router.delete('/:id', authMiddleware, deleteNotice);

module.exports = router;
