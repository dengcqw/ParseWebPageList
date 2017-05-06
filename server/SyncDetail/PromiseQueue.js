
function PromiseQueue() {
  this.queue = [/* {promiseGenerator, callback:(result, err)} */]
  this.running = false
}

PromiseQueue.prototype._run = function() {
  if (this.running == true) {
    return
  }

  let promiseGenerator = this.queue.shift()
  if (promiseGenerator) {
    this.running = true
    console.log("----> start a promise job: ", promiseGenerator.name)
    promiseGenerator()
      .then((result) => {
        console.log("----> finish a promise job: ", promiseGenerator.name)
        this.running = false
        this._run()
      })
      .catch((err)=>{
        console.log("----> fail in promise job: ", promiseGenerator.name, err)
        this.running = false
        this._run()
      })
  } else {
    this.running = false
    console.log("----> update queue is empty; stop running")
  }
}

PromiseQueue.prototype.enqueue = function(promiseGenerator) {
  this.queue.push(promiseGenerator)
  this._run()
}

module.exports = PromiseQueue
