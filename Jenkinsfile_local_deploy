pipeline {
    agent any

    triggers {
        pollSCM('* * * * *')
    }

    environment {
        BACKEND = 'backend'
        FRONTEND = 'frontend'
        FB = 'frontend_build'
        BB = 'backend_build'
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
                echo 'building the frontend test image'
                sh "docker build -t ${FB} --target build ./frontend"
                sh "docker run --rm ${FB} npm test -- --watchAll=false"
                echo 'cleaning up the frontend test image'
                sh "docker rmi ${FB}"
            }
        }

        stage('deploy') {
            steps {
                echo 'deploying the full stack app 🚀'
                sh 'docker-compose down'
                sh 'docker-compose up --build -d' 
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
