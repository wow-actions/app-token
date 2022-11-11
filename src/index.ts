import { Probot } from 'probot'
import * as util from './util'

export = (app: Probot) => {
  try {
    // app.onAny((context) => {
    //   // eslint-disable-next-line no-console
    //   console.log(`>>>>>>>>>>>>>>> event: ${context.name} <<<<<<<<<<<<<<<<`)
    // })
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
