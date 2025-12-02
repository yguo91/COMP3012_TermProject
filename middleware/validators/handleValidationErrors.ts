import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to handle validation errors
 *
 * This acts as a protective layer between routes and controllers.
 * If validation fails, it stops the request and sends an error response.
 * If validation passes, it calls next() to continue to the controller.
 *
 * Usage:
 *   router.post('/endpoint',
 *     validationRules,
 *     handleValidationErrors,  // <-- Add this
 *     controllerFunction
 *   );
 */
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => ({
      field: err.type === 'field' ? (err as any).path : 'unknown',
      message: err.msg
    }));

    console.error('❌ Validation failed:', errorMessages);

    // For web forms: Send user-friendly error page
    return res.status(400).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Validation Error</title>
        <link href="/css/tailwind.css" rel="stylesheet">
      </head>
      <body class="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center p-4">
        <div class="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div class="flex items-center mb-6">
            <span class="text-5xl mr-4">⚠️</span>
            <h1 class="text-3xl font-bold text-red-600 dark:text-red-400">Validation Error</h1>
          </div>

          <p class="text-gray-700 dark:text-gray-300 mb-6">
            Please fix the following errors and try again:
          </p>

          <ul class="space-y-3 mb-8">
            ${errorMessages.map(err => `
              <li class="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded">
                <strong class="text-red-700 dark:text-red-300">${err.field}:</strong>
                <span class="text-red-600 dark:text-red-400 ml-2">${err.message}</span>
              </li>
            `).join('')}
          </ul>

          <div class="flex gap-4">
            <button onclick="history.back()" class="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition font-medium">
              ← Go Back
            </button>
            <a href="/posts" class="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium">
              Home
            </a>
          </div>
        </div>
      </body>
      </html>
    `);
  }

  // ✅ Validation passed - continue to controller
  next();
};
