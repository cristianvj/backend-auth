import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { handleInputErrors } from '../middleware/validation';
import { body, param } from 'express-validator';

const router = Router();

/**
 * @swagger
 * /api/auth/create-account:
 *  post:
 *    summary: Create an account
 *    tags:
 *      - Authentication
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                default: John Doe
 *              email:
 *                type: string
 *                default: jhon@doe.com
 *              password:
 *                type: string
 *                default: password123
 *              password_confirmation:
 *                type: string
 *                default: password123
 *    responses:
 *      200:
 *        description: Account created successfully
 *      400:
 *        description: Bad request
 *      500:
 *        description: Internal server error 
 */ 

router.post('/create-account',
	body('name')
		.notEmpty().withMessage('Name cannot be empty'),
	body('password')
		.isLength({ min: 8 }).withMessage('Password is too short, minimun 8 characters'),
	body('password_confirmation').custom((value, { req }) => {
		if (value !== req.body.password) {
				throw new Error('The passwords are differents')
		}
		return true;
	}),
	body('email')
		.isEmail().withMessage('E-mail is not valid'),
	handleInputErrors,
	AuthController.createAccount
);

/**
 * @swagger
 * /api/auth/confirm-account:
 *   post:
 *     summary: Confirm account
 *     tags: 
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *             required:
 *               - token
 *             example:
 *               token: "your_confirmation_token_here"
 *     responses:
 *       200:
 *         description: Account confirmed successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

router.post('/confirm-account',
  body('token')
    .notEmpty().withMessage('Token cannot be empty'),
  handleInputErrors,
  AuthController.confirmAccount
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login
 *     tags: 
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *             example:
 *               email: "example@example.com"
 *               password: "your_password_here"
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized - invalid credentials
 *       500:
 *         description: Internal server error
 */

router.post('/login',
  body('email')
    .isEmail().withMessage('E-mail is not valid'),
  body('password')
    .notEmpty().withMessage('password cannot be empty'),
  handleInputErrors,
  AuthController.login
);

/**
 * @swagger
 * /api/auth/request-code:
 *   post:
 *     summary: Request confirmation code
 *     tags: 
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *             required:
 *               - email
 *             example:
 *               email: "example@example.com"
 *     responses:
 *       200:
 *         description: Token sent to your email successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized - invalid credentials
 *       500:
 *         description: Internal server error
 */

router.post('/request-code',
  body('email')
      .isEmail().withMessage('E-mail no válido'),
  handleInputErrors,
  AuthController.requestConfirmationCode
);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Forgot password
 *     tags: 
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *             required:
 *               - email
 *             example:
 *               email: "example@example.com"
 *     responses:
 *       200:
 *         description: A password reset email has been sent
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized - invalid email
 *       500:
 *         description: Internal server error
 */

router.post('/forgot-password',
  body('email')
    .isEmail().withMessage('Incorrect e-mail'),
  handleInputErrors,
  AuthController.forgotPassword
);

/**
 * @swagger
 * /api/auth/validate-token:
 *   post:
 *     summary: Validate token
 *     tags: 
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *             required:
 *               - token
 *             example:
 *               token: "your_token_here"
 *     responses:
 *       200:
 *         description: Valid token
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized - invalid token
 *       500:
 *         description: Internal server error
 */

router.post('/validate-token',
  body('token')
    .notEmpty().withMessage('Token not be empty'),
  handleInputErrors,
  AuthController.validateToken
);

/**
 * @swagger
 * /api/auth/update-password/{token}:
 *   post:
 *     summary: Update password with token
 *     tags: 
 *       - Authentication
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token de restablecimiento de contraseña
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *               password_confirmation:
 *                 type: string
 *             required:
 *               - password
 *               - password_confirmation
 *             example:
 *               password: "new_password"
 *               password_confirmation: "new_password"
 *     responses:
 *       200:
 *         description: Password successfully updated
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized - invalid token
 *       500:
 *         description: Internal server error
 */


router.post('/update-password/:token',
  param('token')
    .isNumeric().withMessage('Invalid token'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password is too short, minimun 8 characters'),
  body('password_confirmation').custom((value, { req }) => {
    if (value !== req.body.password) {
        throw new Error('The passwords are differents')
    }
    return true
  }),
  handleInputErrors,
  AuthController.updatePasswordWithToken
);

export default router;