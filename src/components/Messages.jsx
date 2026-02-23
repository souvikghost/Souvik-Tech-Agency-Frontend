import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getConversations, getContacts, getThread, sendMessage, deleteConversation } from "../api/messages";
import { getInitials, roleBadge, timeAgo } from "../utils/constants";
import useToast from "../hooks/useToast";
import { useAuth } from "../context/AuthContext";
import { svgPacket } from "../utils/svgPacket";

// --- Avatar ---
const Avatar = ({ user, size = "md" }) => {
  const sizeClass = size === "md" ? "w-10 h-10 text-sm" : "w-9 h-9 text-sm";
  return <div className={`${sizeClass} rounded-full bg-primary text-secondary font-bold flex items-center justify-center shrink-0 overflow-hidden`}>{user?.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : getInitials(user?.name || "?")}</div>;
};

// --- Confirm Delete Conversation Modal ---
const ConfirmDeleteConvoModal = ({ name, onConfirm, onCancel, isPending }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
    <div className="bg-secondary rounded-2xl w-full max-w-sm shadow-xl p-6 space-y-4">
      <h3 className="text-primary font-bold text-base">Delete Conversation</h3>
      <p className="text-primary/60 text-sm">
        Are you sure you want to delete your entire conversation with <span className="font-semibold text-primary">{name}</span>? This cannot be undone.
      </p>
      <div className="flex gap-3 justify-end">
        <button onClick={onCancel} className="px-4 py-2 text-sm font-semibold text-primary/60 hover:text-primary transition rounded-lg border border-primary/15">
          Cancel
        </button>
        <button onClick={onConfirm} disabled={isPending} className="px-4 py-2 text-sm font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50">
          {isPending ? "Deleting..." : "Yes, Delete"}
        </button>
      </div>
    </div>
  </div>
);

