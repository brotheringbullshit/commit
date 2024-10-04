// SlowDB by github.com/brotheringbullshit
// this slows down IndexedDB reading using delays, basic but quite annoying.

(function() {
    // Function to add delay
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Wrapper to check localStorage flag and apply delay if enabled
    function applyDelayIfEnabled(callback) {
        return async function(event) {
            // Check the flag in localStorage
            const delayEnabled = localStorage.getItem('indexedDBDelayEnabled') === 'true';
            
            if (delayEnabled) {
                const request = event.target;
                
                // Check if it's a read operation
                if (request.source && request.source instanceof IDBObjectStore) {
                    // Introduce delay (e.g., 2 seconds)
                    await delay(2000);
                }
            }

            // Call the original success handler
            callback.call(this, event);
        };
    }

    // Overwrite IDBRequest success handler to conditionally introduce delay
    const originalSuccess = Object.getOwnPropertyDescriptor(IDBRequest.prototype, 'onsuccess').set;
    Object.defineProperty(IDBRequest.prototype, 'onsuccess', {
        set: function(callback) {
            // Wrap the original callback with the delay-checking wrapper
            originalSuccess.call(this, applyDelayIfEnabled(callback));
        }
    });

    console.warn("SlowDB is active.")
})();
