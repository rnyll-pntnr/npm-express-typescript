import 'dotenv/config'
import Container from 'typedi'
import { PinoLogger } from './utils/logger'
import ExpressServer from './server'
import { connect } from './utils/mongo'

(async () => {
    const logger: PinoLogger = Container.get(PinoLogger)
    try {
        await connect(logger)
        const PORT: number = parseInt(process.env.PORT ?? '4000')
        const app = new ExpressServer(PORT, logger)

        app.run()
    } catch (error) {
        logger.error(error.message)
    }
})()