const Favorite = require('../models/Favorite');

exports.toggleFavorite = async (req, res) => {
  try {
    const { tutorId } = req.body;
    const existing = await Favorite.findOne({ student: req.user._id, tutor: tutorId });
    if (existing) {
      await Favorite.deleteOne({ _id: existing._id });
      return res.json({ favorited: false });
    }
    await Favorite.create({ student: req.user._id, tutor: tutorId });
    res.json({ favorited: true });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getMyFavorites = async (req, res) => {
  try {
    const favs = await Favorite.find({ student: req.user._id });
    res.json(favs.map((f) => f.tutor));
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.checkFavorite = async (req, res) => {
  try {
    const fav = await Favorite.findOne({ student: req.user._id, tutor: req.params.tutorId });
    res.json({ favorited: !!fav });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};
