const LevelTest = require('../models/LevelTest');
const Record = require('../models/AcademicRecord');

exports.getTests = async (req, res) => {
  try {
    const tests = await LevelTest.find({});
    const summary = tests.map((t) => ({ _id: t._id, subject: t.subject, questionCount: t.questions.length }));
    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getTestBySubject = async (req, res) => {
  try {
    const test = await LevelTest.findOne({ subject: req.params.subject });
    if (!test) return res.status(404).json({ message: 'Test not found for this subject' });
    const safe = { ...test, questions: test.questions.map((q) => ({ id: q.id, question: q.question, options: q.options })) };
    res.json(safe);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.submitTest = async (req, res) => {
  try {
    const { subject, answers } = req.body;
    const test = await LevelTest.findOne({ subject });
    if (!test) return res.status(404).json({ message: 'Test not found' });

    let score = 0;
    test.questions.forEach((q) => {
      if (answers[q.id] === q.correct) score++;
    });

    const total = test.questions.length;
    const percent = Math.round((score / total) * 100);
    let level = 'مبتدئ';
    if (percent >= 70) level = 'متقدم';
    else if (percent >= 40) level = 'متوسط';

    await Record.create({
      student: req.user._id,
      subject: `${subject} - تحديد مستوى (${level})`,
      grade: score,
      maxGrade: total,
      notes: `المستوى: ${level} - النتيجة: ${percent}%`,
    });

    res.json({ score, total, percent, level, subject });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};
