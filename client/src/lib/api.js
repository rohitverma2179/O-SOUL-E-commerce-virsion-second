export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://osoul-backend.vercel.app/api').replace(/\/$/, '');

export const fetchCatalog = async (resource) => {
  const response = await fetch(`${API_BASE_URL}/${resource}`, { credentials: 'include' });
  if (!response.ok) throw new Error(`Could not load ${resource}`);
  const payload = await response.json();
  return payload.data || [];
};
