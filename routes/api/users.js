const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../models/config/keys');

const User = require('../../models/User');

router.get('/test', (req, res) => res.json({ msg: 'users works' }));

router.post('/register', (req, res) => {
	console.log(req);
	User.findOne({ email: req.body.email }).then((user) => {
		if (user) {
			return res.status(400).json({ email: 'Email already exists' });
		} else {
			const avatar = gravatar.url(req.body.email, {
				s: '200', //Size
				r: 'pg', //Rating
				d: 'mm' //Default
			});
			const newUser = new User({
				name: req.body.name,
				email: req.body.email,
				avatar: avatar,
				password: req.body.password
			});

			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(newUser.password, salt, (err, hash) => {
					if (err) throw err;
					newUser.password = hash;
					newUser.save().then((user) => res.json(user)).catch((err) => console.log(err));
				});
			});
		}
	});
});

router.post('/login', (req, res) => {
	const email = req.body.email;
	const password = req.body.password;

	User.findOne({ email }).then((user) => {
		if (!user) {
			return res.status(404).json({ email: 'user not found' });
		}
		bcrypt.compare(password, user.password).then((isMatch) => {
			if (isMatch) {
				const payload = { id: user.id, name: user.name, avatar: user.avatar };

				jwt.sign(payload, 'secret', { expiresIn: 3600 }, (err, token) => {
					res.json({
						success: true,
						token: 'Bearer' + token
					});
				});
			} else {
				return res.status(400).json({ password: 'Password incorrect' });
			}
		});
	});
});

module.exports = router;
