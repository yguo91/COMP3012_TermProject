import { body, param } from 'express-validator';

/**
 * Validation rules for creating a new post
 */
export const createPostValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters')
    .escape(), // Prevent XSS attacks

  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10, max: 5000 }).withMessage('Description must be between 10 and 5000 characters')
    .escape(), // Prevent XSS attacks

  body('link')
    .optional({ checkFalsy: true }) // Allow empty string
    .trim()
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('Link must be a valid URL with http:// or https://'),

  body('subgroup')
    .trim()
    .notEmpty().withMessage('Subgroup is required')
    .isLength({ min: 2, max: 50 }).withMessage('Subgroup must be between 2 and 50 characters')
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Subgroup can only contain letters, numbers, underscores, and hyphens')
    .toLowerCase(), // Normalize to lowercase
];

/**
 * Validation rules for editing an existing post
 */
export const editPostValidation = [
  param('postid')
    .isInt({ min: 1 }).withMessage('Invalid post ID'),

  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters')
    .escape(),

  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10, max: 5000 }).withMessage('Description must be between 10 and 5000 characters')
    .escape(),

  body('link')
    .optional({ checkFalsy: true })
    .trim()
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('Link must be a valid URL with http:// or https://'),

  body('subgroup')
    .trim()
    .notEmpty().withMessage('Subgroup is required')
    .isLength({ min: 2, max: 50 }).withMessage('Subgroup must be between 2 and 50 characters')
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Subgroup can only contain letters, numbers, underscores, and hyphens')
    .toLowerCase(),
];

/**
 * Validation rules for post ID parameter
 */
export const postIdValidation = [
  param('postid')
    .isInt({ min: 1 }).withMessage('Invalid post ID'),
];
