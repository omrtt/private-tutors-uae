const Institute = require('../models/Institute');

exports.getAllInstitutes = async (req, res) => {
  try {
    const { emirate, test, subject, search, limit } = req.query;
    let institutes = await Institute.find({ isActive: true, approved: true });

    if (emirate) {
      institutes = institutes.filter((i) =>
        i.emirates?.some((e) => e.toLowerCase().includes(emirate.toLowerCase()))
      );
    }
    if (test) {
      institutes = institutes.filter((i) =>
        i.tests?.some((t) => t.toLowerCase().includes(test.toLowerCase()))
      );
    }
    if (subject) {
      institutes = institutes.filter((i) =>
        i.subjects?.some((s) => s.toLowerCase().includes(subject.toLowerCase()))
      );
    }
    if (search) {
      const q = search.toLowerCase();
      institutes = institutes.filter(
        (i) =>
          i.name?.toLowerCase().includes(q) ||
          i.description?.toLowerCase().includes(q)
      );
    }

    if (limit) {
      institutes = institutes.slice(0, parseInt(limit));
    }

    res.json(institutes);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getInstituteById = async (req, res) => {
  try {
    const institute = await Institute.findById(req.params.id);
    if (!institute) return res.status(404).json({ message: 'Institute not found' });
    res.json(institute);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.createInstitute = async (req, res) => {
  try {
    const data = { ...req.body, isActive: true, createdAt: new Date().toISOString() };
    const institute = await Institute.create(data);
    res.status(201).json(institute);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateInstitute = async (req, res) => {
  try {
    const institute = await Institute.update(req.params.id, req.body);
    if (!institute) return res.status(404).json({ message: 'Institute not found' });
    res.json(institute);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteInstitute = async (req, res) => {
  try {
    await Institute.deleteOne(req.params.id);
    res.json({ message: 'Institute deleted' });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};
