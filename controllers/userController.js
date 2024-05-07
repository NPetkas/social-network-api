const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');


module.exports = {
  // Get all users
  async getUsers(req, res) {
    try {
      const users = await User.find({});
      res.status(200).json(users);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // Get a single user
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .select('-__v');
        res.status(200).json(user);
      } catch (err) {
        console.error(err);
        res.status(500).json(err);
      }
    },

  // create a new user
  async createUser(req, res) {
    try {
      const newUser = await User.create(req.body);
      res.status(200).json(newUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Update a user by ID
  async updateUser(req, res) {
    try {
      const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
        runValidators: true,
        new: true
      });
     res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

 // Delete a user by ID
  async deleteUser(req, res) {
    try {
      const deleteUser = await User.findOneAndRemove({ _id: req.params.userId });

      if (!deleteUser) {
        return res.status(404).json({ message: 'No such user exists' });
      }

      await Thought.deleteMany({ username: deleteUser.username });
      res.status(200).json({
        message: 'User and associated thoughts deleted successfully',
        deleteUser
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Add a friend to a user
  async addFriend(req, res) {
    console.log('You are adding a friend');
    console.log(req.body);

    try {
      const userFriend = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.body.friendsId || req.params.friendsId } },
        { runValidators: true, new: true }
      );

      if (!userFriend) {
        return res
          .status(404)
          .json({ message: 'No user found with that ID :(' });
      }

      res.json(userFriend);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Remove friend from a user
  async removeFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendsId } },
        { runValidators: true, new: true }
      );

      if (!user) {
        return res
          .status(404)
          .json({ message: 'No user found with that ID :(' });
      }

      const removeFriend = !user.friends.includes(req.params.friendsId);
      res.status(200).json({ message: 'Friend removed from friend list', user });

      res.json(removeFriend);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
