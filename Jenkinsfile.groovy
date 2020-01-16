@Library('Shared-Lib-DevOps@MOBILEYE')
import java.lang.String.*
import intel.aa.mobileye.Build
import intel.aa.common.DockerConstants

def build = new Build()
currentBuild.result = 'SUCCESS'

def gitHandler = getGitHandler()
def dockerHandler = getDockerHandler()
def slaveHandler = getSlave()

def mailingList = 'ido.karavany@intel.com'


def envName = "ci"
def branch = "${getJenkinsfileBranchName()}"
def buildNumber = env.BUILD_NUMBER
def tagName = envName + "-" + buildNumber

def businessLine = "mobileye"
def credentialsId = "aamobileye"


def awsAuth = getAWSauth(businessLine, [debug: true])

def repoName = getJobName()
repoName = "me-esri-webmaps"

import intel.aa.mobileye.JobParameters

def mobileyeParams = new JobParameters()


properties([
    parameters ([stringParam(name: 'version', defaultValue: 'master', description: 'The current version'),
                 mobileyeParams.region(),
                 booleanParam(name: 'buildBaseDocker', defaultValue: false, description: 'Build base docker'),
    ]),
    disableConcurrentBuilds()

])

def pipelineBucket = getAwsS3Bucket(businessLine, [region: params.region, branch: branch, appName: repoName, authObj: awsAuth, debug: true])
def cfnHandler = getCFNActions(businessLine, [parameters_map: [Branch: branch], region: params.region, account: "$businessLine", env: "$envName" , debug: true])

def EcrActions = getAwsEcr(businessLine, [debug: true, region: params.region])
def EksActions = getAwsEks(businessLine, [debug: true, region: params.region])
def helmHandler = getHelmHandler()


def tls_full_repo = "AA-Mobileye/me-stream-platform-tls"
def new_template_file = ''
def tls_template_file = 'template.yaml'
def tls_bucket_name = "master-me-tls-mobileye-mobileye-test-bucket"
def bucket_url_cf = "https://s3.amazonaws.com/${tls_bucket_name}"
def bucket_url_upload = "s3://${tls_bucket_name}"
def resource_name = repoName.replace("-", "")
boolean mark_as_rc = false
Map releaseData = [release: false, releaseCandidate: false]
def chartLocalPath = repoName


try{
slaveHandler.basicMe { label ->
    node(label) {
        container('basic') {

        build.cleanWSAndCheckout(params)

        stage("aws authentication") {
            awsAuth.awsLogin(credentialsId)

        }
        if (params.buildBaseDocker){
            stage('Build Base Docker') {
                dockerHandler.dockerLogin()
                def dockerRepoNew = DockerConstants.INTEL_DOCKER_HUB_NEW
                def dockerImageName = "me-webmaps-base"
                def dockerImageTag = "${env.BUILD_NUMBER}"
                dockerHandler.dockerBuild('.' ,"${dockerRepoNew}/${dockerImageName}" , "${dockerImageTag}", "-f Dockerfile_base", [:])
                dockerHandler.dockerPush(dockerRepoNew, dockerImageName, dockerImageTag)

                //dockerHandler.buildTagPushWithPath(".", "me-webmaps-base", "${env.BUILD_NUMBER}", [dockerFile: "Dockerfile_base"])
            }
        }


        stage('Build Docker') {
//             if (!params.buildBaseDocker){
//                 dockerHandler.dockerLogin()
//             }
            dockerHandler.dockerLogin()

            EcrActions.ecrDockerBuild(repoName,tagName)
            EcrActions.ecrDockerBuild(repoName, envName)


        }



        stage("Run tests"){
        }

        stage('Push Docker to ECR') {
            EcrActions.ecrLogin()
            EcrActions.ecrDockerPush(repoName,tagName)
            EcrActions.ecrDockerPush(repoName, envName)

        }

        stage ('Pack helm chart'){
            chartVersion = helmHandler.packageLocalChart('.',"${chartLocalPath}", tagName , releaseData)
        }


        stage ("Push Helm pack to remote repo"){
            helmHandler.pushChartToHarbor(chartLocalPath)
        }



        stage("Deploy ${chartLocalPath}  in  ${envName} environment ") {

            withCredentials([usernamePassword(credentialsId: 'mobileye-arcgis', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                // get relevant web map id
                sh "pip3 install --no-deps -r esri_tools/requirements.txt; python3 -c 'from esri_tools.esri_tools import get_webmap_id' "
                command = 'python3 -c "from esri_tools.esri_tools import get_webmap_id;  print(get_webmap_id(\\"safety-map\\",\\"' + envName + '\\", \\"$USERNAME\\", \\"$PASSWORD\\"))"'
                safetyWebmapId = sh(script: command, returnStdout: true).trim()
                sh "echo ${safetyWebmapId}"
                EksActions.eksLogin(["eks_cluster_name": "eks-mobileye-${envName}"])
                awsAuth.activate_with_context("sudo helm upgrade -i ${chartLocalPath} --namespace maps-ci harbor/${chartLocalPath} --version=${chartVersion.trim()} --set global.environment=${envName}") //--set safety.webmapId=${safetyWebmapId}")

            }


        }


        stage("Build And Deploy CloudFormation to AWS") {
            cfnHandler.cfnBuildAndDeploy("${pipelineBucket.getBucketName()}")

            if ("${currentBuild.result}" == "UNSTABLE") {
                failPipe("Deployment failed")
            }
        }

        if ( "${branch}" == "master") {
            stage("Upload ${repoName} to tls artifacts bucket") {
                new_template_file = cfnHandler.getOutputFile()
                if (mark_as_rc) {
                    sh "mv ${new_template_file} ${new_template_file}-RC"
                    new_template_file = "${new_template_file}-RC"
                }
                pipelineBucket.upload_sse(new_template_file, bucket_url_upload)
            }

            stage("Edit all TLS that ${repoName} belongs to") {
                Map updated_parameters = cfnHandler.getParametersMap()
                updated_parameters.BuildType="tls"
                updated_parameters.EnvironmentName = ["Ref":"EnvironmentName"]
                cfnHandler.editTlsTemplateFile(tls_full_repo, tls_template_file, updated_parameters,
                        "${bucket_url_cf}/${new_template_file}", resource_name)

            }
        }

    }
}
}
} catch (e) {
    build.handleException(e)
} finally {
    build.handleFinally(params)
}
