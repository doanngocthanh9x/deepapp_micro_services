const express = require('express');
const router = express.Router();
const { User, Candidate } = require('../models');

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{ model: Candidate, required: false }],
    });
    res.json({
      success: true,
      data: users,
      count: users.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [{ model: Candidate, required: false }],
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST create new user
router.post('/', async (req, res) => {
  try {
    const { email, password_hash, user_type, full_name, phone, avatar_url } = req.body;

    if (!email || !password_hash || !user_type || !full_name) {
      return res.status(400).json({
        success: false,
        error: 'email, password_hash, user_type, and full_name are required',
      });
    }

    const user = await User.create({
      email,
      password_hash,
      user_type,
      full_name,
      phone,
      avatar_url,
    });

    res.status(201).json({
      success: true,
      data: user,
      message: 'User created successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// PUT update user
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    const { full_name, phone, avatar_url, is_verified, is_active } = req.body;
    await user.update({
      full_name: full_name || user.full_name,
      phone: phone || user.phone,
      avatar_url: avatar_url || user.avatar_url,
      is_verified: is_verified !== undefined ? is_verified : user.is_verified,
      is_active: is_active !== undefined ? is_active : user.is_active,
    });

    res.json({
      success: true,
      data: user,
      message: 'User updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    await user.destroy();
    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
