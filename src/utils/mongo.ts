import mongoose from "mongoose"

export const connect = async (logger: any) => {
    mongoose.set('strictQuery', true)
    return await mongoose.connect(`${process.env.DB_STRING}`)
        .then(() => {
            logger.info(`DB Connected Successfully!`)
        })
        .catch(err => {
            logger.error(`Failed to connect to DB: ${err.message}`)
        })
}