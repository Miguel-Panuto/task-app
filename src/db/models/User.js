const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name:
    {
        type: String, //The program will only accept the string type
        required: true, //If does not put anything, will throw a error
        trim: true, //That will takes out the blank spaces between the string (not in the center)
        lowercase: true, //That will put everthing in lowercase
    },
    email:
    {
        type: String,
        unique: true, //Just one email per user
        require: true,
        validate(value) //That is a function, that will validade something
        {
            if (!validator.isEmail(value))
            {
                throw new Error('Email is invalid');
            }
        }
    },
    password:
    {
        type: String,
        minlength: 7, //That will be required a minimum size, crucial for passwords
        validate(value)
        {
            if (value.toLowerCase().includes('password')) //That will verify if the password, has 'password' in it
            {
                throw new Error('The password contains "password"');
            }
        },
        trim: true
    },
    age:
    {
        type: Number,
        default: 0, //If the user does not put anything, in the database will assume the number 0
        validate(value) 
        {
            if (value < 0)
            {
                throw new Error('Age must be positive');
            }
        }
    }
});

userSchema.statics.findByCredentials = async () =>
{
    const user = await User.findOne({ email });
    if(!user)
    {
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch)
    {
        throw new Error('Unable to login');
    }

    return user;
}

userSchema.pre('save', async function (next)
{
    const user = this;

    if (user.isModified('password'))
    {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

const User = mongoose.model('User', userSchema);//If there is none table called 'user', the first data will create on the database

module.exports = User;