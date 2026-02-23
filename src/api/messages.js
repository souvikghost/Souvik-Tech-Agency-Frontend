import { delAPI, getAPI, postAPI } from "../lib/api";

export const getConversations = () => getAPI("/messages/conversations");
export const getContacts      = () => getAPI("/messages/contacts");
export const getThread        = (userId) => getAPI(`/messages/${userId}`);
export const sendMessage      = (body) => postAPI("/messages", body);
export const deleteMessage    = (messageId) => delAPI(`/messages/${messageId}`);
export const deleteConversation = (userId) => delAPI(`/messages/conversation/${userId}`);