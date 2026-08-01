import { useEffect, useRef, useState } from 'react';
import { Sparkles, X, Send, Loader2 } from 'lucide-react';
import client from '../api/client';

/**
 * A real chat widget backed by /api/ai/chat (Anthropic API, grounded in the
 * live FAQ/site content). Works for anonymous landing-page visitors and,
 * when mounted inside the authenticated app, automatically gets richer
 * context about the visitor's own company from the backend.
 */
export default function AiChatWidget({ quickPrompts = [], isOpen, onOpenChange }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isOpen !== undefined ? isOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm the TraceHub assistant. Ask me anything about depreciation, tracking, pricing, or how to get started." },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  const send = async (text) => {
    const trimmed = (text ?? input).trim();
    if (!trimmed || sending) return;
    const nextMessages = [...messages, { role: 'user', content: trimmed }];
    setMessages(nextMessages);
    setInput('');
    setSending(true);
    try {
      const { data } = await client.post('/ai/chat', {
        message: trimmed,
        history: nextMessages.slice(0, -1),
      });
      setMessages((m) => [...m, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setMessages((m) => [...m, {
        role: 'assistant',
        content: err.response?.data?.error || "Something went wrong on my end \u2014 please try again in a moment.",
      }]);
    } finally { setSending(false); }
  };

  return (
    <>
      {open ? (
        <div className="fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] max-w-sm h-[520px] max-h-[75vh] bg-white rounded-2xl shadow-2xl border border-ink/10 flex flex-col overflow-hidden">
          <div className="bg-primary-800 text-white px-4 py-3.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles size={17} className="text-accent" />
              <span className="font-semibold text-sm">TraceHub Assistant</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white"><X size={18} /></button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                  m.role === 'user' ? 'bg-primary text-white rounded-br-sm' : 'bg-primary-50 text-ink rounded-bl-sm'
                }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="bg-primary-50 rounded-2xl rounded-bl-sm px-3.5 py-2">
                  <Loader2 size={15} className="animate-spin text-primary" />
                </div>
              </div>
            )}
            {messages.length === 1 && quickPrompts.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {quickPrompts.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="text-xs font-medium text-primary bg-primary/10 hover:bg-primary/15 px-3 py-1.5 rounded-full transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            className="border-t border-ink/10 p-3 flex items-center gap-2 shrink-0"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 text-sm px-3 py-2 rounded-lg border border-ink/10 focus-ring focus:border-secondary"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="w-9 h-9 shrink-0 rounded-lg bg-primary text-white flex items-center justify-center disabled:opacity-40"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
          title="Ask the TraceHub assistant"
        >
          <Sparkles size={22} />
        </button>
      )}
    </>
  );
}
