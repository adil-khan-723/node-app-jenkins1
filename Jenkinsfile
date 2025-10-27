pipeline {
    agent any

    triggers {
        pollSCM('* * * * *')
    }

    environment {
        BACKEND = 'backend'
        FRONTEND = 'frontend'
    }

    stages {
        stage('checkout code') {
            steps {
                git branch: 'main', url: 'https://github.com/adil-khan-723/node-app-jenkins1.git'
                echo 'fetching the code from the repo.....'
            }
        }

        stage('frontend build') {
            steps {
                sh "docker build -t ${FRONTEND} ./frontend"
            }
        }

        stage('backend build') {
            steps {
                sh "docker build -t ${BACKEND} ./backend"
            }
        }

        stage('frontend test') {
            steps {
                sh "docker run --rm ${FRONTEND} npm test"
            }
        }

        stage('backend test') {
            steps {
                sh "docker run --rm ${BACKEND} npm test -- --watchAll=false"
            }
        }

        stage('deploy') {
            steps {
                echo 'deploying the full stack app 🚀'
                sh 'docker compose down'
                sh 'docker compose up --build'
            }
        }
    }
    post {
        success {
            echo 'deployment successful 🚀 ✅'
        }
        failure {
            echo 'failed deployement ❌ 😔'
        }
    }
}
