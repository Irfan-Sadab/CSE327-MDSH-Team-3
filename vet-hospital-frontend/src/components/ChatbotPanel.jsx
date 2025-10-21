import { Send, X } from 'lucide-react';
import { useState } from 'react';

/**
 * Floating chatbot container.
 *
 * @param {object} props
 * @param {boolean} props.visible
 * @param {() => void} props.onClose
 * @param {{ id: string, sender: 'bot' | 'user', text: string, timestamp: number }[]} props.messages
 * @param {(message: string) => void} props.onSend
 * @param {boolean} props.sending
 */
export function ChatbotPanel({ visible, onClose, messages = [], onSend, sending }) {
  const [draft, setDraft] = useState('');

  if (!visible) return null;

  return (
    <div className="fixed bottom-28 right-8 w-96 h-[500px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col">
      <div className="bg-blue-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
        <h3 className="font-bold text-lg">PawCare Assistant</h3>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200"
          aria-label="Close chatbot"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 max-w-[80%] rounded-lg px-4 py-3 shadow ${
              message.sender === 'user'
                ? 'ml-auto bg-blue-600 text-white'
                : 'bg-white text-gray-800'
            }`}
          >
            <p>{message.text}</p>
          </div>
        ))}
      </div>

      <div className="p-4 border-t">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (!draft.trim()) return;
            onSend?.(draft.trim());
            setDraft('');
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
          />
          <button
            type="submit"
            disabled={sending}
            className="h-12 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Send className="w-5 h-5" />
            <span className="hidden sm:inline">{sending ? 'Sending…' : 'Send'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatbotPanel;
