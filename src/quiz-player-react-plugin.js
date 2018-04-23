"use strict"

import React, { Component } from 'react'

import QuizPlayerPlugin from './quiz-player-plugin'
import { bindRender } from 'content-presenter'

class QuizReactComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id = "quiz-player">
      </div>
    )
  }

  finish() {
    this.props.player.finish();
  }

}

export default bindRender(QuizPlayerPlugin, QuizReactComponent)