// --- New Conversation Modal ---
const NewConvoModal = ({ contacts, onClose, onSelect }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
    <div className="bg-secondary rounded-2xl w-full max-w-sm shadow-xl">
      <div className="px-6 py-4 border-b border-primary/8 flex items-center justify-between">
        <h3 className="text-primary font-bold text-base">New Message</h3>
        <button onClick={onClose} className="text-primary/60 hover:text-primary transition text-xl leading-none">
          ✕
        </button>
      </div>
      <div className="px-4 py-3 max-h-80 overflow-y-auto space-y-1">
        {contacts.length === 0 ? (
          <p className="text-primary/30 text-sm text-center py-6">No contacts available.</p>
        ) : (
          contacts.map((c) => (
            <button key={c._id} onClick={() => onSelect(c)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary/5 transition text-left">
              <Avatar user={c} size="sm" />
              <div>
                <p className="text-primary text-sm font-semibold">{c.name}</p>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${roleBadge[c.role]}`}>{c.role}</span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  </div>
);

// --- Conversation Item ---
const ConversationItem = ({ convo, isActive, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition rounded-xl ${isActive ? "bg-primary text-secondary" : "hover:bg-primary/5"}`}>
    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 overflow-hidden ${isActive ? "bg-white/20 text-white" : "bg-primary text-secondary"}`}>{convo.user?.avatar ? <img src={convo.user.avatar} alt={convo.user.name} className="w-full h-full object-cover" /> : getInitials(convo.user?.name || "?")}</div>
    <div className="flex-1 overflow-hidden">
      <div className="flex items-center justify-between gap-1">
        <p className={`text-sm font-semibold truncate ${isActive ? "text-white" : "text-primary"}`}>{convo.user.name}</p>
        <span className={`text-[10px] font-semibold shrink-0 ${isActive ? "text-white/60" : "text-primary/60"}`}>{timeAgo(convo.lastMessageAt)}</span>
      </div>
      <div className="flex items-center justify-between gap-1 mt-0.5">
        <p className={`text-xs font-semibold  truncate ${isActive ? "text-white/70" : "text-primary/50"}`}>{convo.lastMessage}</p>
        {convo.unread > 0 && <span className={`shrink-0 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center ${isActive ? "bg-white text-primary" : "bg-primary text-secondary"}`}>{convo.unread}</span>}
      </div>
    </div>
  </button>
);

// --- Message Bubble ---
const MessageBubble = ({ message, myId }) => {
  const senderId = message.sender?._id?.toString() || message.sender?.toString();
  const isMe = senderId === myId?.toString();
  const senderUser = message.sender;

  return (
    <div className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}>

      {/* Avatar — only for other person */}
      {!isMe && (
        <div className="w-7 h-7 rounded-full bg-primary text-secondary text-[10px] font-bold flex items-center justify-center shrink-0 overflow-hidden mb-4">
          {senderUser?.avatar
            ? <img src={senderUser.avatar} alt={senderUser.name} className="w-full h-full object-cover" />
            : getInitials(senderUser?.name || "?")}
        </div>
      )}

      <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}  max-w-[70%]`}>
        <div className={`px-4 py-3 rounded-2xl text-sm font-semibold  leading-relaxed ${
          isMe
            ? "bg-white border border-primary/10 text-primary  shadow-sm"
            : "bg-primary text-secondary "
        }`}>
          <p>{message.content}</p>
        </div>
        <p className="text-[10px] font-semibold mt-1 text-primary/40 px-1">
          {timeAgo(message.createdAt)}
        </p>
      </div>
    </div>
  );
};

// --- Empty State ---
const EmptyState = () => (
  <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center p-8">
    <div className="w-16 h-16 rounded-full bg-primary/6 flex items-center justify-center opacity-50 text-2xl">{svgPacket["selectChat"]}</div>
    <p className="text-primary/50 font-semibold text-sm">Select a conversation</p>
    <p className="text-primary/30 text-xs">Choose a contact from the left to start messaging</p>
  </div>
);

// --- Main ---
const Messages = () => {
  const { user } = useAuth();
  const { toast, ToastContainer } = useToast();
  const queryClient = useQueryClient();
  const bottomRef = useRef(null);

  const [activeUser, setActiveUser] = useState(null);
  const [input, setInput] = useState("");
  const [showNewConvo, setShowNewConvo] = useState(false);
  const [showDeleteConvo, setShowDeleteConvo] = useState(false);

  const { data: convosData, isLoading: convosLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
    refetchInterval: 10000,
  });

  const { data: contactsData } = useQuery({
    queryKey: ["contacts"],
    queryFn: getContacts,
  });

  const { data: threadData, isLoading: threadLoading } = useQuery({
    queryKey: ["thread", activeUser?._id],
    queryFn: () => getThread(activeUser._id),
    enabled: !!activeUser,
    refetchInterval: 5000,
  });

  const { mutate: send, isPending: sending } = useMutation({
    mutationFn: ({ receiver, content }) => sendMessage({ receiver, content }),
    onSuccess: () => {
      setInput("");
      queryClient.invalidateQueries(["thread", activeUser._id]);
      queryClient.invalidateQueries(["conversations"]);
    },
    onError: (err) => toast("error", err.message || "Failed to send message."),
  });

  const { mutate: delConvo, isPending: deletingConvo } = useMutation({
    mutationFn: (userId) => deleteConversation(userId),
    onSuccess: () => {
      queryClient.invalidateQueries(["conversations"]);
      queryClient.invalidateQueries(["thread", activeUser?._id]);
      setShowDeleteConvo(false);
      setActiveUser(null);
      toast("success", "Conversation deleted.");
    },
    onError: (err) => toast("error", err.message || "Failed to delete conversation."),
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [threadData]);

  const conversations = convosData || [];
  const contacts = contactsData || [];
  const messages = threadData || [];

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || !activeUser) return;
    send({ receiver: activeUser._id, content: input });
  };

  const handleSelectContact = (contact) => {
    setActiveUser(contact);
    setShowNewConvo(false);
    queryClient.invalidateQueries(["conversations"]);
  };

  const handleSelectConvo = (convo) => {
    if (activeUser?._id === convo.user._id) return; 
    setActiveUser(convo.user);
    queryClient.invalidateQueries(["conversations"]);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white border border-primary/8 rounded-2xl overflow-hidden">
      <ToastContainer />

      {/* Left — Conversation List */}
      <div className="w-72 shrink-0 flex flex-col border-r border-primary/8">
        <div className="px-4 py-4 border-b border-primary/8 flex items-center justify-between">
          <div>
            <h2 className="text-primary font-display text-lg font-bold">Messages</h2>
            <p className="text-primary/60 text-xs mt-0.5">Your conversations</p>
          </div>
          <button onClick={() => setShowNewConvo(true)} className="w-8 h-8 rounded-full bg-primary text-secondary flex items-center justify-center hover:bg-primary/80 transition" title="New message">
            {svgPacket["plusIcon"]}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {convosLoading ? (
            <p className="text-primary/30 text-xs text-center py-6">Loading...</p>
          ) : conversations.length === 0 ? (
            <p className="text-primary/30 text-xs text-center py-6">
              No conversations yet.
              <br />
              Click + to start one.
            </p>
          ) : (
            conversations.map((convo, i) => <ConversationItem key={convo.user._id || i} convo={convo} isActive={activeUser?._id === convo.user._id} onClick={() => handleSelectConvo(convo)} />)
          )}
        </div>
      </div>

      {/* Right — Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {activeUser ? (
          <>
            {/* Chat Header */}
            <div className="px-5 py-4 border-b border-primary/8 flex items-center gap-3 shrink-0">
              <Avatar user={activeUser} size="sm" />
              <div className="flex-1">
                <p className="text-primary font-semibold text-sm">{activeUser.name}</p>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${roleBadge[activeUser.role]}`}>{activeUser.role}</span>
              </div>
              {/* Delete conversation */}
              <button onClick={() => setShowDeleteConvo(true)} className="w-8 h-8 rounded-full hover:bg-red-50 text-primary/30 hover:text-red-400 transition flex items-center justify-center" title="Delete conversation">
                {svgPacket["deleteIcon"]}
              </button>
              {/* Close */}
              <button onClick={() => setActiveUser(null)} className="w-8 h-8 rounded-full hover:bg-primary/8 text-primary/40 hover:text-primary transition flex items-center justify-center text-lg leading-none">
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {threadLoading ? <p className="text-primary/30 text-xs text-center mt-10">Loading messages...</p> : messages.length === 0 ? <p className="text-primary/30 text-xs text-center mt-10">No messages yet. Say hello!</p> : messages.map((msg) => <MessageBubble key={msg._id} message={msg} myId={user?._id} />)}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="px-4 py-3 border-t border-primary/8 flex items-center gap-2 shrink-0">
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." className="flex-1 px-4 py-2.5 rounded-xl border border-primary/15 bg-secondary text-primary text-sm font-semibold placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition" />
              <button type="submit" disabled={!input.trim() || sending} className="px-4 py-2.5 bg-primary text-secondary text-sm font-semibold rounded-xl transition hover:bg-primary/90 disabled:opacity-40 shrink-0">
                {sending ? "..." : "Send"}
              </button>
            </form>
          </>
        ) : (
          <EmptyState />
        )}
      </div>

      {/* Modals */}
      {showNewConvo && <NewConvoModal contacts={contacts} onClose={() => setShowNewConvo(false)} onSelect={handleSelectContact} />}

      {showDeleteConvo && <ConfirmDeleteConvoModal name={activeUser?.name} isPending={deletingConvo} onConfirm={() => delConvo(activeUser._id)} onCancel={() => setShowDeleteConvo(false)} />}
    </div>
  );
};

export default Messages;
