pipeline {
    agent {
        docker {
            image 'docker:24.0.5'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
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
                    docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD
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

                    if [ "${BRANCH_NAME}" == "dev" ]; then
                        FILE="values-dev.yaml"
                    else
                        FILE="values-prod.yaml"
                    fi

                    sed -i 's/tag:.*/tag: "${TAG}"/' $FILE

                    git config user.name "jenkins"
                    git config user.email "jenkins@example.com"
                    git commit -am "Update image tag ${TAG}"
                    git push https://${GIT_TOKEN}@github.com/sagarbindu/End-2-end-gitops.git
                    """
                }
            }
        }
    }
}
