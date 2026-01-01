import axios from 'axios';

const BASE_URL = (() => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) throw new Error('NEXT_PUBLIC_API_URL must be set');
  return url;
})();

const api = axios.create({
  baseURL: BASE_URL,
});

export { api };