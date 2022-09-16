import axios from 'axios';

export const getAllMessages = async () => {
  const messages = await axios.get('https://exit-exist.ru/congratulations/');
  return messages;
}