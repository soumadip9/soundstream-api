const userModel = require('../models/user.model');
const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');


async function register(req, res){
    const {username, email, password, role="user"} = req.body;
    const isUserAlreadyExists = await userModel.findOne({
        $or: [
            {username: username},
            {email: email}
        ]
    })
    if(isUserAlreadyExists){
return res.status(400).json({
    message: 'User already exists'
})
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
        username,
        email,
        password: hashedPassword,
        role
    })

    const token=jsonwebtoken.sign({
        id: user._id,
        role: user.role
    }, process.env.JWT_SECRET)

    res.cookie('token',token)
    return res.status(201).json({
        message: 'User created successfully',
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    })
}

async function login(req, res){
    const {username,email, password}=req.body;
    const user=await userModel.findOne({
        $or: [
                {username},
                {email}
        ]
    })

    if(!user){
          return res.status(400).json({
            message: 'Invalid credentials'
          })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(400).json({
                message: 'Invalid credentials'
            })
        }
        const token=jsonwebtoken.sign({
            id: user._id,
            role: user.role
        }, process.env.JWT_SECRET)

        res.cookie('token',token)

        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        })
}

async function logout(req, res){
    res.clearCookie('token');
    res.status(200).json({
        message: 'Logout successful'
    })
}

module.exports = {register, login, logout}
