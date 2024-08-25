import { Router } from 'express'
import * as userController from './controller/user.js'
import { auth } from '../../middelwear/auth.js'
import { validation } from '../../middelwear/validation.js'
import * as validators  from './user.validators.js'
const router = Router()




router.get("/", auth(), userController.userProfile)
router.post("/uploadPic",auth(),userController. uploadProfilePic);
router.patch("/updateprofile",auth(),userController.updateProfile)
router.patch("/password", validation(validators.updatePassword) ,auth() ,userController.updatePassword)



export default router