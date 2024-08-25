import joi from 'joi'
export const signup = {
    body: joi.object().required().keys({
        userName: joi.string().required(),
        firstName:joi.string(),
        email: joi.string().email({
            minDomainSegments: 1,
            tlds: { allow: ['com', 'net', 'edu'] }
        }).required().messages({
            'any.required': "Plz enter u email",
            'any.empty': "Email can not be empty",
            'string.base': "plz enter valid  string email"
        }),
        password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
        cPassword: joi.string().valid(joi.ref('password')).required()
    })//.options({allowUnknown:true}),
    // query:joi.object().required().keys({
    //     boo :joi.boolean().required()
    // })
}


export const signin = {
    body: joi.object().required().keys({
        email: joi.string().email({
            minDomainSegments: 1,
            tlds: { allow: ['com', 'net', 'edu'] }
        }).required().messages({
            'any.required': "Plz enter u email",
            'any.empty': "Email can not be empty",
            'string.base': "plz enter valid  string email"
        }),
        password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
    })
}

export const  confirmEmail =  {
    params:joi.object().required().keys({
        token:joi.string().required()
    })
}