import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaRegHeart, FaComment, FaTrash, FaPaperPlane, FaImage, FaEllipsisH, FaShare, FaGraduationCap, FaStar } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';
import Avatar from '../components/Avatar';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'الآن';
  if (mins < 60) return `منذ ${mins} د`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `منذ ${hours} س`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `منذ ${days} ي`;
  return new Date(dateStr).toLocaleDateString('ar-AE', { day: 'numeric', month: 'short' });
}

export default function Feed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [newPostMedia, setNewPostMedia] = useState('');
  const [posting, setPosting] = useState(false);
  const [commentTexts, setCommentTexts] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const fileInputRef = useRef(null);

  const loadFeed = async () => {
    try {
      const res = await axios.get('/api/posts/feed');
      setPosts(res.data);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { loadFeed(); }, []);

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;
    setPosting(true);
    try {
      const res = await axios.post('/api/posts', { content: newPost, media: newPostMedia ? [newPostMedia] : [] });
      setPosts([res.data, ...posts]);
      setNewPost('');
      setNewPostMedia('');
    } catch {} finally { setPosting(false); }
  };

  const handleLike = async (postId) => {
    try {
      const res = await axios.post(`/api/posts/${postId}/like`);
      setPosts(posts.map((p) => (p._id === postId ? res.data : p)));
    } catch {}
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`/api/posts/${postId}`);
      setPosts(posts.filter((p) => p._id !== postId));
    } catch {}
  };

  const handleComment = async (postId) => {
    const text = commentTexts[postId];
    if (!text?.trim()) return;
    try {
      const res = await axios.post(`/api/posts/${postId}/comments`, { text });
      setPosts(posts.map((p) => (p._id === postId ? res.data : p)));
      setCommentTexts({ ...commentTexts, [postId]: '' });
    } catch {}
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container">
      <SEO title="المنشورات" />
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="section-title">المنشورات</h1>
          <p className="text-slate-500 dark:text-slate-400">آخر أخبار المدرّسين والطلاب</p>
        </div>

        {user?.role === 'tutor' && (
          <motion.div initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="card p-4 mb-6">
            <div className="flex items-start gap-3">
              <Avatar user={user} size="sm" />
              <div className="flex-1">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="ما الجديد؟ شارك منشوراً مع طلابك..."
                  rows={2}
                  className="input-field resize-none text-sm"
                />
                {newPostMedia && (
                  <div className="mt-2 relative">
                    <img src={newPostMedia} alt="" className="w-full h-32 object-cover rounded-xl" onError={(e) => { e.target.style.display = 'none'; }} />
                    <button onClick={() => setNewPostMedia('')} className="absolute top-2 left-2 w-6 h-6 bg-black/40 text-white rounded-full text-xs">X</button>
                  </div>
                )}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => fileInputRef.current?.click()} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition" title="إضافة صورة">
                      <FaImage />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="text"
                      value={newPostMedia}
                      onChange={(e) => setNewPostMedia(e.target.value)}
                      placeholder="رابط صورة..."
                      className="text-xs border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 bg-transparent w-40 text-slate-500"
                    />
                  </div>
                  <button onClick={handleCreatePost} disabled={!newPost.trim() || posting} className="btn-primary !py-1.5 !px-4 text-sm flex items-center gap-1.5">
                    {posting ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FaPaperPlane />}
                    نشر
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {loading ? (
          <div className="space-y-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-4 animate-pulse">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700" />
                  <div className="flex-1"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32 mb-1" /><div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-20" /></div>
                </div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-3" />
                <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-xl mb-3" />
                <div className="flex gap-4"><div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-16" /><div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-16" /></div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="card p-12 text-center">
            <FaGraduationCap className="text-5xl text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="font-bold text-slate-500 dark:text-slate-400 mb-1">لا توجد منشورات بعد</p>
            <p className="text-sm text-slate-400">كن أول من يشارك!</p>
          </div>
        ) : (
          <div className="space-y-5">
            <AnimatePresence>
              {posts.map((post, i) => {
                const tutor = post.tutor;
                const profile = post.tutorProfile;
                const isLiked = user && post.likes?.includes(user._id);
                const comments = post.comments || [];
                const showAllComments = expandedComments[post._id];

                return (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: i * 0.03 }}
                    layout
                    className="card overflow-hidden"
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <Link to={`/tutors/${profile?._id || '#'}`} className="flex items-center gap-3 group">
                          <Avatar user={tutor} size="sm" />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-primary-500 transition">{tutor?.name}</p>
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                              <span>{profile?.emirate}</span>
                              {profile?.rating && (
                                <span className="flex items-center gap-0.5 text-yellow-500"><FaStar className="text-[10px]" />{profile.rating.toFixed(1)}</span>
                              )}
                              <span>•</span>
                              <span>{timeAgo(post.createdAt)}</span>
                            </div>
                          </div>
                        </Link>
                        {user?._id === tutor?._id && (
                          <button onClick={() => handleDelete(post._id)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-red-500 transition">
                            <FaTrash className="text-xs" />
                          </button>
                        )}
                      </div>

                      <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-3 whitespace-pre-wrap">{post.content}</p>

                      {post.media?.length > 0 && (
                        <div className="mb-3 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                          <img src={post.media[0]} alt="" className="w-full max-h-96 object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                        </div>
                      )}

                      <div className="flex items-center gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <button onClick={() => handleLike(post._id)} className={`flex items-center gap-1.5 text-sm font-semibold transition ${isLiked ? 'text-red-500' : 'text-slate-400 hover:text-red-400'}`}>
                          {isLiked ? <FaHeart className="text-sm" /> : <FaRegHeart className="text-sm" />}
                          <span>{post.likes?.length || 0}</span>
                        </button>
                        <button onClick={() => setExpandedComments({ ...expandedComments, [post._id]: !showAllComments })} className="flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-primary-500 transition">
                          <FaComment className="text-sm" />
                          <span>{comments.length}</span>
                        </button>
                        <button className="flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-primary-500 transition">
                          <FaShare className="text-xs" />
                        </button>
                      </div>
                    </div>

                    {showAllComments && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                        <div className="p-4 space-y-3">
                          {comments.length === 0 ? (
                            <p className="text-xs text-slate-400 text-center">لا توجد تعليقات بعد</p>
                          ) : (
                            comments.map((c) => (
                              <div key={c._id} className="flex items-start gap-2">
                                <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-[10px] font-bold text-primary-600 shrink-0">
                                  {c.userName?.[0] || 'م'}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="bg-white dark:bg-slate-800 rounded-xl px-3 py-2 border border-slate-100 dark:border-slate-700">
                                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-0.5">{c.userName || 'مستخدم'}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{c.text}</p>
                                  </div>
                                  <p className="text-[10px] text-slate-400 mt-0.5 px-1">{timeAgo(c.createdAt)}</p>
                                </div>
                              </div>
                            ))
                          )}
                          {user && (
                            <div className="flex items-center gap-2 pt-1">
                              <input
                                value={commentTexts[post._id] || ''}
                                onChange={(e) => setCommentTexts({ ...commentTexts, [post._id]: e.target.value })}
                                onKeyDown={(e) => e.key === 'Enter' && handleComment(post._id)}
                                placeholder="اكتب تعليقاً..."
                                className="flex-1 input-field !py-1.5 !px-3 text-sm"
                              />
                              <button onClick={() => handleComment(post._id)} className="p-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition text-xs">
                                <FaPaperPlane />
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}