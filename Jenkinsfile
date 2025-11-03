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
        EC2_IP = '13.200.147.207'
        DIR = '/home/ubuntu/node-app-jenkins1'
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

        stage('deploy to ec2') {
            steps {
                sshagent(credentials: ['ssh']) {
                    sh """ ssh -o StrictHostKeyChecking=no ubuntu@${EC2_IP} '
                        if [ -d "${DIR}" ]; then
                            cd ${DIR} && git pull
                        else 
                            git clone https://github.com/adil-khan-723/node-app-jenkins1.git
                        fi && \
                        cd ${DIR} && \
                        docker compose down && \
                        docker compose up --build -d 
                        '
                    """
                }
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
