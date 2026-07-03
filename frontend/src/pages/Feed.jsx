import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaRegHeart, FaComment, FaTrash, FaPaperPlane, FaImage, FaShare, FaStar, FaCheckCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';
import Avatar from '../components/Avatar';
import EmptyState from '../components/EmptyState';
import Breadcrumbs from '../components/Breadcrumbs';

export default function Feed() {
  const { t } = useTranslation();
  const { user } = useAuth();

  function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return t('feed.timeAgo.now');
    if (mins < 60) return t('feed.timeAgo.min', { n: mins });
    const hours = Math.floor(mins / 60);
    if (hours < 24) return t('feed.timeAgo.hour', { n: hours });
    const days = Math.floor(hours / 24);
    if (days < 7) return t('feed.timeAgo.day', { n: days });
    return new Date(dateStr).toLocaleDateString('ar-AE', { day: 'numeric', month: 'short' });
  }
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
      <SEO title={t('feed.pageTitle')} />
      <div className="max-w-2xl mx-auto">
        <Breadcrumbs items={[{ label: t('feed.heading') }]} />
        <div className="text-center mb-8">
          <h1 className="section-title">{t('feed.heading')}</h1>
          <p className="text-slate-500 dark:text-slate-400">{t('feed.subtitle')}</p>
        </div>

        {user?.role === 'tutor' && (
          <motion.div initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="card p-4 mb-6">
            <div className="flex items-start gap-3">
              <Avatar name={user?.name} size="sm" />
              <div className="flex-1">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder={t('feed.postPlaceholder')}
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
                    <button onClick={() => fileInputRef.current?.click()} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition" title={t('feed.addImageTooltip')}>
                      <FaImage />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="text"
                      value={newPostMedia}
                      onChange={(e) => setNewPostMedia(e.target.value)}
                      placeholder={t('feed.imageUrlPlaceholder')}
                      className="text-xs border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 bg-transparent w-40 text-slate-500"
                    />
                  </div>
                  <button onClick={handleCreatePost} disabled={!newPost.trim() || posting} className="btn-primary !py-1.5 !px-4 text-sm flex items-center gap-1.5">
                    {posting ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FaPaperPlane />}
                    {t('feed.postButton')}
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
          <EmptyState illustration="tutors" title={t('feed.emptyTitle')} description={t('feed.emptySubtitle')} />
        ) : (
          <div className="space-y-5">
            <AnimatePresence>
              {posts.map((post, i) => {
                const tutor = post.user;
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
                    <div className="p-4 pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <Link to={`/tutors/${profile?._id || '#'}`} className="flex items-center gap-3 group">
                          <Avatar name={tutor?.name} size="md" radius="full" />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-primary-500 transition">{tutor?.name}</p>
                              {tutor?.role === 'tutor' && <FaCheckCircle className="text-primary-500 text-[10px]" />}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                              <span>{profile?.area ? `${profile.emirate} - ${profile.area}` : profile?.emirate || t('feed.tutor')}</span>
                              {profile?.rating > 0 && (
                                <span className="flex items-center gap-0.5 text-yellow-500 font-medium"><FaStar className="text-[10px]" />{profile.rating.toFixed(1)}</span>
                              )}
                              <span>•</span>
                              <span>{timeAgo(post.createdAt)}</span>
                            </div>
                          </div>
                        </Link>
                        {user?._id === tutor?._id && (
                          <button onClick={() => handleDelete(post._id)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-red-500 transition" title={t('feed.deletePost')}>
                            <FaTrash className="text-xs" />
                          </button>
                        )}
                      </div>

                      <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-3 whitespace-pre-wrap">{post.content}</p>

                      {post.media?.length > 0 && (
                        <div className="mb-3 -mx-4 rounded-none overflow-hidden bg-slate-50 dark:bg-slate-800">
                          <img src={post.media[0]} alt="" className="w-full max-h-96 object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                        </div>
                      )}

                      <div className="flex items-center gap-1 pt-1">
                        <button onClick={() => handleLike(post._id)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${isLiked
                          ? 'text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30'
                          : 'text-slate-400 hover:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                        }`}>
                          {isLiked ? <FaHeart className="text-sm scale-110" /> : <FaRegHeart className="text-sm" />}
                          <span>{post.likes?.length || 0}</span>
                        </button>
                        <button onClick={() => setExpandedComments({ ...expandedComments, [post._id]: !showAllComments })} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${showAllComments
                          ? 'text-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'text-slate-400 hover:text-primary-500 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                        }`}>
                          <FaComment className="text-sm" />
                          <span>{comments.length}</span>
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:text-primary-500 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-150">
                          <FaShare className="text-xs" />
                        </button>
                      </div>
                    </div>

                    {showAllComments && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                        <div className="p-4 space-y-3">
                          {comments.length === 0 ? (
                            <p className="text-xs text-slate-400 text-center">{t('feed.noComments')}</p>
                          ) : (
                            comments.map((c) => (
                              <div key={c._id} className="flex items-start gap-2">
                                <Avatar name={c.userName} size="xs" radius="full" />
                                <div className="flex-1 min-w-0">
                                  <div className="bg-white dark:bg-slate-800 rounded-xl px-3 py-2 border border-slate-100 dark:border-slate-700">
                                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-0.5">{c.userName || t('feed.unknownUser')}</p>
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
                                placeholder={t('feed.commentPlaceholder')}
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