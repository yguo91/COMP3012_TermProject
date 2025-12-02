import { body, param } from 'express-validator';

/**
 * Validation rules for voting on a post
 */
export const voteValidation = [
  param('postid')
    .isInt({ min: 1 }).withMessage('Invalid post ID'),

  body('setvoteto')
    .isInt().withMessage('Vote value must be an integer')
    .isIn([-1, 0, 1]).withMessage('Vote must be -1 (downvote), 0 (remove vote), or 1 (upvote)')
    .toInt(), // Convert string to integer
];
