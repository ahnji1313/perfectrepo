```javascript
const Redis = require('ioredis');
const redis = new Redis();

// Set TTL strategy (1 hour)
const ttl = 3600;

// Set cache key
const cacheKey = 'news:ahnji1313@gmail.com';

// Set distributed lock key
const lockKey = 'lock:news:ahnji1313@gmail.com';

// Set pub/sub channel
const channel = 'news:ahnji1313@gmail.com';

// Cache data
async function cacheData(data) {
  await redis.set(cacheKey, JSON.stringify(data), 'EX', ttl);
}

// Get cached data
async function getCachedData() {
  const data = await redis.get(cacheKey);
  return data ? JSON.parse(data) : null;
}

// Acquire distributed lock
async function acquireLock() {
  const lock = await redis.set(lockKey, 'locked', 'EX', 30, 'NX');
  return lock === 'OK';
}

// Release distributed lock
async function releaseLock() {
  await redis.del(lockKey);
}

// Publish message to pub/sub channel
async function publishMessage(message) {
  await redis.publish(channel, message);
}

// Subscribe to pub/sub channel
async function subscribeToChannel() {
  redis.subscribe(channel, (err, count) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Subscribed to channel: ${channel}`);
    }
  });

  redis.on('message', (channel, message) => {
    if (channel === channel) {
      console.log(`Received message: ${message}`);
      // Cache invalidation
      invalidateCache();
    }
  });
}

// Cache invalidation
async function invalidateCache() {
  await redis.del(cacheKey);
}

// Example usage
async function main() {
  const data = { news: 'Very cool news' };

  // Cache data
  await cacheData(data);

  // Get cached data
  const cachedData = await getCachedData();
  console.log(cachedData);

  // Acquire distributed lock
  const lockAcquired = await acquireLock();
  if (lockAcquired) {
    console.log('Lock acquired');
    // Release distributed lock
    await releaseLock();
  }

  // Publish message to pub/sub channel
  await publishMessage('Cache invalidated');

  // Subscribe to pub/sub channel
  await subscribeToChannel();
}

main();
```