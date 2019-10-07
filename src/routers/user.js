const express = require('express');
const User = require('../db/models/User');
const auth = require('../middleware/auth')
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
        const token = await user.genarateAuthToken();
        res.status(201).send({ user, token });
    }
    catch(e) 
    { 
        res.status(400).send();
    }
    
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

        res.send({ sueccess: 'You logout from everthing' });
        await req.user.save();
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
        return res.status(400).send({ error: 'Invalid updates' });

    try
    {
        updates.forEach((update) => req.user[update] = req.body[update]);

        await user.save();
        
        res.send(user);
    }
    catch(e)
    {
        res.status(400).send(e);
    }
});

router.delete('/users/me', auth,async (req, res) =>
{
    try
    {
        res.send(req.user);
        await req.user.remove();
    }
    catch(e)
    {
        res.status(500).send(e);
    }
});

module.exports = router;