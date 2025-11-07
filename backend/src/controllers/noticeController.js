const Notice = require('../models/Notice');

const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ error: 'Notice not found' });
    res.json(notice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createNotice = async (req, res) => {
  try {
    const { title, description, department, type, date } = req.body;
    const attachments = req.files ? req.files.map(file => ({
      filename: file.originalname,
      path: file.path,
      mimetype: file.mimetype,
    })) : [];
    const notice = new Notice({ title, description, department, type, date, attachments });
    await notice.save();
    req.io.emit('notice:created', notice);
    res.status(201).json(notice);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateNotice = async (req, res) => {
  try {
    const { title, description, department, type, date } = req.body;
    const attachments = req.files ? req.files.map(file => ({
      filename: file.originalname,
      path: file.path,
      mimetype: file.mimetype,
    })) : [];
    const notice = await Notice.findByIdAndUpdate(req.params.id, { title, description, department, type, date, attachments }, { new: true });
    if (!notice) return res.status(404).json({ error: 'Notice not found' });
    req.io.emit('notice:updated', notice);
    res.json(notice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) return res.status(404).json({ error: 'Notice not found' });
    req.io.emit('notice:deleted', notice._id);
    res.json({ message: 'Notice deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getNotices, getNotice, createNotice, updateNotice, deleteNotice };
