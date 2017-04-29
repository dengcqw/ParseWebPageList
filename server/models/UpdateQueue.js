
function UpdateQueue() {
  this.queue = [/* {modelName, query, callback:(result, err) */]
  this.running = false
}

UpdateQueue.prototype._run = function() {
  if (this.running == true) {
    return
  }

  let promiseGenerator = this.queue.shift()
  if (promiseGenerator) {
    this.running = true
    console.log("----> start a update database job")
    promiseGenerator()
      .then(() => {
        console.log("----> finish a update database job")
        this.running = false
        this._run()
      })
      .catch((err)=>{
        console.log("----> fail in update database job", err)
        this.running = false
        this._run()
      })
  } else {
    this.running = false
    console.log("----> update queue is empry; stop running")
  }
}

UpdateQueue.prototype.enqueue = function(promiseGenerator) {
  this.queue.push(promiseGenerator)
  this._run()
}

module.exports = UpdateQueue

