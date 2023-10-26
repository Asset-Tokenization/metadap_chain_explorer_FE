#!/usr/bin/env groovy
pipeline {
    agent any
    parameters{
                string(
                    description: 'Branch to build',
                    defaultValue: 'main',
                    name: 'BRANCH_BUILD',
                    trim: true
                )
                booleanParam(
                    defaultValue: true, 
                    description: 'Trigger job update with this image after build success', 
                    name: 'TRIGGER_UPDATE'
                )
                string(
                    defaultValue: '1.13.2-1.0.0',
                    description: 'The release version, use as image as version',
                    name: 'RELEASE_VERSION', 
                    trim: true
                )
    }
    stages {
        stage('Checkout Source') {
            steps {
                git branch: "${params.BRANCH_BUILD}", credentialsId: 'metadap.id_rsa', url: 'git@github.com:Asset-Tokenization/metadap_chain_explorer_FE.git'
            }
        }
    
        stage('Build image Dev') {
            steps{
                script{
                    echo "Build image with version ${params.RELEASE_VERSION}"
                    sh "docker build -t registry.metadap.io/blockscout/frontend :${params.RELEASE_VERSION} ."
                    echo 'Build Image Completed' 
                }
            }
        }
    
        stage('Pushing Image') {
            steps {
                script{
                    echo "pushing image registry.metadap.io/blockscout/frontend :${params.RELEASE_VERSION}"
                    sh "docker push registry.metadap.io/blockscout/frontend :${params.RELEASE_VERSION}"

                    sh  "docker rmi -f registry.metadap.io/blockscout/frontend :${params.RELEASE_VERSION}"
                    echo 'Push Image Completed' 
                }
            }
        }
        
        stage('Deploy') {
            when {
                expression{params.TRIGGER_UPDATE}
            }           
            steps {
                script{
                    echo "trigger deploy job"
                }
            }
        }
    }
}