import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Send, Loader2, MessageSquare, UserPlus, Search } from "lucide-react";
import {
  subscribeToConversations,
  subscribeToMessages,
  sendMessage,
  getOrCreateConversation,
  getAllUsers,
} from "@/lib/firestore";
import { toast } from "sonner";

interface MessagesPageProps {
  variant: "instructor" | "student";
}

export default function MessagesPage({ variant }: MessagesPageProps) {
  const { user } = useAuth();

  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConv, setSelectedConv] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [sending, setSending] = useState(false);

  // New conversation modal
  const [showNewChat, setShowNewChat] = useState(false);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Subscribe to conversations
  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToConversations(user.id, (convs) => {
      setConversations(convs);
      setLoadingConvs(false);
    });
    return () => unsubscribe();
  }, [user]);

  // Subscribe to messages when conversation is selected
  useEffect(() => {
    if (!selectedConv) return;
    const unsubscribe = subscribeToMessages(selectedConv.id, (msgs) => {
      setMessages(msgs);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });
    return () => unsubscribe();
  }, [selectedConv?.id]);

  const handleSend = async () => {
    if (!newMessage.trim() || !user || !selectedConv) return;
    setSending(true);
    try {
      await sendMessage(selectedConv.id, user.id, user.name, newMessage.trim());
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const openNewChat = async () => {
    setShowNewChat(true);
    setLoadingUsers(true);
    try {
      const users = await getAllUsers();
      setAllUsers(users.filter((u: any) => u.id !== user?.id));
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const startConversationWith = async (otherUser: any) => {
    if (!user) return;
    try {
      const conv = await getOrCreateConversation(user.id, otherUser.id, otherUser.name, user.name);
      setSelectedConv(conv);
      setShowNewChat(false);
      setUserSearch("");
    } catch (error: any) {
      console.error("Failed to create conversation:", error);
      toast.error("Failed to start conversation. Check your connection.");
    }
  };

  const getOtherMemberName = (conv: any) => {
    if (!user || !conv.members) return "Unknown";
    const otherId = conv.memberIds?.find((id: string) => id !== user.id);
    return conv.members[otherId]?.name || "Unknown";
  };

  const getOtherMemberInitial = (conv: any) => {
    const name = getOtherMemberName(conv);
    return name.charAt(0).toUpperCase();
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "now";
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  const filteredUsers = allUsers.filter((u: any) =>
    u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email?.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <DashboardLayout title="Messages">
      <div className="h-[calc(100vh-8rem)] bg-card rounded-2xl border border-border shadow-card overflow-hidden flex">
        {/* Contacts Sidebar */}
        <div className="w-72 border-r border-border flex-shrink-0 hidden md:flex flex-col">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-foreground text-sm">Messages</h3>
            <button
              onClick={openNewChat}
              className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
              title="New conversation"
            >
              <UserPlus className="w-3.5 h-3.5" />
            </button>
          </div>

          {loadingConvs ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
              <MessageSquare className="w-8 h-8 text-muted-foreground/40 mb-2" />
              <p className="text-xs text-muted-foreground">No conversations yet</p>
              <button
                onClick={openNewChat}
                className="mt-2 text-xs text-primary hover:underline"
              >
                Start a new chat
              </button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto divide-y divide-border">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConv(conv)}
                  className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors ${selectedConv?.id === conv.id ? "bg-muted/30" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground flex-shrink-0">
                      {getOtherMemberInitial(conv)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground truncate">{getOtherMemberName(conv)}</p>
                        <span className="text-[10px] text-muted-foreground ml-1">{formatTime(conv.lastMessageAt)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{conv.lastMessage || "No messages yet"}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConv ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-border flex items-center gap-3">
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                  {getOtherMemberInitial(selectedConv)}
                </div>
                <span className="font-medium text-foreground text-sm">{getOtherMemberName(selectedConv)}</span>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center h-full">
                    <p className="text-sm text-muted-foreground">Send a message to start the conversation</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.senderId === user?.id;
                    return (
                      <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${isMe
                          ? "gradient-primary text-primary-foreground rounded-br-md"
                          : "bg-muted text-foreground rounded-bl-md"
                          }`}>
                          <p>{msg.text}</p>
                          <p className={`text-[10px] mt-1 ${isMe ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                            {formatTime(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all text-sm"
                />
                <button
                  onClick={handleSend}
                  disabled={sending || !newMessage.trim()}
                  className="px-4 py-2.5 rounded-xl gradient-primary text-primary-foreground hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Your Messages</h3>
              <p className="text-sm text-muted-foreground mb-4">Select a conversation or start a new one</p>
              <button
                onClick={openNewChat}
                className="px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all"
              >
                New Conversation
              </button>
            </div>
          )}
        </div>

        {/* New Chat Modal */}
        {showNewChat && (
          <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowNewChat(false)}>
            <div className="bg-card rounded-2xl border border-border shadow-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-foreground">New Conversation</h3>
                <p className="text-xs text-muted-foreground mt-1">Choose someone to message</p>
              </div>
              <div className="p-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search by name or email..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                  />
                </div>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-border">
                {loadingUsers ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="p-8 text-center text-sm text-muted-foreground">No users found</div>
                ) : (
                  filteredUsers.map((u: any) => (
                    <button
                      key={u.id}
                      onClick={() => startConversationWith(u)}
                      className="w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors flex items-center gap-3"
                    >
                      <div className="w-9 h-9 rounded-full gradient-accent flex items-center justify-center text-xs font-bold text-accent-foreground flex-shrink-0">
                        {u.name?.charAt(0) || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{u.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{u.email} · {u.role}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
              <div className="p-3 border-t border-border">
                <button
                  onClick={() => setShowNewChat(false)}
                  className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
