import { useEffect, useState, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaSearch, FaComment, FaInbox, FaUserCircle, FaRegSmile, FaPhone, FaVideo, FaCheck } from 'react-icons/fa';
import Avatar from '../components/Avatar';
import SEO from '../components/SEO';

function fmtTime(d) {
  const n = new Date();
  const s = d.toDateString() === n.toDateString();
  const y = new Date(n); y.setDate(y.getDate() - 1);
  if (s) return d.toLocaleTimeString('ar-AE', { hour: '2-digit', minute: '2-digit' });
  if (d.toDateString() === y.toDateString()) return 'أمس';
  return d.toLocaleDateString('ar-AE', { day: 'numeric', month: 'short' });
}

function dateBar(d) {
  const n = new Date();
  if (d.toDateString() === n.toDateString()) return 'اليوم';
  const y = new Date(n); y.setDate(y.getDate() - 1);
  if (d.toDateString() === y.toDateString()) return 'أمس';
  return d.toLocaleDateString('ar-AE', { weekday: 'long', month: 'long', day: 'numeric' });
}

function sepNeeded(msgs, i) {
  if (i === 0) return true;
  return new Date(msgs[i].createdAt).toDateString() !== new Date(msgs[i - 1].createdAt).toDateString();
}

export default function Chat() {
  const { user } = useAuth();
  const [convs, setConvs] = useState([]);
  const [active, setActive] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [unread, setUnread] = useState(0);
  const bottom = useRef(null);
  const poll = useRef(null);
  const inp = useRef(null);

  const fetchUnread = useCallback(async () => {
    try { const { data } = await axios.get('/api/chat/unread/count'); setUnread(data.count); } catch {}
  }, []);

  useEffect(() => {
    axios.get('/api/chat/conversations').then(r => setConvs(r.data)).catch(() => {}).finally(() => setLoading(false));
    fetchUnread();
  }, [fetchUnread]);

  useEffect(() => {
    if (!active) return;
    const oid = active.otherUser?._id || active._id;
    const fetch = async () => {
      try {
        const { data } = await axios.get(`/api/chat/${oid}`);
        setMsgs(data.messages || data || []);
        await axios.put(`/api/chat/${oid}/read`);
        fetchUnread();
      } catch {}
    };
    fetch();
    poll.current = setInterval(fetch, 3000);
    return () => clearInterval(poll.current);
  }, [active, fetchUnread]);

  useEffect(() => { bottom.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);
  useEffect(() => { if (active) setTimeout(() => bottom.current?.scrollIntoView({ behavior: 'smooth' }), 100); }, [active]);

  const send = async () => {
    if (!text.trim() || !active || sending) return;
    const oid = active.otherUser?._id || active._id;
    setMsgs(p => [...p, { sender: { _id: user?._id }, text: text.trim(), _temp: true, createdAt: new Date().toISOString() }]);
    setText('');
    setSending(true);
    try {
      await axios.post('/api/chat', { receiver: oid, text: text.trim() });
      const { data } = await axios.get(`/api/chat/${oid}`);
      setMsgs(data.messages || data || []);
    } catch {} finally { setSending(false); }
  };

  const filtered = convs.filter(c =>
    c.otherUser?.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.text?.toLowerCase().includes(search.toLowerCase())
  );

  const other = active?.otherUser;

  return (
    <div className="h-[calc(100vh-64px-72px)] lg:h-[calc(100vh-72px-72px)]">
      <SEO title="المحادثات" />
      <div className="flex h-full max-w-6xl mx-auto overflow-hidden bg-white">
        {/* Sidebar */}
        <div className={`${showSidebar ? 'w-full md:w-72' : 'w-0 md:w-72'} shrink-0 flex flex-col transition-all duration-300 overflow-hidden border-l border-gray-100`}>
          <div className="p-3 border-b border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-bold text-base text-gray-900">المحادثات</h2>
              {unread > 0 && <span className="text-[11px] bg-blue-500 text-white px-2 py-0.5 rounded-full font-bold">{unread}</span>}
            </div>
            <div className="relative">
              <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="ابحث..."
                className="w-full pr-9 pl-3 py-2 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition placeholder:text-gray-400"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-3 space-y-1">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="flex items-center gap-3 p-2.5 animate-pulse">
                    <div className="w-11 h-11 rounded-full bg-gray-200 shrink-0" />
                    <div className="flex-1 space-y-1.5"><div className="h-3 bg-gray-200 rounded w-2/3" /><div className="h-2.5 bg-gray-100 rounded w-1/2" /></div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4 py-12">
                <FaInbox className="text-3xl text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium text-sm">{search ? 'لا توجد نتائج' : 'لا توجد محادثات'}</p>
                <p className="text-gray-400 text-xs mt-1">{search ? 'حاول بكلمات أخرى' : 'تواصل مع مدرّس لبدء محادثة'}</p>
              </div>
            ) : (
              filtered.map((c, i) => {
                const act = active?._id === c._id;
                const o = c.otherUser;
                return (
                  <button
                    key={c._id}
                    onClick={() => { setActive(c); setShowSidebar(false); inp.current?.focus(); }}
                    className={`w-full text-right p-3 flex items-center gap-3 transition-all ${
                      act ? 'bg-blue-50' : 'hover:bg-gray-50'
                    } border-b border-gray-50 last:border-0`}
                  >
                    <Avatar name={o?.name} size="md" radius="full" className="shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`font-semibold text-sm truncate ${act ? 'text-blue-600' : 'text-gray-900'}`}>{o?.name || 'مستخدم'}</span>
                        <span className="text-[10px] text-gray-400 shrink-0">{c.createdAt ? fmtTime(new Date(c.createdAt)) : ''}</span>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{c.text || 'بداية المحادثة'}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat */}
        <div className="flex-1 flex flex-col min-w-0 bg-gray-50">
          <AnimatePresence mode="wait">
            {active ? (
              <motion.div key="c" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col min-h-0">
                {/* Header */}
                <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100 shadow-sm">
                  {!showSidebar && (
                    <button onClick={() => setShowSidebar(true)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition md:hidden">
                      <FaPaperPlane className="text-sm rotate-180" />
                    </button>
                  )}
                  <Avatar name={other?.name} size="sm" radius="full" className="shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900 truncate">{other?.name || 'مستخدم'}</p>
                    <p className="text-[11px] text-green-600 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />نشط الآن</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition"><FaPhone className="text-sm" /></button>
                    <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition"><FaVideo className="text-sm" /></button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-3">
                  {msgs.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <FaInbox className="text-3xl text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm font-medium">لا توجد رسائل</p>
                        <p className="text-gray-400 text-xs mt-0.5">أرسل أول رسالة الآن</p>
                      </div>
                    </div>
                  ) : (
                    msgs.map((msg, i) => {
                      const senderId = msg.sender?._id || msg.sender;
const mine = senderId === user?._id || msg._temp;
                      const sep = sepNeeded(msgs, i);
                      return (
                        <div key={i}>
                          {sep && (
                            <div className="flex justify-center my-2">
                              <span className="text-[10px] text-gray-400 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">
                                {dateBar(new Date(msg.createdAt))}
                              </span>
                            </div>
                          )}
                          <div className={`flex mb-1 ${mine ? 'justify-end' : 'justify-start'} items-end gap-1.5`}>
                            {!mine && (
                              <div className="shrink-0 mb-0.5">
                                <Avatar name={other?.name} size="xs" radius="full" className="opacity-0 md:opacity-100" />
                              </div>
                            )}
                            <div className={`max-w-[75%] md:max-w-[55%]`}>
                              <div className={`px-3.5 py-2 text-sm leading-relaxed ${
                                mine
                                  ? 'bg-blue-500 text-white rounded-2xl rounded-br-sm'
                                  : 'bg-white text-gray-800 rounded-2xl rounded-bl-sm border border-gray-100 shadow-sm'
                              }`}>
                                {msg.text}
                              </div>
                              <div className={`flex items-center gap-1 mt-0.5 px-1 ${mine ? 'justify-end' : 'justify-start'}`}>
                                <span className="text-[9px] text-gray-400">
                                  {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString('ar-AE', { hour: '2-digit', minute: '2-digit' }) : ''}
                                </span>
                                {mine && !msg._temp ? (
                                  <FaCheck className={`text-[9px] ${msg.read ? 'text-blue-400' : 'text-gray-300'}`} />
                                ) : mine && msg._temp ? (
                                  <span className="w-2 h-2 border-1.5 border-gray-300 border-t-transparent rounded-full animate-spin" />
                                ) : null}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={bottom} />
                </div>

                {/* Input */}
                <div className="px-3 py-2.5 bg-white border-t border-gray-100">
                  <div className="flex items-center gap-2 bg-gray-50 rounded-2xl px-3 py-1 border border-gray-100 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
                    <button className="p-1 text-gray-400 hover:text-blue-500 transition shrink-0"><FaRegSmile className="text-lg" /></button>
                    <input
                      ref={inp}
                      value={text}
                      onChange={e => setText(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                      placeholder={sending ? '...' : 'اكتب رسالتك...'}
                      className="flex-1 py-1.5 bg-transparent text-sm outline-none text-gray-700 placeholder:text-gray-400"
                    />
                    <button onClick={send} disabled={!text.trim() || sending}
                      className="p-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 shadow-sm">
                      {sending ? <span className="block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FaPaperPlane className="text-sm" />}
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="e" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex items-center justify-center">
                <div className="text-center px-6">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <FaComment className="text-blue-400 text-2xl" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">رسائلك</h3>
                  <p className="text-gray-400 text-sm">اختر محادثة من القائمة للبدء</p>
                  <a href="/tutors" className="inline-flex items-center gap-2 mt-4 px-5 py-2 bg-blue-500 text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition shadow-sm">
                    <FaUserCircle /> تصفح المدرّسين
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}