import jwt from 'jsonwebtoken';

/**
 * Generates a signed JWT token containing the user's ID.
 * @param {string} id - The MongoDB User ID
 * @returns {string} - Signed JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export default generateToken;
