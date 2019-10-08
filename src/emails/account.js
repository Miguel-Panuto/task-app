const sgMail = require('@sendgrid/mail');


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) =>
{
    sgMail.send(
    {
        to: email,
        from: 'miguel.panuto@live.com',
        subject: 'Thanks for joining in!!',
        text: `Welcome to the app, ${name}. Let us know how you get along with the app!!`
    });
}

const sendGoodbyeEmail = (email, name) =>
{
    sgMail.send(
    {
        to: email,
        from: 'miguel.panuto@live.com',
        subject: 'We will miss you',
        text: `See you later my friend, ${name}. If there is a chance to you comeback, let us know how can we improve`
    });
}

module.exports = {
    sendWelcomeEmail,
    sendGoodbyeEmail,
}