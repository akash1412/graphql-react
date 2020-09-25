const jwt = require('jsonwebtoken')

const {
    events
} = require('./merge')

const Event = require('../../models/events')
const User = require('../../models/users')
const Booking = require('../../models/booking')


const signToken = ({
    id,
    email
}) => {
    return jwt.sign({
        id,
        email
    }, process.env.JWT_SECRET_KEY, {
        expiresIn: '1hr'
    })
}

module.exports = {


    createUser: async (args) => {

        const {
            email,
            password
        } = args.userInput;

        try {

            const UserExists = await User.findOne({
                email
            })

            if (UserExists) {
                throw new Error('User alredy exist')
            }

            const newUser = await User.create({
                email,
                password
            })


            newUser.password = null

            return newUser
        } catch (error) {
            console.error(error)
        }

    },
    login: async ({
        email,
        password
    }) => {
        const user = await User.findOne({
            email
        })

        // console.log(await user.comparePasswords(password))

        if (!await user.comparePasswords(password) || !user) {
            throw Error('Incorrect email or password')
        }



        const token = signToken({
            id: user.id,
            email: user.email
        })

        return {
            userId: user.id,
            token,
            tokenExpiration: 1
        }
    }

}