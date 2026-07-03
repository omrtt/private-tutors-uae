import { useState, useEffect, useRef } from 'react';
import { FaComment, FaTimes, FaPaperPlane } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function ChatBox({ tutorId, tutorName }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!open || !tutorId) return;
    setLoading(true);
    axios.get(`/api/chat/${tutorId}`)
      .then(({ data }) => setMessages(data.messages || data || []))
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, [open, tutorId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    const msg = { sender: user?._id, text: text.trim(), time: new Date().toLocaleTimeString('ar-AE', { hour: '2-digit', minute: '2-digit' }), _temp: true };
    setMessages(prev => [...prev, msg]);
    setText('');
    try {
      await axios.post('/api/chat', { receiver: tutorId, text: msg.text });
    } catch {
      // silently fail
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-primary-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-primary-500/30 hover:bg-primary-600 hover:scale-105 active:scale-95 transition-all"
        title={t('chatBox.chatButtonTitle')}
      >
        <FaComment className="text-xl" />
      </button>

      <div
        className={`fixed inset-0 bg-slate-900/30 z-50 transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setOpen(false)}
      />

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[380px] bg-white z-50 shadow-2xl transition-transform duration-300 flex flex-col ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-white">
          <div>
            <h3 className="font-bold text-slate-800">{t('chatBox.heading')}</h3>
            <p className="text-xs text-slate-500">{tutorName}</p>
          </div>
          <button onClick={() => setOpen(false)} className="p-2 rounded-lg hover:bg-slate-100 transition text-slate-500">
            <FaTimes />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading && <p className="text-center text-slate-400 text-sm">{t('chatBox.loading')}</p>}
          {!loading && messages.length === 0 && (
            <p className="text-center text-slate-400 text-sm">{t('chatBox.noMessages')}</p>
          )}
          {messages.map((msg, i) => {
            const isMine = msg.sender === user?._id || msg.sender === user?.name || msg._temp;
            return (
              <div key={i} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                <span className="text-xs text-slate-400 mb-0.5">{isMine ? 'أنت' : (tutorName || msg.sender)}</span>
                <div
                  className={`px-4 py-2.5 rounded-2xl max-w-[85%] text-sm leading-relaxed ${
                    isMine
                      ? 'bg-primary-500 text-white rounded-bl-md'
                      : 'bg-slate-100 text-slate-800 rounded-br-md'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5">{msg.time}</span>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-slate-200 p-3 flex gap-2">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('chatBox.typeMessage')}
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-50 transition"
          />
          <button
            onClick={sendMessage}
            disabled={!text.trim()}
            className="px-4 py-2.5 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </>
  );
}
