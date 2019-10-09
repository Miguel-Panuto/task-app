const express = require('express');
const sharp = require('sharp');
const User = require('../models/User');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { sendWelcomeEmail, sendGoodbyeEmail } = require('../emails/account');

const router = new express.Router();

router.get('/users/me', auth ,async (req, res) =>
{
    res.send(req.user);
});

router.post('/users', async (req, res) =>
{
    const user = new User(req.body);
    try

    {
        await user.save();
        sendWelcomeEmail(user.email, user.name);
        const token = await user.genarateAuthToken();
        res.status(201).send({ user, token });
    }
    catch(e) 
    { 
        res.status(400).send();
    }
    
});

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) =>
{
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
}, (error,req,res,next) =>
{
    res.status(400).send({ error: error.message })
});

router.post('/users/login', async(req,res) =>
{
    try
    {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.genarateAuthToken();
        res.send({ user, token});
    }
    catch(e)
    {
        res.status(400).send(e);
    }
});

router.post('/users/logout', auth, async (req, res) =>
{
    try
    {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
        
        await req.user.save();
        res.send();
    }
    catch(e)
    {
        res.status(500).send();
    }
});

router.post('/users/logoutall', auth, async (req, res) =>
{
    try
    {
        req.user.tokens = [];

        await req.user.save();
        res.send({ sueccess: 'You logout from everthing' });
    }
    catch(e)
    {
        res.status(500).send();
    }
});

router.get('/users/:id', async (req, res) =>
{
    const _id = req.params.id;
    try
    {
        const user = await User.findById(_id);
        if (!user)
        {
            return res.status(404).send({ error: 'There is no user' });
        }
        res.status(201).send(user);
    }
    catch(e) 
    { 
        res.status(500).send();
    }
});

router.patch('/users/me', auth, async (req, res) =>
{
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'age', 'password'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidOperation)
    {
        
        return res.status(400).send({ error: 'Invalid updates' });
    }
        

    try
    {
        updates.forEach((update) => req.user[update] = req.body[update]);
        
        await req.user.save();
        
        res.send(req.user);
    }
    catch(e)
    {
        res.status(400).send(e);
    }
});

router.delete('/users/me', auth, async (req, res) =>
{
    try
    {
        sendGoodbyeEmail(req.user.email, req.user.name);
        await User.findByIdAndDelete(req.user._id);
        res.send();
    }
    catch(e)
    {
        res.status(500).send(e);
    }
});

router.delete('/users/me/avatar', auth,async (req, res) =>
{
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
});

router.get('/users/:id/avatar', async (req, res) =>
{
    try
    {
        const user = await User.findById(req.params.id);
        if(!user || !user.avatar)
        {
            throw new Error();
        }

        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    }
    catch(e)
    {
        res.status(404).send();
    }
})

module.exports = router;