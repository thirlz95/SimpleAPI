const jwt = require('jsonwebtoken');
const config = require('config');

function auth(req, res, next) {
  // get token from header
  const token = req.header('x-auth-token');
  console.log('!!!!!!!', req.body);
  console.log('Token exist in request?', token);
  if (!token) {
    return res.status(401).json({ msg: 'No Token, auth denied' });
  }
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
}

// fix this auth...
const authRole = async (req, res, next) => {
  const user = await User.findById(req).select('-password');
  console.log('oioi', user.role);
  if (user.role !== 'admin') {
    res.status(401).json({ msg: 'Token is not valid' });
  }
  try {
    next();
  } catch (err) {
    res.status(401).json({ msg: 'user does not have admin permissions' });
  }
};

module.exports = {
  auth,
  authRole
};
