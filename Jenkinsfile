#!groovy

pipeline {
  agent any

  stages {
    stage('FetchCode') {
      steps {
        checkout scm
      }
    }
    stage('PlaceHolder') {
      steps {
        echo "Doing nothing for now"
      }
    }
  }
  post {
    success {
      slackSend color: 'good', message: "https://jenkins.planx-pla.net/job/$env.JOB_NAME/\nuc-cdis/data-portal pipeline succeeded"
    }
    failure {
      slackSend color: 'bad', message: "https://jenkins.planx-pla.net/job/$env.JOB_NAME/\nuc-cdis/data-portal pipeline failed"
    }
    unstable {
      slackSend color: 'bad', message: "https://jenkins.planx-pla.net/job/$env.JOB_NAME/\nuc-cdis/data-portal pipeline unstable"
    }
  }
}
