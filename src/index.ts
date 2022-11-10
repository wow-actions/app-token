import { Probot } from 'probot'
import * as util from './util'

export = (app: Probot) => {
  try {
    app.on('workflow_run', async (context) => {
      const action = context.payload.action
      if (action !== 'completed') {
        util.log(`workflow_run.${action}`)
        await util.update(app, context)
      }
    })
  } catch (error) {
    app.log.error(error)
  }
}
