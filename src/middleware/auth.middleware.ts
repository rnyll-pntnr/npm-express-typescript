import { Action, UnauthorizedError} from 'routing-controllers'
import jwt from 'jsonwebtoken'


export default AuthenticationHandler = async (action: Action) => {
    const _token = action.request.headers['authorization']

    if (!_token) throw new UnauthorizedError('Unauthorized')

    await jwt.verify(
        _token,
        process.env.JWT_TOKEN,
        (error, decoded) => {
            if (error) throw new UnauthorizedError('Unauthorized')
        }
    )

    return true
}