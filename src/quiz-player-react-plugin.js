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
      submitted: [],
      answers: [],
      checks:[]
    }
    this.props.player && this.props.player.on('onLoaded', data => {
      const submitted = data.data.map( quiz => false )
      const answers = data.data.map( quiz => {} )
      const checks = data.data.map( quiz => {} )
      this.setState({ data: data.data, submitted, answers, checks, index: 0 })
    })
    this.submit = this.submit.bind(this)
    this.finish = this.finish.bind(this)
    this.checkAnswer = this.checkAnswer.bind(this)
    this.updateAnswers = this.updateAnswers.bind(this)
    this.getSavedAnswers = this.getSavedAnswers.bind(this)
  }

  render() {
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
                  const color = this.state.submitted[index]? 'blue' : 'grey'
                  return (
                    <CircleTag key={index} value={index} color={color} onClick={ () => this.setState({ index })} />
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
                  updateInternalState = {this.props.updateInternalState}
                  getSavedInternalState = {this.props.getSavedInternalState}
            />
          </div>
          <div className="w3-border-bottom" style={{marginTop: '32px', padding: '16px 0'}}>
            <button className="w3-button w3-blue" onClick={this.submit}> Submit </button>
          </div>
        </div>
      )
    } else {
      return null
    }
  }

  submit() {
    const quizzes = this.state.data
    const check = this.checkAnswer()
    if (quizzes.length > 1) {
      console.log(check?'Correct':'Incorrect')
      if (this.state.index >= quizzes.length - 1) {
        // end of quizzes
        this.finish()
      } else {
        const submitted = [...this.state.submitted]
        submitted.splice(this.state.index, 1, true)
        this.setState({ submitted, index: this.state.index + 1 })
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
    const answers = [...this.state.answers]
    answers.splice(index, 1, answer)
    this.setState({ answers })
  }

  getSavedAnswers() {
    return this.state.answers[this.state.index]
  }

  checkAnswer() {
    const quizzes = this.state.data
    const index = this.state.index
    const quiz = quizzes[index]
    const userAnswer = this.state.answers[index]
    const checks = [...this.state.checks]
    const check = {}
    for (let key in quiz.answer) {
      if (userAnswer && userAnswer[key] !== undefined && userAnswer[key] !== null && userAnswer[key] === quiz.answer[key]) {
        check[key] = true
      } else {
        check[key] = false
      }
    }
    checks.splice(index, 1, check)
    this.setState({ checks })
    return Object.keys(check).every( key => check[key] )
  }

  finish(next) {
    this.props.player.finish && this.props.player.finish(next)
  }

}

export default bindRender(QuizPlayerPlugin, QuizReactComponent)
