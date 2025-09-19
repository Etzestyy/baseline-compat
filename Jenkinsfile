# Jenkinsfile
# Baseline Compat scan for Jenkins

pipeline {
    agent any
    stages {
        stage('Install dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Run Baseline Compat Scan') {
            steps {
                sh 'npx ts-node cli/scan.ts demo/'
            }
        }
        stage('Archive Reports') {
            steps {
                archiveArtifacts artifacts: 'baseline-report.json,baseline-report.sarif,baseline-pr-comment.md', allowEmptyArchive: true
            }
        }
    }
}
