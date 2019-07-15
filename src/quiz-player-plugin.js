"use strict"

const TIMEOUT = 5000

export default class QuizPlayerPlugin {
  constructor(events) {

    this._events = {}
    for (let name in events) {
      this._events[name] = [events[name]]
    }

    this.timeout = false
    this.active = false

  }

  init() {
    console.log('Quiz Player init')
  }

  load(src) {
    this.active = true
    this._setTimeout(TIMEOUT)
    this._get(src).then( data => {
      this._clearTimeout()._fire('onLoaded', { data: JSON.parse(data) })
    }).catch(err => console.log(`Error: ${err}`))
    return this
  }

  stop() {
    this.active = false
    return this
  }

  finish(next) {
    this._fire('onFinished', next)
    this.stop()
    return this
  }

  on(event, handler) {
    this._events && this._events[event].push(handler)
  }

  _fire(event, ...args) {
    /* only fire event when active */    
    if (this.active && this._events[event]) {
      this._events[event].forEach(handler => handler(...args) )
    }
    return this;
  }

  _setTimeout(duration) {
    this.timeout = true;
    setTimeout(() => {
      if (this.timeout) {
        this._fire('onTimeout');
      }
    }, duration);
  }

  _clearTimeout() {
    this.timeout = false;
    return this;
  }

  _get(src) {
    return new Promise((resolve, reject) => {
      const urlBasePath = QuizPlayerPlugin.playerVars.urlBasePath
      const request  = new XMLHttpRequest()
      request .addEventListener('load', () => {
        if (request.status == 200) {
          resolve(request.responseText)
        } else {
          reject(request.status)
        }
      })
      request .open("GET", `${urlBasePath}/${src}`, true)
      request .send()
    })
  }

}

QuizPlayerPlugin.playerName = 'QUIZ'
QuizPlayerPlugin.version = '2.0.0'
QuizPlayerPlugin.playerVars = {}
QuizPlayerPlugin.media = false

QuizPlayerPlugin.setPlayerVars = (vars) => {
  QuizPlayerPlugin.playerVars = vars;
}
