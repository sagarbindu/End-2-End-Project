pipeline {
    agent {
        docker {
            image 'docker:24.0.5-git'
            args '-v /var/run/docker.sock:/var/run/docker.sock -e HOME=/tmp'
        }
    }

    environment {
        IMAGE_NAME = "sagar456/devops-app"
        TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${TAG} ."
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-creds', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    sh """
                    echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin
                    docker push ${IMAGE_NAME}:${TAG}
                    """
                }
            }
        }

        stage('Update GitOps Repo') {
            steps {
                withCredentials([string(credentialsId: 'git-token', variable: 'GIT_TOKEN')]) {
                    sh """
        
                    git clone https://github.com/sagarbindu/End-2-end-gitops.git
                    cd End-2-end-gitops

                    sed -i 's/tag:.*/tag: "${TAG}"/' values-dev.yaml

                    git config user.name "sagarbindu"
                    git config user.email "dashsagarbindu789@gmail.com"
                    git commit -am "Update image tag ${TAG}"
                    git push https://${GIT_TOKEN}@github.com/sagarbindu/End-2-end-gitops.git
                    """
                }
            }
        }
    }
}
