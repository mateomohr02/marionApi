const emailTemplateEs = require('./emailTemplateEs');
const emailTemplateDe = require('./emailTemplateDe');

const emailBuilder = (sender, receiver, title, body, lang = 'es') => {
    const message = {
        from: sender,
        to: receiver,
        subject: title,
        text: body,
        html: lang === 'es' ? emailTemplateEs(body) : lang === 'de' ? emailTemplateDe(body) : emailTemplateEs(body),
    };
    return message;
}

module.exports = emailBuilder;