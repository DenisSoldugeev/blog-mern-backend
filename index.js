import express from 'express';
import fs from 'fs';
import multer from 'multer';
import cors from 'cors';
import mongoose from "mongoose";

import {loginValidation, postCreateValidation, registerValidation} from "./validations/validations.js";
import CheckAuth from "./utils/checkAuth.js";
import {getMe, login, register} from "./controllers/UserController.js";
import checkAuth from "./utils/checkAuth.js";
import {create, getAll, getLastTags, getOne, remove, update} from "./controllers/PostContoller.js";
import {handleValidationErrors} from "./utils/index.js";


mongoose
	.connect('mongodb+srv://admin:keklolkek@cluster0.pjm3elu.mongodb.net/blog?retryWrites=true&w=majority')
	.then(() => {
		console.log("DB ok")
	})
	.catch(err => console.log("DB error", err))

const app = express();


const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		if (!fs.existsSync('uploads')) {
			fs.mkdirSync('uploads');
		}
		cb(null, 'uploads');
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage });


app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post('/auth/login', loginValidation, login)
app.post('/auth/register', registerValidation, register);
app.get('/auth/me', CheckAuth, getMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	});
});

app.get('/tags', getLastTags);

app.get('/posts', getAll);
app.get('/posts/tags', getLastTags);
app.get('/posts/:id', getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, create);
app.delete('/posts/:id', checkAuth, remove);
app.patch(
	'/posts/:id',
	checkAuth,
	postCreateValidation,
	handleValidationErrors,
	update,
);

app.listen(4444, (err) => {
	if (err) {
		return console.log(err);
	}
	
	console.log('Server OK')
});
