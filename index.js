import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from 'cors';
import {registerValidation, loginValidation} from "./validations/auth.js";
import checkAuth from "./utils/checkAuth.js";
import handleValidationsErrors from "./utils/handleValidationsErrors.js";
import {postCreateValidation} from "./validations/post.js";
import {register, login, getMe} from "./controllers/UserContoroller.js";
import {
	create,
	getAll,
	getOne,
	remove,
	update,
	getLastTags
} from "./controllers/PostController.js";

mongoose
	.connect(
		"mongodb+srv://admin:wwwwww@cluster0.dac0w.mongodb.net/blog?retryWrites=true&w=majority"
	)
	.then(() => console.log("DB ok"))
	.catch((err) => console.log("DB error", err));

const app = express();

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		cb(null, "uploads");
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname);
	},
});

const upload = multer({storage});

app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(cors());

app.post(
	"/auth/register",
	registerValidation,
	handleValidationsErrors,
	register
);
app.post("/auth/login", loginValidation, handleValidationsErrors, login);
app.get("/auth/me", checkAuth, getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	});
});

app.post(
	"/posts",
	checkAuth,
	postCreateValidation,
	handleValidationsErrors,
	create
);
app.get("/posts", getAll);
app.get("/posts/:id", getOne);
app.delete("/posts/:id", checkAuth, remove);
app.patch(
	"/posts/:id",
	checkAuth,
	postCreateValidation,
	handleValidationsErrors,
	update
);
app.get("/tags", getLastTags);

app.listen(4444, (err) => {
	if (err) {
		return console.log(err);
	}
	
	console.log("Server OK");
});
