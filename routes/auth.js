const express = require('express');
const router = express.Router();
const config = require('config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// @route   get api/auth
// @desc    get loggedin user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   put api/auth
// @desc    change logged in user skills, bio and other assets
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { title, bio } = req.body;

  console.log('req.body', req.body);
  console.log('req.headers', req.headers);

  const skillsUpdate = {};
  if (title) skillsUpdate.title = title;

  const bioUpdate = {};
  if (bio) bioUpdate.bio = bio;

  try {
    let user = await User.findById(req.params.id);
    console.log('User Found?', user);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    if (title) {
      user = await User.findByIdAndUpdate(req.params.id, {
        $addToSet: { skills: skillsUpdate }
      });
    } else if (bio) {
      console.log('hit else if');
      user = await User.findByIdAndUpdate(req.params.id, bioUpdate, {
        upsert: true
      });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   post api/auth
// @desc    authorises user and gets jwt token
// @access  Public
router.post(
  '/',
  [check('email', 'Please Include a valid email').isEmail()],
  [check('password', 'Password is required').exists()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ msg: 'Invalid Credintals' });
      }
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ msg: 'invalid password' });
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 360000
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
