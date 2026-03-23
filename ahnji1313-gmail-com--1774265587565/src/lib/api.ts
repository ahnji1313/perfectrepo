```jsx
// apiClient.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://your-news-website.com/api',
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      // token refresh logic
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        apiClient
          .post('/token/refresh', { refreshToken })
          .then((response) => {
            const newToken = response.data.token;
            localStorage.setItem('token', newToken);
            error.config.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(error.config);
          })
          .catch((error) => {
            // handle token refresh error
          });
      } else {
        // handle token refresh error
      }
    } else if (error.response.status === 500) {
      // retry logic
      const retryCount = error.config.retryCount || 0;
      if (retryCount < 3) {
        error.config.retryCount = retryCount + 1;
        return apiClient(error.config);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

```jsx
// useNews.js
import { useQuery, useMutation, useQueryClient } from 'react-query';
import apiClient from './apiClient';

const useNews = () => {
  const { data, error, isLoading } = useQuery(
    'news',
    async () => {
      const response = await apiClient.get('/news');
      return response.data;
    },
    {
      staleTime: 10000,
    }
  );

  const queryClient = useQueryClient();

  const createNews = useMutation(
    async (news) => {
      const response = await apiClient.post('/news', news);
      return response.data;
    },
    {
      onSuccess: (newNews) => {
        queryClient.setQueryData('news', (oldNews) => [...oldNews, newNews]);
      },
    }
  );

  const updateNews = useMutation(
    async (news) => {
      const response = await apiClient.put(`/news/${news.id}`, news);
      return response.data;
    },
    {
      onSuccess: (updatedNews) => {
        queryClient.setQueryData('news', (oldNews) =>
          oldNews.map((news) => (news.id === updatedNews.id ? updatedNews : news))
        );
      },
    }
  );

  const deleteNews = useMutation(
    async (id) => {
      const response = await apiClient.delete(`/news/${id}`);
      return response.data;
    },
    {
      onSuccess: (id) => {
        queryClient.setQueryData('news', (oldNews) =>
          oldNews.filter((news) => news.id !== id)
        );
      },
    }
  );

  return { data, error, isLoading, createNews, updateNews, deleteNews };
};

export default useNews;
```

```jsx
// useUser.js
import { useState, useEffect } from 'react';
import apiClient from './apiClient';

const useUser = () => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      apiClient
        .get('/user')
        .then((response) => {
          setUser(response.data);
          setIsLoggedIn(true);
        })
        .catch((error) => {
          // handle error
        });
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiClient.post('/login', { email, password });
      const token = response.data.token;
      const refreshToken = response.data.refreshToken;
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      setIsLoggedIn(true);
      setUser(response.data.user);
    } catch (error) {
      // handle error
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setIsLoggedIn(false);
      setUser(null);
    } catch (error) {
      // handle error
    }
  };

  return { user, isLoggedIn, login, logout };
};

export default useUser;
```

```jsx
// NewsPage.js
import React, { useState } from 'react';
import useNews from './useNews';
import useUser from './useUser';

const NewsPage = () => {
  const { data, error, isLoading, createNews, updateNews, deleteNews } = useNews();
  const { user, isLoggedIn } = useUser();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleCreateNews = async () => {
    try {
      const newNews = { title, content };
      await createNews.mutate(newNews);
      setTitle('');
      setContent('');
    } catch (error) {
      // handle error
    }
  };

  const handleUpdateNews = async (id) => {
    try {
      const updatedNews = { title, content };
      await updateNews.mutate(updatedNews);
    } catch (error) {
      // handle error
    }
  };

  const handleDeleteNews = async (id) => {
    try {
      await deleteNews.mutate(id);
    } catch (error) {
      // handle error
    }
  };

  return (
    <div>
      {isLoggedIn && user.email === 'ahnji1313@gmail.com' && (
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
          />
          <button onClick={handleCreateNews}>Create News</button>
        </div>
      )}
      {data.map((news) => (
        <div key={news.id}>
          <h2>{news.title}</h2>
          <p>{news.content}</p>
          {isLoggedIn && user.email === 'ahnji1313@gmail.com' && (
            <div>
              <button onClick={() => handleUpdateNews(news.id)}>Update</button>
              <button onClick={() => handleDeleteNews(news.id)}>Delete</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default NewsPage;
```

```jsx
// WebSocket.js
import { useState, useEffect } from 'react';

const useWebSocket = () => {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const ws = new WebSocket('ws://your-news-website.com/ws');
    setConnection(ws);

    ws.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    ws.onclose = () => {
      setConnection(null);
    };

    ws.onerror = (error) => {
      console.error(error);
    };
  }, []);

  const sendMessage = (message) => {
    if (connection) {
      connection.send(message);
    }
  };

  return { messages, sendMessage };
};

export default useWebSocket;
```

```jsx
// App.js
import React from 'react';
import NewsPage from './NewsPage';
import useUser from './useUser';
import useWebSocket from './useWebSocket';

const App = () => {
  const { user, isLoggedIn } = useUser();
  const { messages, sendMessage } = useWebSocket();

  if (!isLoggedIn) {
    return <div>You must be logged in to access this page.</div>;
  }

  return (
    <div>
      <NewsPage />
      <div>
        <h2>Messages:</h2>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
        <input
          type="text"
          placeholder="Send a message"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sendMessage(e.target.value);
              e.target.value = '';
            }
          }}
        />
      </div>
    </div>
  );
};

export default App;
```

```jsx
// store.js
import { createStore, useStore } from 'zustand';

const useStore = createStore((set) => ({
  user: null,
  isLoggedIn: false,
  news: [],
  messages: [],

  login: (user) =>
    set((state) => ({
      user,
      isLoggedIn: true,
    })),

  logout: () =>
    set((state) => ({
      user: null,
      isLoggedIn: false,
    })),

  addNews: (news) =>
    set((state) => ({
      news: [...state.news, news],
    })),

  updateNews: (news) =>
    set((state) => ({
      news: state.news.map((n) => (n.id === news.id ? news : n)),
    })),

  deleteNews: (id) =>
    set((state) => ({
      news: state.news.filter((n) => n.id !== id),
    })),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
}));

export default useStore;
```

```jsx
// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import useStore from './store';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
```