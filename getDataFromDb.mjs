//mock request to db
import singletonCache from './cache';

export const getDataFromDb = () =>
  new Promise(resolve => {
    console.log('getting from db');
    singletonCache.dbHits += 1;
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
