function Promise(fn) {
    var callback;
    var promise = this
    var vale = null
    promise._resolves = []
    promise._status = 'PENDING';
    this.then = function (onFulfilled) {
        // if (promise._status === 'PENDING') {
        //     promise._resolves.push(onFulfilled)
        //     return this
        // }
        // onFulfilled(value)
        // return this
        return new Promise(function (resolve) {
            function handle(value) {
                var ret = typeof onFulfilled === 'function' && onFulfilled(value) || value;
                if (ret && typeof ret['then'] === 'Function') {
                    ret.then(function (value) {
                        resolve(value)
                    })
                } else {
                    resolve(value)
                }
            }
            if (promise._status === 'PENDING') {
                promise._resolves.push(handle)
            } else {
                handle(value)
            }
        })
    }
    function resolve() {
        setTimeout(function () {
            promise._status = "FULFILLED";
            promise._resolves.forEach(function (callback) {
                callback(value);
            });
        }, 0);
    }
    fn(resolve)
}