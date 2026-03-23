**Performance Optimization Code Examples**

### Code Splitting (React)

```javascript
// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createRoutesFromElements } from 'react-router-dom';

const routes = createRoutesFromElements(
  <Route path="/" element={<App />} />,
  <Route path="/about" element={<About />} />,
  // ...
);

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      {routes}
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);
```

```javascript
// App.js
import React from 'react';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const About = lazy(() => import('./About'));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/about"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <About />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
```

### Lazy Loading (React)

```javascript
// LazyLoading.js
import React from 'react';
import { lazy, Suspense } from 'react';

const Component = lazy(() => import('./Component'));

function LazyLoading() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Component />
    </Suspense>
  );
}
```

### Bundle Optimization (Webpack)

```javascript
// webpack.config.js
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new TerserPlugin(),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 10000,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  },
};
```

### Image Optimization

```javascript
// image-optimization.js
import compressImage from 'compress-image';

async function optimizeImages(folderPath) {
  const files = await fs.readdirSync(folderPath);
  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const stats = await fs.statSync(filePath);
    if (stats.isFile() && file.endsWith('.jpg') || file.endsWith('.png')) {
      const optimizedFile = await compressImage(filePath);
      await fs.renameSync(filePath, optimizedFile);
      console.log(`Optimized ${file}`);
    }
  }
}

optimizeImages('src/images');
```

### Edge Caching

```javascript
// edge-caching.js
const express = require('express');
const cache = require('memory-cache');

const app = express();
const cacheStore = cache.create();

app.use(express.static('dist'));

app.use((req, res, next) => {
  const cachedResponse = cacheStore.get(req.url);
  if (cachedResponse) {
    res.send(cachedResponse);
  } else {
    next();
  }
});

app.use((req, res, next) => {
  cacheStore.put(req.url, res);
  next();
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
```

### Database Query Optimization

```javascript
// database-query-optimization.js
const db = require('mongodb');

async function optimizeQueries(collectionName) {
  const collection = db.collection(collectionName);
  const query = { /* your query here */ };
  const options = {
    projection: { /* your projection here */ },
  };
  const cursor = collection.find(query, options);
  await cursor.forEach((doc) => {
    // process the document
  });
  await cursor.close();
}

optimizeQueries('my-collection');
```

Note that these are just basic examples and may require modifications to fit your specific use case. Additionally, the performance optimizations may vary depending on the specific requirements of your application.