const dataMethod = ['body', 'params', 'query', 'headers']
export const validation = (Schema) => {
    return (req, res, next) => {
        console.log(req.body);
        const validationArr = []

        dataMethod.forEach(key => {
            if (Schema[key]) {
                const validationResult = Schema[key].validate(req[key], { aortEarly: false })
                if (validationResult.error) {
                    validationArr.push(validationResult.error.details)
                }
            }
        });
        if (validationArr.length) {
            res.json({ message: "Validation error", validationArr })
        } else {
            next()
        }
    }
}