const Post = require('../models/Post');
const Tutor = require('../models/Tutor');
const { Collection } = require('../db/jsonDb');

exports.createPost = async (req, res) => {
  try {
    const tutor = await Tutor.findOne({ user: req.user._id });
    if (!tutor) return res.status(400).json({ message: 'You must be a tutor to post' });

    const { content, media } = req.body;
    const post = await Post.create({
      tutor: req.user._id,
      content,
      media: media || [],
      likes: [],
      comments: [],
      isPinned: false,
    });
    const populated = Collection.ref('users', post, 'tutor', ['password']);
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFeed = async (req, res) => {
  try {
    let posts = await Post.find({});
    posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const populated = Collection.ref('users', posts, 'tutor', ['password']);
    const tutors = await Tutor.find({});
    const tutorMap = {};
    tutors.forEach((t) => { tutorMap[t.user] = t; });
    const withProfiles = populated.map((p) => ({
      ...p,
      tutorProfile: tutorMap[p.tutor?._id] || null,
    }));
    res.json(withProfiles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyPosts = async (req, res) => {
  try {
    let posts = await Post.find({ tutor: req.user._id });
    posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const populated = Collection.ref('users', posts, 'tutor', ['password']);
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTutorPosts = async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.id);
    const userId = tutor ? tutor.user : req.params.id;
    let posts = await Post.find({ tutor: userId });
    posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const populated = Collection.ref('users', posts, 'tutor', ['password']);
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.tutor !== req.user._id) return res.status(403).json({ message: 'Not authorized' });
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const idx = post.likes.indexOf(req.user._id);
    if (idx > -1) {
      post.likes.splice(idx, 1);
    } else {
      post.likes.push(req.user._id);
    }
    const updated = await Post.findOneAndUpdate({ _id: req.params.id }, { likes: post.likes });
    const populated = Collection.ref('users', updated, 'tutor', ['password']);
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = {
      _id: require('crypto').randomBytes(12).toString('hex'),
      user: req.user._id,
      text: req.body.text,
      createdAt: new Date().toISOString(),
    };
    post.comments.push(comment);
    const updated = await Post.findOneAndUpdate({ _id: req.params.id }, { comments: post.comments });
    const populated = Collection.ref('users', updated, 'tutor', ['password']);
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = post.comments.find((c) => c._id === req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.user !== req.user._id && post.tutor !== req.user._id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    post.comments = post.comments.filter((c) => c._id !== req.params.commentId);
    const updated = await Post.findOneAndUpdate({ _id: req.params.id }, { comments: post.comments });
    const populated = Collection.ref('users', updated, 'tutor', ['password']);
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};