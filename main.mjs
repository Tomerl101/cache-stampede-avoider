import { workflowWithOneCacheMiss } from './cacheStampedeAvoider';
import singletonCache from './cache';

const run = async () => {
  const callPromises = [];
  for (let i = 0; i < 10; i += 1) {
    callPromises.push(workflowWithOneCacheMiss('myKey'));
  }
  await Promise.all(callPromises);
  console.log(
    `total calls made to cache ${singletonCache.cacheHits}. total calls to db ${
      singletonCache.dbHits
    }`
  );
  return 'abc';
};

run();
