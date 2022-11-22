import { Probot } from 'probot'
import sodium from 'libsodium-wrappers'
import { WorkflowRunContext } from './types'

async function encryptSecret(context: WorkflowRunContext, value: string) {
  const { data } = await context.octokit.request(
    'GET /repos/:owner/:repo/actions/secrets/public-key',
    context.repo(),
  )

  await sodium.ready

  // Convert Secret & Base64 key to Uint8Array.
  const binkey = sodium.from_base64(data.key, sodium.base64_variants.ORIGINAL)
  const binsec = sodium.from_string(value)

  // Encrypt the secret using LibSodium
  const encryptedBytes = sodium.crypto_box_seal(binsec, binkey)

  return {
    key_id: data.key_id,
    // Base64 the encrypted secret
    encrypted_value: sodium.to_base64(
      encryptedBytes,
      sodium.base64_variants.ORIGINAL,
    ),
  }
}

async function createOrUpdateSecret(
  context: WorkflowRunContext,
  name: string,
  value: string,
) {
  const secret = await encryptSecret(context, value)
  await context.octokit.request(
    'PUT /repos/:owner/:repo/actions/secrets/:secret_name',
    context.repo({
      secret_name: name,
      data: secret,
    }),
  )
}

async function deleteSecret(context: WorkflowRunContext, name: string) {
  await context.octokit.request(
    'DELETE /repos/:owner/:repo/actions/secrets/:secret_name',
    context.repo({
      secret_name: name,
    }),
  )
}

function getAppName() {
  return process.env.APP_SLUG_NAME || 'APP_NAME'
}

function getTokenName() {
  return process.env.APP_TOKEN_NAME || 'APP_TOKEN'
}

export function log(message: string) {
  const char = '='
  const max = 64
  const len = message.length
  if (len < max - 2) {
    const total = max - message.length - 2
    const left = Math.floor(total / 2)
    const right = total - left
    // eslint-disable-next-line
    console.log(`${''.padEnd(left, char)} ${message} ${''.padEnd(right, char)}`)
  } else {
    // eslint-disable-next-line
    console.log(message)
  }
}

export async function update(app: Probot, context: WorkflowRunContext) {
  const { data: me } = await context.octokit.apps.getAuthenticated()
  const appName = getAppName()
  await createOrUpdateSecret(context, appName, me.slug || me.name)
  log('APP NAME UPDATED')

  const client = await app.auth()
  const {
    data: { token },
  } = await client.apps.createInstallationAccessToken({
    installation_id: context.payload.installation!.id,
  })
  const tokenName = getTokenName()
  await createOrUpdateSecret(context, tokenName, token)
  log('APP TOKEN UPDATED')
}

export async function remove(context: WorkflowRunContext) {
  const appName = getAppName()
  const tokenName = getTokenName()

  await deleteSecret(context, appName)
  await deleteSecret(context, tokenName)
}
