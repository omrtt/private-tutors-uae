const AcademicRecord = require('../models/AcademicRecord');
const { Collection } = require('../db/jsonDb');

exports.getMyRecords = async (req, res) => {
  try {
    let records = await AcademicRecord.find({ student: req.user._id });
    records.reverse();
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createRecord = async (req, res) => {
  try {
    const { subject, grade, maxGrade, notes } = req.body;
    const record = await AcademicRecord.create({
      student: req.user._id,
      subject,
      grade: Number(grade),
      maxGrade: Number(maxGrade) || 100,
      notes,
    });
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateRecord = async (req, res) => {
  try {
    const { subject, grade, maxGrade, notes } = req.body;
    const record = await AcademicRecord.findOneAndUpdate(
      { _id: req.params.id, student: req.user._id },
      { subject, grade: Number(grade), maxGrade: Number(maxGrade), notes }
    );
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteRecord = async (req, res) => {
  try {
    const record = await AcademicRecord.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json({ message: 'Record deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};