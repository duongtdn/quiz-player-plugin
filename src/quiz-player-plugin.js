"use strict"

const QUIZ_API_SOURCE = 'http://localhost:3100/quiz_api';

const TIMEOUT = 2000

export default class QuizPlayerPlugin {
  constructor(events) {

    this.ready = false;
    this._instance = null;
    this.active = false;
    this.timeout = false;
    this.events = {...events};

    this.queue = [];

  }

  init() {
    console.log('Quiz Player init')
    /* load plugin script, then create new player when api is loaded */
    this._loadPluginScript();
    window.onQuizAPIReady = () => {
      console.log('Loaded Quiz API');
      this._clearTimeout();
      this._instance = this._createPlayer();
    }
  }

  load(src) {
    this.active = true;
    this._setTimeout(TIMEOUT);
    if (!this.ready) {
      this.queue.push(src);
      return this;
    }
    this._instance.load(src);

    return this;
  }

  stop() {
    this.active = false;
    // this.ready &&  this._instance && this._instance.stop();
    return this;
  }

  finish() {
    this.stop();
    return this;
  }

  onReady() {
    this.ready = true;
    this._clearTimeout();
    if (this.active && this.queue.length > 0) { // only load when active
      const src = this.queue.pop();
      this.load(src);
    }
  }

  onLoaded() {
    this._clearTimeout()._fire('onLoaded');
  }

  _loadPluginScript() {
    const tag = document.createElement('script');
    tag.src = QUIZ_API_SOURCE;
    const body = document.getElementsByTagName('BODY')[0];
    body.appendChild(tag, body);
    return this;
  }

  _createPlayer() {
    const player = new Quiz.Player('quiz-player', {
      events: {
        onReady: this.onReady.bind(this),
        onLoaded: this.onLoaded.bind(this)
      }
    })

    return player;
  }

  _fire(event, ...args) {
    /* only fire event when active */    
    this.active && this.events[event] && this.events[event](...args);
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

}

QuizPlayerPlugin.playerName = 'QUIZ'
QuizPlayerPlugin.version = '1.0.0'