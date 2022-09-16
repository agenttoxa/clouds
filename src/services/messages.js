import axios from 'axios';

export const getAllMessages = async () => {
  const messages = await axios.get('https://exit-exist.ru/congratulations/');
  return messages;
}

export const deleteMessage = async (id) => {
  const status = await axios.delete(`https://exit-exist.ru/congratulations/${id}`);
  return status;
}