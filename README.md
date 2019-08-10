cacheStampedeAvoider

# Cache Stampede Avoider

> A cache stampede is a type of cascading failure that can occur when massively parallel computing systems with caching mechanisms come under very high load. This behaviour is sometimes also called dog-piling.[1][2]

Lets take an example , assume traffic of 1000 rps (request per second) and the local cache as well as caching server expires the data, thus we have 1000 requests hitting the database simultaneosly , thus causing herd effect may result into congestion collapse of the application system.

## Solution: use Lock

---

allow only one request fetches from the database while the rest are waiting (using debounce) for the cache to be written

Locking
One request worker acquires the lock for that cache key and put the same in cache while serving the response so that subsequent request workers get value from the cache.

But developer has to implement options for the remaining workers which were not able to acquire lock :

- Either Wait until the value is recomputed. (this may lead to Starvation and in turn performance degradation thus causing hung requests)

- Keep a stale item in the cache to be used while the new value is recomputed

If implemented properly, locking can prevent stampedes altogether, but the main drawback is a developer has to take care of tuning of a time-to-live for the lock, race-conditions, and so on. Sample code is as follows :

## Algorithm

---

- If there is a cache miss, check if there is a request pending for the current key
- If yes, don’t make the database call and try to read cache after some time
- If no request is in progress, make a database call and update the cache

<https://en.wikipedia.org/wiki/Cache_stampede>

<https://blog.bitsrc.io/how-a-simple-caching-strategy-can-break-a-system-9a0f60ced1f0>
