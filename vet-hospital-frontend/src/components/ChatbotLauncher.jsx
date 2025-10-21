import { MessageCircle } from 'lucide-react';

/**
 * Floating action button to open the chatbot.
 *
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onToggle
 */
export function ChatbotLauncher({ isOpen, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 text-white rounded-full shadow-2xl hover:bg-blue-700 transition-all transform hover:scale-110 flex items-center justify-center z-50"
      aria-label={isOpen ? 'Close chatbot' : 'Open chatbot'}
    >
      <MessageCircle className="w-8 h-8" />
    </button>
  );
}

export default ChatbotLauncher;
