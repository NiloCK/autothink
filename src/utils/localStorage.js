const API_KEY_STORAGE_KEY = "autothink_api_key";
const CHAT_HISTORY_KEY = "autothink_chat_history";

// API Key storage
export const saveApiKey = (apiKey) => {
  localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
};

export const getApiKey = () => {
  return localStorage.getItem(API_KEY_STORAGE_KEY);
};

export const clearApiKey = () => {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
};

// Chat history storage
export const saveChatHistory = (chatId, messages) => {
  const allChats = getChatList();
  if (!allChats.includes(chatId)) {
    saveChatList([...allChats, chatId]);
  }

  localStorage.setItem(
    `${CHAT_HISTORY_KEY}_${chatId}`,
    JSON.stringify(messages),
  );
};

export const getChatHistory = (chatId) => {
  const data = localStorage.getItem(`${CHAT_HISTORY_KEY}_${chatId}`);
  return data ? JSON.parse(data) : [];
};

export const saveChatList = (chatIds) => {
  localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(chatIds));
};

export const getChatList = () => {
  const data = localStorage.getItem(CHAT_HISTORY_KEY);
  return data ? JSON.parse(data) : [];
};

export const deleteChatHistory = (chatId) => {
  localStorage.removeItem(`${CHAT_HISTORY_KEY}_${chatId}`);

  const allChats = getChatList();
  saveChatList(allChats.filter((id) => id !== chatId));
};
