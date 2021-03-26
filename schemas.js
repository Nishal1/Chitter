const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

const postSchema = Joi.object({
    post: Joi.object({body: Joi.string().required().escapeHTML()
    }).required()
});

module.exports.postSchema = postSchema;

const commentSchema = Joi.object({
    comment: Joi.object({ 
    body: Joi.string().required().escapeHTML()
    }).required()
});

module.exports.commentSchema = commentSchema;