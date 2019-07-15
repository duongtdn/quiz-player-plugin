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
      data: null,
      index: 0
    }
    this.props.player && this.props.player.on('onLoaded', data => this.setState({ data: data.data }))
  }

  render() {
    console.log(this.state.data)
    if (this.state.data && this.state.data.length > 0) {
      const quizzes = this.state.data
      const quiz = quizzes[this.state.index]
      return (
        <div id = "quiz-player" className="embed-player">
          <header className="w3-border-bottom" style={{padding: '8px 0', position: 'relative'}}>
            <span> Quiz {this.state.index+1} </span>
            <span className={quizzes.length === 1 ? 'w3-hide': ''} style={{position: 'absolute', top: 0, right: 0}}>
              {
                quizzes.map( (quiz,index) => {
                  const color = 'grey'
                  return (
                    <CircleTag key={index} value={index} color={color} />
                  )
                })
              }
            </span>
          </header>
          <div className="">
            <Quiz data={quiz}
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