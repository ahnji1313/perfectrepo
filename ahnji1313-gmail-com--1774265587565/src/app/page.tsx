```typescript
// components/Layout.tsx
import React from 'react';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  const pathname = usePathname();

  return (
    <ErrorBoundary
      fallbackRender={({ error }) => (
        <div role="alert" className="text-red-500">
          {error.message}
        </div>
      )}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </Suspense>
    </ErrorBoundary>
  );
};

export default Layout;
```

```typescript
// components/Header.tsx
import React from 'react';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';

const Header = () => {
  const { data: session, status } = useSession();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode !== null) {
      setDarkMode(storedDarkMode === 'true');
    }
  }, []);

  const handleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', String(!darkMode));
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (session && session.user.email === 'ahnji1313@gmail.com') {
    return (
      <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/">
            <a>2-4반 news</a>
          </Link>
          <button
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md"
            onClick={handleDarkMode}
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md"
            onClick={() => signOut()}
          >
            Logout
          </button>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <a>2-4반 news</a>
        </Link>
        <button
          className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md"
          onClick={() => signIn()}
        >
          Login
        </button>
      </div>
    </nav>
  );
};

export default Header;
```

```typescript
// components/Footer.tsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-4">
      <div className="container mx-auto text-center">
        &copy; 2024 2-4반 news
      </div>
    </footer>
  );
};

export default Footer;
```

```typescript
// pages/_app.tsx
import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { AppRouter } from 'next/navigation';
import Layout from '../components/Layout';
import '../styles/globals.css';
import '../styles/tailwind.css';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}

export default MyApp;
```

```typescript
// pages/index.tsx
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useQuery, useQueryClient } from 'react-query';
import { fetchNews } from '../lib/api';
import NewsList from '../components/NewsList';
import LoadingSkeleton from '../components/LoadingSkeleton';

const HomePage = () => {
  const { data: session } = useSession();
  const [news, setNews] = useState([]);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery(
    'news',
    async () => {
      const response = await fetchNews();
      return response.data;
    },
    {
      staleTime: 10000,
    }
  );

  useEffect(() => {
    if (data) {
      setNews(data);
    }
  }, [data]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">2-4반 news</h1>
      {session && session.user.email === 'ahnji1313@gmail.com' ? (
        <button
          className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md"
          onClick={() => queryClient.invalidateQueries('news')}
        >
          Refresh News
        </button>
      ) : null}
      <NewsList news={news} />
    </div>
  );
};

export default HomePage;
```

```typescript
// pages/news/[id].tsx
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useQuery, useQueryClient } from 'react-query';
import { fetchNewsItem } from '../lib/api';
import NewsItem from '../components/NewsItem';
import LoadingSkeleton from '../components/LoadingSkeleton';

const NewsPage = ({ id }) => {
  const { data: session } = useSession();
  const [newsItem, setNewsItem] = useState({});
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery(
    ['newsItem', id],
    async () => {
      const response = await fetchNewsItem(id);
      return response.data;
    },
    {
      staleTime: 10000,
    }
  );

  useEffect(() => {
    if (data) {
      setNewsItem(data);
    }
  }, [data]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{newsItem.title}</h1>
      <NewsItem newsItem={newsItem} />
      {session && session.user.email === 'ahnji1313@gmail.com' ? (
        <button
          className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md"
          onClick={() => queryClient.invalidateQueries(['newsItem', id])}
        >
          Refresh News Item
        </button>
      ) : null}
    </div>
  );
};

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps = async ({ params }) => {
  return {
    props: {
      id: params.id,
    },
  };
};

export default NewsPage;
```

```typescript
// components/NewsList.tsx
import React from 'react';
import Link from 'next/link';

interface Props {
  news: any[];
}

const NewsList = ({ news }: Props) => {
  return (
    <ul>
      {news.map((newsItem) => (
        <li key={newsItem.id}>
          <Link href={`/news/${newsItem.id}`}>
            <a>{newsItem.title}</a>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default NewsList;
```

```typescript
// components/NewsItem.tsx
import React from 'react';

interface Props {
  newsItem: any;
}

const NewsItem = ({ newsItem }: Props) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{newsItem.title}</h2>
      <p className="text-lg">{newsItem.content}</p>
    </div>
  );
};

export default NewsItem;
```

```typescript
// components/LoadingSkeleton.tsx
import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Loading...</h1>
      <div className="animate-pulse">
        <div className="bg-gray-200 h-4 mb-4"></div>
        <div className="bg-gray-200 h-4 mb-4"></div>
        <div className="bg-gray-200 h-4 mb-4"></div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
```

```typescript
// lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://example.com/api',
});

export const fetchNews = async () => {
  const response = await api.get('/news');
  return response;
};

export const fetchNewsItem = async (id: string) => {
  const response = await api.get(`/news/${id}`);
  return response;
};
```

```typescript
// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

```typescript
// next.config.js
module.exports = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
};
```

```bash
npm install
npm run dev
```

```bash
npx netlify deploy
```