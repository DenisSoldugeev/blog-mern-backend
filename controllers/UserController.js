import {validationResult} from "express-validator";
import bcrypt from "bcrypt";
import UserModal from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array())
		}
		
		const password = req.body.password
		const salt = await bcrypt.genSalt(10)
		const hash = await bcrypt.hash(password, salt)
		
		const doc = new UserModal({
			email: req.body.email,
			fullName: req.body.fullName,
			avatarUrl: req.body.avatarUrl,
			passwordHash: hash
		})
		
		const user = await doc.save()
		
		const token = jwt.sign({
				_id: user._id,
			},
			'secret123',
			{
				expiresIn: '30d'
			}
		)
		const {passwordHash, 	__v, ...UserData} = user._doc
		
		res.json({
			...UserData,
			token,
		})
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: "Не удалось зарегистрироваться"
		})
	}
}

export const login = async (req, res) => {
	try {
		const user = await  UserModal.findOne({email: req.body.email})
		
		if (!user) {
			return res.status(404).json({
				message: "Пользователь не найден"
			})
		}
		
		const isValidPassword = await bcrypt.compare(req.body.password, user._doc.passwordHash)
		
		if (!isValidPassword) {
			return res.status(401).json({
				message: "Неверный Email или пароль"
			})
		}
		
		const token = jwt.sign({
				_id: user._id,
			},
			'secret123',
			{
				expiresIn: '30d'
			}
		)
		const {passwordHash, 	__v, ...UserData} = user._doc
		
		res.json({
			...UserData,
			token,
		})
		
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: "Не удалось авторизоваться "
		})
	}
}

export const getMe = async (req, res) => {
	try {
		const user = await UserModal.findById(req.userId)
		
		if  (!user) {
			return res.status(404).json({
				message: "Пользователь не найден"
			})
		}
		
		const {passwordHash, 	__v, ...UserData} = user._doc
		
		res.json(UserData)
		
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: "Нет Доступа"
		})
	}
}
