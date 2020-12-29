class myPromise {
    constructor(callback) {
        this.success = null
        this.fail = null
        this.msg = ''
        this.queue = []
        callback(success => {
            this.success = success
            this.msg = 'SUCCESS'
            this.queue.forEach(item => {
                item.res(success)
            })
        }, fail => {
            this.fail = fail
            this.msg = 'FAIL'
            this.queue.forEach(item => {
                item.rej(fail)
            })
        })
    }
    then(fullFn, fail) {
        // if (this.msg === 'SUCCESS') {
        //     success(this.success)
        // } else if (this.msg === 'FAIL') {
        //     fail(this.fail)
        // } else {
        //     this.queue.push({
        //         res: success,
        //         rej: fail
        //     })
        // }
        return new myPromise((resFn, rejFn) => {
            if (this.msg === 'SUCCESS') {
                handle(this.success)
            } else if (this.msg === 'FAIL') {
                fail(this.fail)
            } else {
                this.queue.push({
                    res: this.success,
                    rej: fail
                })
            }
            function handle(value) {
                let reaValue = (fullFn instanceof Function && success(value)) || value
                if (reaValue && reaValue.then instanceof Function) {
                    reaValue.then(res => { resFn(res) }, fail => { rejFn(fail) })
                } else {
                    resFn(reaValue)
                }
            }
        })
    }
}

new myPromise((res, rej) => {
    res("hello")
}).then(data => {
    console.log(data)
})

new myPromise((res, rej) => {
    function fn() {
        res("gja")
    }
    setTimeout(fn, 1000)
}).then(data => {
    console.log(data)
})