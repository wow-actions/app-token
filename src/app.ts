import { Probot } from 'probot'
import start from './index'

export = async (app: Probot) => {
  app.onAny(async (context: any) => {
    // eslint-disable-next-line no-console
    console.log(`event: ${context.name}`)
  })

  start(app)
}
