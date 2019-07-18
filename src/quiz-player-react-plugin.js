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
      index: 0,
      showSummary: false
    }

    this.submitted = []
    this.answers = []
    this.checks = []
    this.quizStates = []

    this.props.player && this.props.player.on('onLoaded', data => {
      this.submitted = data.data.map( quiz => false )
      this.answers = data.data.map( quiz => {} )
      this.checks = data.data.map( quiz => {} )
      this.quizStates = data.data.map( quiz => {} )
      this.setState({ data: data.data, index: 0, showSummary: false })
    })
    this.submit = this.submit.bind(this)
    this.finish = this.finish.bind(this)
    this.checkAnswer = this.checkAnswer.bind(this)
    this.updateAnswers = this.updateAnswers.bind(this)
    this.getSavedAnswers = this.getSavedAnswers.bind(this)
    this.updateInternalState = this.updateInternalState.bind(this)
    this.getSavedInternalState = this.getSavedInternalState.bind(this)
  }

  render() {
    if (this.state.data && this.state.data.length > 0) {
      return (
        <div id = "quiz-player" className="embed-player">
          {this.state.showSummary? this._renderSummary() : this._renderQuiz()}
        </div>
      )
    } else {
      return null
    }
  }

  _renderQuiz() {
    const quizzes = this.state.data
    const quiz = quizzes[this.state.index]
    return (
      <div >
        <header className="w3-border-bottom" style={{padding: '8px 0', position: 'relative'}}>
          <span> Quiz {this.state.index+1} </span>
          <span className={quizzes.length === 1 ? 'w3-hide': ''} style={{position: 'absolute', top: 0, right: 0}}>
            {
              quizzes.map( (quiz,index) => {
                const color = this.submitted[index]? 'blue' : 'grey'
                return (
                  <CircleTag key={index} value={index} color={color} onClick={ () => this.setState({ index, showSummary: false })} />
                )
              })
            }
          </span>
        </header>
        <div className="">
          <Quiz data={quiz}
                addons={addons}
                updateAnswers = {this.updateAnswers}
                getSavedAnswers = {this.getSavedAnswers}
                updateInternalState = {this.updateInternalState}
                getSavedInternalState = {this.getSavedInternalState}
          />
        </div>
        <div className="w3-border-bottom" style={{marginTop: '32px', padding: '16px 0'}}>
          <button className="w3-button w3-blue" onClick={this.submit}> Submit </button>
        </div>
      </div>
    )
  }

  _renderSummary() {
    const quizzes = this.state.data
    return (
      <div >
        <header className="w3-border-bottom" style={{padding: '8px 0', position: 'relative'}}>
          <span> <i className="w3-text-blue fa fa-calendar" /> Report </span>
          <span className={quizzes.length === 1 ? 'w3-hide': ''} style={{position: 'absolute', top: 0, right: 0}}>
            {
              quizzes.map( (quiz,index) => {
                const color = this.submitted[index]? 'blue' : 'grey'
                return (
                  <CircleTag key={index} value={index} color={color} onClick={ () => this.setState({ index, showSummary: false  })} />
                )
              })
            }
          </span>
        </header>
        <div className="" style={{marginTop: '32px'}}>
          <ul className="w3-ul">
            {
              quizzes.map( (quiz, index) => {
                const check = this.checks[index]
                return (
                  <li key = {index} style={{maxWidth: '960px', margin: 'auto'}}>
                    <span> Quiz {index+1} </span>
                    <span className="w3-right"> { check && Object.keys(check).every( key => check[key] ) ? <i className="w3-text-green fa fa-check" /> : <i className="w3-text-red fa fa-remove" /> } </span>
                  </li>
                )
              })
            }
          </ul>
        </div>
        <div className="w3-border-bottom" style={{marginTop: '32px', padding: '16px 0'}}>
          <div style={{maxWidth: '960px', margin: 'auto'}}>
            <button className="w3-button w3-blue" onClick={e => this.finish()}> Next Lesson </button>
          </div>
        </div>
      </div>
    )
  }

  submit() {
    const quizzes = this.state.data
    const check = this.checkAnswer()
    if (quizzes.length > 1) {
      console.log(check?'Correct':'Incorrect')
      this.submitted.splice(this.state.index, 1, true)
      if (this.state.index >= quizzes.length - 1) {
        this.setState({ showSummary: true })
      } else {
        this.setState({ index: this.state.index + 1 })
      }
    } else {
      console.log(check?'Correct':'Incorrect')
      if (check) {
        this.finish()
      } else {
        this.finish({skip: 1})
      }
    }
  }

  updateAnswers(answer) {
    const index = this.state.index
    this.answers.splice(index, 1, answer)
  }

  getSavedAnswers() {
    return this.answers[this.state.index]
  }

  checkAnswer() {
    const quizzes = this.state.data
    const index = this.state.index
    const quiz = quizzes[index]
    const userAnswer = this.answers[index]
    const check = {}
    for (let key in quiz.answer) {
      check[key] = false
      if (userAnswer && userAnswer[key] !== undefined && userAnswer[key] !== null) {
        if (typeof quiz.answer[key] === 'object') {
          check[key] = true
          for (let id in quiz.answer[key]) {
            if (!(userAnswer[key][id] && userAnswer[key][id] == quiz.answer[key][id])) {
              check[key] = false
              break
            }
          }
        } else {
          check[key] = userAnswer[key] == quiz.answer[key]
        }
      }
    }
    this.checks.splice(index, 1, check)
    return Object.keys(check).every( key => check[key] )
  }

  updateInternalState(state) {
    const index = this.state.index
    this.quizStates.splice(index, 1, state)
  }

  getSavedInternalState() {
    return this.quizStates[this.state.index]
  }

  finish(next) {
    this.props.player.finish && this.props.player.finish(next)
  }

}

export default bindRender(QuizPlayerPlugin, QuizReactComponent)
