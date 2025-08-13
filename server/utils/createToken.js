import jwt from 'jsonwebtoken'

const createToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.SECRET_KEY, {
        expiresIn: '30d',
    })
    res.cookie("PMS", token, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === 'production' ? true : false,
    })
    return token
}

export default createToken