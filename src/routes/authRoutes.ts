import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { handleInputErrors } from '../middleware/validation';
import { body } from 'express-validator';

const router = Router();

router.post('/create-account',
    body('name')
        .notEmpty().withMessage('Name cannot be empty'),
    body('password')
        .isLength({ min: 8 }).withMessage('Password is too short, minimun 8 characters'),
    body('password_confirmation').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('The passwords are differents')
        }
        return true
    }),
    body('email')
        .isEmail().withMessage('E-mail is not valid'),
    handleInputErrors,
    AuthController.createAccount
);

router.post('/confirm-account',
    body('token')
        .notEmpty().withMessage('Token cannot be empty'),
    handleInputErrors,
    AuthController.confirmAccount
);

router.post('/login',
    body('email')
        .isEmail().withMessage('E-mail is not valid'),
    body('password')
        .notEmpty().withMessage('password cannot be empty'),
    handleInputErrors,
    AuthController.login
);

router.post('/request-code',
    body('email')
        .isEmail().withMessage('E-mail no válido'),
    handleInputErrors,
    AuthController.requestConfirmationCode
);

router.post('/forgot-password',
    body('email')
        .isEmail().withMessage('Incorrect e-mail'),
        handleInputErrors,
        AuthController.forgotPassword
);

router.post('/validate-token',
    body('token')
        .notEmpty().withMessage('Token not be empty'),
    handleInputErrors,
    AuthController.validateToken
);

export default router;