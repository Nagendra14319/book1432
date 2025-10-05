const API_BASE_URL = 'https://book143.onrender.com/api';

const getHeaders = (token?: string | null) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

export const api = {
  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Login failed');
    }

    return res.json();
  },

  async signup(username: string, email: string, password: string) {
    const res = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ username, email, password }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Signup failed');
    }

    return res.json();
  },

  async getBooks(page = 1, limit = 12) {
    const res = await fetch(`${API_BASE_URL}/books?page=${page}&limit=${limit}`);

    if (!res.ok) {
      throw new Error('Failed to fetch books');
    }

    return res.json();
  },

  async getBook(id: string) {
    const res = await fetch(`${API_BASE_URL}/books/${id}`);

    if (!res.ok) {
      throw new Error('Failed to fetch book');
    }

    return res.json();
  },

  async createBook(token: string, bookData: any) {
    const res = await fetch(`${API_BASE_URL}/books`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(bookData),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to create book');
    }

    return res.json();
  },

  async updateBook(token: string, id: string, bookData: any) {
    const res = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(bookData),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to update book');
    }

    return res.json();
  },

  async deleteBook(token: string, id: string) {
    const res = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to delete book');
    }

    return res.json();
  },

  async createReview(token: string, reviewData: any) {
    const res = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(reviewData),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to create review');
    }

    return res.json();
  },

  async updateReview(token: string, id: string, reviewData: any) {
    const res = await fetch(`${API_BASE_URL}/reviews/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(reviewData),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to update review');
    }

    return res.json();
  },

  async deleteReview(token: string, id: string) {
    const res = await fetch(`${API_BASE_URL}/reviews/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to delete review');
    }

    return res.json();
  },

  async getProfile(token: string) {
    const res = await fetch(`${API_BASE_URL}/profile`, {
      headers: getHeaders(token),
    });

    if (!res.ok) {
      throw new Error('Failed to fetch profile');
    }

    return res.json();
  },
};
