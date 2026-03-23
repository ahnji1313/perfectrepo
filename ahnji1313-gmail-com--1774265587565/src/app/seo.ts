**next.config.js**
```javascript
module.exports = {
  // Next.js metadata API
  experimental: {
    metadata: true,
  },
  // OpenGraph
  target: 'serverless',
  // Schema.org JSON-LD
  head: () => {
    return {
      title: 'My Next.js App',
      titleTemplate: '%s | My Next.js App',
      meta: [
        {
          name: 'description',
          content: 'Welcome to my Next.js app',
        },
        {
          property: 'og:title',
          content: 'My Next.js App',
        },
        {
          property: 'og:description',
          content: 'Welcome to my Next.js app',
        },
        {
          property: 'og:image',
          content: 'https://example.com/image.jpg',
        },
        {
          property: 'og:url',
          content: 'https://example.com',
        },
        {
          property: 'og:site_name',
          content: 'My Next.js App',
        },
        {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          name: 'twitter:site',
          content: '@mytwitterhandle',
        },
        {
          name: 'twitter:title',
          content: 'My Next.js App',
        },
        {
          name: 'twitter:description',
          content: 'Welcome to my Next.js app',
        },
        {
          name: 'twitter:image',
          content: 'https://example.com/image.jpg',
        },
        {
          property: 'schema:name',
          content: 'My Next.js App',
        },
        {
          property: 'schema:description',
          content: 'Welcome to my Next.js app',
        },
        {
          property: 'schema:image',
          content: 'https://example.com/image.jpg',
        },
        {
          property: 'schema:url',
          content: 'https://example.com',
        },
        {
          property: 'schema:type',
          content: 'Website',
        },
      ],
      link: [
        {
          rel: 'canonical',
          href: 'https://example.com',
        },
      ],
      script: [
        {
          src: 'https://www.googletagmanager.com/gtag/js?id=G-XXXXX',
          async: true,
        },
      ],
    }
  },
  // Google Analytics 4
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Set-Cookie',
            value: 'ga4=1; Max-Age=31536000; Secure; HttpOnly',
          },
          {
            key: 'Set-Cookie',
            value: 'gatsby-ga4=1; Max-Age=31536000; Secure; HttpOnly',
          },
        ],
      },
    ]
  },
  // Sitemap.xml
  async generateSitemap({ pages }) {
    return (
      await Promise.all(
        pages
          .filter((page) => page.ComponentPath)
          .map(async (page) => {
            const url = new URL(page.ComponentPath, 'https://example.com');
            return { loc: url.href, lastmod: new Date().toISOString() };
          })
      )
    ).flat();
  },
  // Robots.txt
  async getRobotsTxt() {
    return 'User-agent: *\nAllow: /\nDisallow: /private';
  },
}
```

**pages/_app.js**
```javascript
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
```

**pages/_document.js**
```javascript
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
```

**pages/api/ga4.js**
```javascript
import { NextApiRequest, NextApiResponse } from 'next';
import { ga4 } from 'firebase/app';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { ga4Id } = req.body;
  if (!ga4Id) return res.status(401).json({ error: 'Invalid GA4 ID' });
  const ga4Client = ga4('G-' + ga4Id);
  ga4Client.page_view();
  return res.status(200).json({ message: 'GA4 page view sent' });
}
```

**firebase-config.js**
```javascript
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { collection, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { app, db, analytics };
```

**google-analytics.html**
```html
<!DOCTYPE html>
<html>
<head>
  <title>Google Analytics 4</title>
</head>
<body>
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXX"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', 'G-XXXXX');
  </script>
</body>
</html>
```

**sitemap.xml**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  {pages.map((page) => (
    <url>
      <loc>{page.ComponentPath}</loc>
      <lastmod>{page.lastmod}</lastmod>
    </url>
  ))}
</urlset>
```

**robots.txt**
```txt
User-agent: *
Allow: /
Disallow: /private
```