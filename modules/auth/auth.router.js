import { Router } from 'express'
import { auth } from '../../middelwear/auth.js'
import { validation } from '../../middelwear/validation.js'
import * as validators from './auth.validators.js'
import * as authController from './controller/auth.js'
const router = Router()



router.get("/", (req, res) => {
    res.json({ message: "Auth module" })
})


router.post("/signup", validation(validators.signup),authController.signUp)
router.get("/confirmEmail/:token",validation(validators.confirmEmail) ,authController.confirmEmail)
router.get("/requestEmailToken/:token",validation(validators.confirmEmail), authController.requestRefToken)

router.post("/signin", validation(validators.signin) ,authController.signIn)


router.patch("/sendCode" ,auth(), authController.sendCode)
router.patch("/forgetPassword" , auth(),authController.forgetPassword)
router.patch("/logout" , auth(),authController.logOut)

export default router