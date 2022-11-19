import {body} from "express-validator";

export const registerValidation = [
	body('email').isEmail(),
	body('password').isLength({min: 5 }),
	body('fullName').isLength({min: 3 }),
	body('avatarUrl').optional().isURL(),
]

export const loginValidation = [
	body('email').isEmail(),
	body('password').isLength({min: 5 }),
]

export const postCreateValidation = [
	body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
	body('text', 'Введите текст статьи').isLength({ min: 3 }).isString(),
	body('tags', 'Неверный формат тэгов').optional().isString(),
	body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
];
