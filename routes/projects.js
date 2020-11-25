const express = require('express');
const router = express.Router();
const { auth, authRole } = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const Projects = require('../models/Projects');

// @route   get api/projects
// @desc    get all projects for admin role users
// @access  private
router.get('/', auth, async (req, res) => {
  try {
    console.log('check users role permissions', req.user);
    if (authRole(req.user.id)) {
      const project = await Projects.find({}).sort({
        date: -1
      });
      res.json(project);
    } else {
      const project = await Projects.find({ owner: req.user.id });
      res.json(project);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   post api/project
// @desc    add new contact
// @access  private
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Project name is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, description } = req.body;
    console.log('sender', req.user);
    try {
      const newProject = new Projects({
        name,
        description,
        owner: req.user.id,
        date: Date.now()
      });

      const project = await newProject.save();

      res.json(project);
    } catch (err) {
      console.error(err.message);
      res.status(500).json('Server Error');
    }
  }
);

// @route   delete api/project
// @desc    delete a project
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) return res.status(404).json({ msg: 'Project not found' });

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
