const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const Comments = require('../models/Comments');

// @route   get api/comments
// @desc    get all comments for admin role
// @access  private
router.get('/:id', auth, async (req, res) => {
  try {
    const comments = await Comments.find({ owner: req.user.id }).sort({
      date: -1
    });
    res.json(comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   post api/comments
// @desc    add new contact
// @access  private
router.post(
  '/:id',
  [
    auth,
    [
      check('comment', 'comment is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { comment, name } = req.body;
    try {
      const newComment = new Comments({
        name,
        comment,
        owner: req.user.id,
        date: Date.now()
      });

      const addedComment = await newComment.save();

      res.json(addedComment);
    } catch (err) {
      console.error(err.message);
      res.status(500).json('Server Error');
    }
  }
);

// @route   delete api/comments
// @desc    delete a specific comment
// @access  Private
//TODO: fix this for actual comment
router.delete('/:id', auth, async (req, res) => {
  try {
    let comment = await Comments.findById(req.params.id);

    if (!comment) return res.status(404).json({ msg: 'Project not found' });

    // Make sure user owns contacts
    if (contact.user.toString() !== req.user.id) {
      const alreadyRegistered = [
        { msg: 'You do not have the permissions to delete this project' }
      ];
      return res.status(401).json(alreadyRegistered);
    }

    await Projects.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Successfully deleted project' });
  } catch (err) {
    console.error(er.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
