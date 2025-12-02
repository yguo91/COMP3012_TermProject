import { body, param } from 'express-validator';

/**
 * Validation rules for creating a comment
 */
export const createCommentValidation = [
  param('postid')
    .isInt({ min: 1 }).withMessage('Invalid post ID'),

  body('description')
    .trim()
    .notEmpty().withMessage('Comment cannot be empty')
    .isLength({ min: 1, max: 1000 }).withMessage('Comment must be between 1 and 1000 characters')
    .escape(), // Prevent XSS attacks
];
