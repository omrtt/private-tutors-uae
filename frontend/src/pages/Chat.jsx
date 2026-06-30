import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaSearch, FaEllipsisV, FaCheck, FaCheckDouble, FaArrowRight, FaComment } from 'react-icons/fa';
import Avatar from '../components/Avatar';
import SEO from '../components/SEO';

export default function Chat() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const bottomRef = useRef(null);
  const pollRef = useRef(null);

  useEffect(() => {
    axios.get('/api/chat/conversations').then((r) => setConversations(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!activeChat) return;
    const fetchMessages = () => {
      axios.get(`/api/chat/${activeChat.userId || activeChat._id}`).then((r) => {
        setMessages(r.data.messages || r.data || []);
      }).catch(() => {});
    };
    fetchMessages();
    pollRef.current = setInterval(fetchMessages, 3000);
    return () => clearInterval(pollRef.current);
  }, [activeChat]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async () => {
    if (!text.trim() || !activeChat) return;
    const msg = { sender: user?.name, text: text.trim(), time: new Date().toLocaleTimeString('ar-AE', { hour: '2-digit', minute: '2-digit' }), _temp: true };
    setMessages((prev) => [...prev, msg]);
    setText('');
    try {
      await axios.post('/api/chat', { tutorId: activeChat.userId || activeChat._id, text: msg.text });
    } catch {}
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  const filteredConvs = conversations.filter((c) =>
    c.tutor?.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.lastMessage?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="h-[calc(100vh-64px-72px)] lg:h-[calc(100vh-72px-72px)]">
      <SEO title="المراسلات" />
      <div className="flex h-full max-w-6xl mx-auto border-x border-slate-100 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
        <div className={`${sidebarOpen ? 'w-full md:w-80' : 'w-0 md:w-80'} shrink-0 border-l border-slate-100 dark:border-slate-800 flex flex-col transition-all duration-300 overflow-hidden`}>
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <h2 className="font-bold text-lg text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <FaComment className="text-primary-500 text-sm" /> المراسلات
            </h2>
            <div className="relative">
              <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input
                type="text"
                placeholder="بحث في المحادثات..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pr-9 pl-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20 transition placeholder:text-slate-400"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
                      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredConvs.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">لا توجد محادثات</div>
            ) : (
              filteredConvs.map((c) => {
                const isActive = activeChat?._id === c._id;
                return (
                  <button
                    key={c._id}
                    onClick={() => { setActiveChat(c); setSidebarOpen(false); }}
                    className={`w-full text-right p-3 flex items-center gap-3 transition hover:bg-slate-50 dark:hover:bg-slate-800/50 border-b border-slate-50 dark:border-slate-800/50 ${
                      isActive ? 'bg-primary-50 dark:bg-primary-500/10' : ''
                    }`}
                  >
                    <Avatar name={c.tutor?.user?.name} size="md" radius="full" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">{c.tutor?.user?.name}</span>
                        {c.lastTime && <span className="text-[10px] text-slate-400 shrink-0">{c.lastTime}</span>}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{c.lastMessage || 'بداية محادثة'}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          {activeChat ? (
            <>
              <div className="flex items-center gap-3 p-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                {!sidebarOpen && (
                  <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 md:hidden">
                    <FaArrowRight />
                  </button>
                )}
                <Avatar name={activeChat.tutor?.user?.name} size="sm" radius="full" />
                <div className="flex-1">
                  <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{activeChat.tutor?.user?.name}</p>
                  <p className="text-[11px] text-slate-400">متصل</p>
                </div>
                <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition">
                  <FaEllipsisV />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-50/50 dark:bg-slate-800/30"
                style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.02) 1px, transparent 0)', backgroundSize: '20px 20px' }}>
                {messages.length === 0 && (
                  <div className="text-center py-16">
                    <FaComment className="text-4xl text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm">لا توجد رسائل بعد</p>
                    <p className="text-slate-400 text-xs mt-1">أرسل أول رسالة لبدء المحادثة</p>
                  </div>
                )}
                {messages.map((msg, i) => {
                  const isMine = msg.sender === user?.name || msg.sender === 'أنت';
                  return (
                    <div key={i} className={`flex ${isMine ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-[75%] md:max-w-[60%] ${isMine ? 'order-2' : 'order-1'}`}>
                        <div
                          className={`px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                            isMine
                              ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-2xl rounded-br-md border border-slate-100 dark:border-slate-600'
                              : 'bg-primary-500 text-white rounded-2xl rounded-bl-md'
                          }`}
                        >
                          {msg.text}
                        </div>
                        <div className={`flex items-center gap-1 mt-0.5 ${isMine ? 'justify-start' : 'justify-end'} px-1`}>
                          <span className="text-[10px] text-slate-400">{msg.time || ''}</span>
                          {isMine && (msg._temp ? <FaCheck className="text-[10px] text-slate-400" /> : <FaCheckDouble className="text-[10px] text-primary-500" />)}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-2xl p-1.5 border border-slate-100 dark:border-slate-700">
                  <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="اكتب رسالة..."
                    className="flex-1 px-3 py-2 bg-transparent text-sm outline-none text-slate-700 dark:text-slate-300 placeholder:text-slate-400"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!text.trim()}
                    className="p-2.5 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
                  >
                    <FaPaperPlane className="text-sm" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-slate-50/50 dark:bg-slate-800/30">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <FaComment className="text-3xl text-primary-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-1">المراسلات</h3>
                <p className="text-sm text-slate-400 max-w-xs">اختر محادثة من القائمة لبدء المراسلة</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
