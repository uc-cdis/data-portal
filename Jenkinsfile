#!groovy

pipeline {
  agent any

  stages {
    stage('FetchCode') {
      steps {
        checkout scm
      }
    }
    stage('k8sDeploy') {
        steps {
            echo "GIT_BRANCH is $env.GIT_BRANCH"
            echo "GIT_COMMIT is $env.GIT_COMMIT"
            script {
                def helper = new uchicago.cdis.KubeHelper(this);
                //helper.deployBranch("portal-service");
            }
        }
    }
  }
  post {
    success {
      echo "https://jenkins.planx-pla.net/job/$env.JOB_NAME/\nuc-cdis/data-portal pipeline succeeded"
    }
    failure {
      slackSend color: 'bad', message: "https://jenkins.planx-pla.net/job/$env.JOB_NAME/\nuc-cdis/data-portal pipeline failed"
    }
    unstable {
      slackSend color: 'bad', message: "https://jenkins.planx-pla.net/job/$env.JOB_NAME/\nuc-cdis/data-portal pipeline unstable"
    }
  }
}
