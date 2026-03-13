import { useState, useEffect, useRef } from 'react';
import { Send, User, MessageSquare } from 'lucide-react';
import { userService, messageService } from '../services/api';

export default function Messages() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  
  const currentUserId = parseInt(localStorage.getItem('userId'), 10);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchConversation(selectedUser.id);
    }
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const allUsers = await userService.getAllUsers();
      // Filter out the current user from the contact list
      setUsers(allUsers.filter(u => u.id !== currentUserId));
    } catch (error) {
      console.error("Failed to load contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConversation = async (contactId) => {
    try {
      const chat = await messageService.getConversation(currentUserId, contactId);
      setMessages(chat || []);
    } catch (error) {
      console.error("Failed to load chat:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;
    
    try {
      const payload = {
        senderId: currentUserId,
        receiverId: selectedUser.id,
        content: newMessage
      };
      
      const sentMsg = await messageService.sendMessage(payload);
      setMessages(prev => [...prev, sentMsg]);
      setNewMessage('');
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#fbfbfd] pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden flex h-[700px] animate-in fade-in zoom-in-95 duration-500">
        
        {/* Contacts Sidebar */}
        <div className="w-1/3 border-r border-gray-100 bg-gray-50/30 flex flex-col">
          <div className="p-6 border-b border-gray-100 bg-white">
            <h2 className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-600" /> Messages
            </h2>
            <p className="text-sm text-gray-500 mt-1">Select a user to chat</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-6 text-center text-sm text-gray-500">Loading contacts...</div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {users.map(user => (
                  <li 
                    key={user.id} 
                    onClick={() => setSelectedUser(user)}
                    className={`p-4 cursor-pointer hover:bg-indigo-50/50 transition-colors flex items-center gap-3
                      ${selectedUser?.id === user.id ? 'bg-indigo-50 border-l-4 border-indigo-500' : 'border-l-4 border-transparent'}`}
                  >
                    <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">{user.name}</h3>
                      <p className="text-xs text-gray-500">{user.role}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{selectedUser.name}</h3>
                  <p className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                    {selectedUser.role}
                  </p>
                </div>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <MessageSquare className="w-12 h-12 mb-2 opacity-20" />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const isMine = msg.sender.id === currentUserId;
                    return (
                      <div key={idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] rounded-2xl px-5 py-3 ${
                          isMine 
                            ? 'bg-indigo-600 text-white rounded-br-sm shadow-sm' 
                            : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm shadow-sm'
                        }`}>
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                          <p className={`text-[10px] mt-1 text-right ${isMine ? 'text-indigo-200' : 'text-gray-400'}`}>
                            {formatTime(msg.timestamp)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 bg-white border-t border-gray-100">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 rounded-full border-gray-200 bg-gray-50 px-6 py-3 text-sm focus:border-indigo-500 focus:ring-indigo-500 focus:bg-white transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="h-12 w-12 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-indigo-200"
                  >
                    <Send className="w-5 h-5 ml-1" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50">
              <User className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg font-medium text-gray-500">Select a contact to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
