"use strict"

import React, { Component } from 'react'

import QuizPlayerPlugin from './quiz-player-plugin'
import { bindRender } from 'content-presenter'

import Quiz from 'react-quiz'
import addons from 'react-quiz/dist/addons'

class CircleTag extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const i = this.props.value
    const color = this.props.color || 'blue'
    return (
      <div  className={`w3-${color} w3-hover-yellow`} key={i}
            style={{height: '25px', width: '25px', borderRadius: '50%', textAlign: 'center', display: 'inline-block', margin: '8px 4px 0 0', cursor: 'pointer', padding: '0px 0px'}}
            onClick = {this.props.onClick}>
        <span className="w3-small"> {i+1} </span>
      </div>
    )
  }
}

class QuizReactComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: null
    }
    this.props.player && this.props.player.on('onLoaded', data => this.setState({ data }))
  }

  render() {
    console.log(this.state.data)
    if (this.state.data) {
      return (
        <div id = "quiz-player" className="embed-player">
          <header className="w3-border-bottom" style={{padding: '8px 0', position: 'relative'}}>
            <span> Quiz 1 </span>
            <span style={{position: 'absolute', top: 0, right: 0}}>
              <CircleTag value={0} />
              <CircleTag value={1} color='grey' />
              <CircleTag value={2} color='grey' />
            </span>
          </header>
          <div className="">
            <Quiz data={this.state.data}
                  addons={addons}
                  updateAnswers = {this.props.updateAnswers}
                  getSavedAnswers = {this.props.getSavedAnswers}
                  updateInternalState = {this.props.updateInternalState}
                  getSavedInternalState = {this.props.getSavedInternalState}
            />
          </div>
          <div className="w3-border-bottom" style={{marginTop: '32px', padding: '16px 0'}}>
            <button className="w3-button w3-blue" > Submit </button>
          </div>
        </div>
      )
    } else {
      return null
    }
  }

  finish() {
    this.props.player.finish();
  }

}

export default bindRender(QuizPlayerPlugin, QuizReactComponent)