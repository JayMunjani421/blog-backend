const connection = require('../config/connection');
const jwt = require('jsonwebtoken');

const loginAdmin = async (req, resp) => {
  const { admin_email, password } = req.body;

  try {

    if (!admin_email || !password) {
      return resp.status(400).json({ message: 'Email and password are required.' });
    }

    connection.query('SELECT * FROM tbl_admin WHERE admin_email = ?', [admin_email], (error, results) => {
      if (error) {
        return resp.status(500).json({ status: false, message: error.message });
      }
      if (results.length === 0) {
        return resp.status(404).json({
          status: false,
          message: "Email Not Found!"
        });
      }

      const admin = results[0];
      // Compare plain text password directly
      if (password !== admin.password) {
        return resp.status(401).json({
          status: false,
          message: "Password not matched"
        });
      }

      // Generate JWT token for the authenticated user
      const token = jwt.sign({ admin_id: admin.admin_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      return resp.status(200).json({
        status: true,
        message: "Login successful...",
        data: {
          admin_email: admin.admin_email,
          username: admin.username,
          token: token
        }
      });
    });
  } catch (error) {
    return resp.status(500).json({ status: false, message: error.message });
  }
};

const adminProfile = async(req, resp) =>{
    const admin = req.admin;  // The admin ID and other information from the token

    if (!admin || !admin.admin_id) {
        return resp.status(400).json({ status: false, message: "Admin ID not found in token" });
    }

    connection.query('SELECT admin_id, username, admin_email FROM tbl_admin WHERE admin_id = ?', [admin.admin_id], (err, results) => {
        if (err) {
            return resp.status(500).json({ status: false, message: err.message });
        }

        if (results.length === 0) {
            return resp.status(404).json({ status: false, message: "Admin not found" });
        }

        const adminData = results[0];  // Get the first matching result
        return resp.status(200).json({
            status: true,
            message: "Profile accessed successfully",
            data: {
                ...adminData, 
                password: null  
            }
        });
    });
};

module.exports = {
  loginAdmin,
  adminProfile
}