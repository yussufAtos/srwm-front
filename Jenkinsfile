@Library('srfm') _

NODEJS = "NodeJS_16.14.0"
pipeline {
    agent { label "${helper.DEFAULT_NODE}" }

    stages {
        stage('Dependencies') {
            steps {
                echo 'Retrieve dependencies...'
                nodejs(nodeJSInstallationName: "${NODEJS}") {
                    sh('npm ci')
                }
            }
        }

        stage('Unit tests') {
            steps {
                echo 'Unit tests...'
                nodejs(nodeJSInstallationName: "${NODEJS}") {
                    sh('npx nx affected --target=test --base=origin/master --parallel')
                }
            }
        }

        stage('Integration tests') {
            steps {
                echo 'Integration testing...'
                warnError('Integration tests failed') {
                    nodejs(nodeJSInstallationName: "${NODEJS}") {
                      sh('npx nx affected --target=test --base=origin/master --parallel')
                    }
                }

                publishHTML (
                    target : [
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'coverage/cypress/lcov-report',
                        reportFiles: 'index.html',
                        reportName: "Couverture de code (cypress)"
                    ]
                )
            }
        }

        stage('Prebuild for hotfix/*') {
            when {
                anyOf {
                    branch "hotfix/*"
                }
            }
            steps {
                echo 'Alter angular.json for hotfix branch...'
                sh("sed -i 's#\"baseHref\": \"/\",#\"baseHref\": \"/hotfix/\",#' angular.json")
            }
        }

        stage('Build') {
            steps {
                echo 'Building...'
                nodejs(nodeJSInstallationName: "${NODEJS}") {
                    sh('npx nx affected  --target=zip --all')
                }
                archiveArtifacts artifacts: '**/dist/*.zip', fingerprint: true
            }
        }

        stage('Deploy') {

            when {
                anyOf {
                    branch "develop"
                }
            }

            steps {
                echo 'Deploying....'
                nodejs(nodeJSInstallationName: "${NODEJS}") {
                    sh('npx nx affected  --target=deploy --all')
                }
            }
        }
    }
}
