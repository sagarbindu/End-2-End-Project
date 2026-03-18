pipeline {
    agent any

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
                sh """
                docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD
                docker push ${IMAGE_NAME}:${TAG}
                """
            }
        }

        stage('Update GitOps Repo') {
            steps {
                sh """
                git clone https://github.com/sagarbindu/End-2-end-gitops.git
                cd End-2-end-gitops

                if [ "${BRANCH_NAME}" == "dev" ]; then
                    FILE="values-dev.yaml"
                else
                    FILE="values-prod.yaml"
                fi

                sed -i 's/tag:.*/tag: "${TAG}"/' $FILE

                git config user.name "sagarbindu"
                git config user.email "dashsagarbindu789@gmail.com"
                git commit -am "Update image tag ${TAG}"
                git push https://${GIT_TOKEN}@github.com/sagarbindu/End-2-end-gitops.git
                """
            }
        }
    }
}
