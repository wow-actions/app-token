// @link https://ravgeetdhillon.medium.com/deploy-a-serverless-probot-github-app-on-netlify-functions-98fc1e4a4300

const {
  createLambdaFunction,
  createProbot,
} = require('@probot/adapter-aws-lambda-serverless')
const app = require('../lib/app')

module.exports.handler = createLambdaFunction(app, {
  probot: createProbot(),
})
