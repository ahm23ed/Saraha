import jwt from 'jsonwebtoken'
import { userModel } from '../DB/model/user.model.js';



export const auth = () => {

    return async (req, res, next) => {
        try {
            const { authorization } = req.headers
            console.log({ authorization });
            if (!authorization.startsWith(process.env.BearerKey)) {
                res.json({ message: "in-valid beaer key" })
            } else {
                const token = authorization.split(process.env.BearerKey)[1]
                console.log({ token });
                const decoded = jwt.verify(token, process.env.TOKENSIGNATURE)
                console.log(decoded);
                if (!decoded || !decoded.id || !decoded.isLoggedIn) {
                    res.json({ message: "in-valid token payload" })
                } else {
                    const user = await userModel.findById(decoded.id).select('email userName')
                    if (!user) {
                        res.status(404).json({ message: "not register user" })
                    } else {
                        req.user = user
                        next()
                    }
                }
            }
        } catch (error) {
            res.json({ message: "catch error", error })

        }

    }
}