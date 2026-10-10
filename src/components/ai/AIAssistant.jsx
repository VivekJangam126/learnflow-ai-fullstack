import { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';
import { aiService } from '../../services/aiService';

export const AIAssistant = ({ plan, tasks }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const quickActions = [
    "What should I do today?",
    "Summarize this week",
    "Help me understand this topic",
    "Suggest a catch-up plan"
  ];

  const handleSend = async (text = message) => {
    if (!text.trim()) return;

    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setLoading(true);

    try {
      const context = {
        plan: {
          title: plan.title,
          totalWeeks: plan.totalWeeks,
          settings: plan.settings
        },
        tasks: tasks.map(t => ({
          title: t.title,
          status: t.status,
          type: t.type,
          estMinutes: t.estMinutes
        }))
      };

      const response = await aiService.chatWithAI(text, context);
      const aiMessage = { role: 'assistant', content: response.message };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4 pb-4 border-b">
        <Sparkles className="w-5 h-5 text-primary-600" />
        <h3 className="text-lg font-bold text-gray-900">AI Assistant</h3>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-3 min-h-[300px] max-h-[400px]">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Sparkles className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Ask me anything about your learning plan!</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-primary-100 text-primary-900 ml-8'
                  : 'bg-gray-100 text-gray-900 mr-8'
              }`}
            >
              {msg.content}
            </div>
          ))
        )}
        {loading && (
          <div className="flex items-center gap-2 text-gray-500">
            <div className="animate-pulse">Thinking...</div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(action)}
              disabled={loading}
              className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50"
            >
              {action}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything..."
            disabled={loading}
            className="input-field flex-1"
          />
          <Button onClick={() => handleSend()} disabled={loading || !message.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
