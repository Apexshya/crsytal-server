const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const { RequestHandler } = require("express");
const { Types } = require("mongoose");
const User = require("../models/User");

// Helper function to create JWT token
const createToken = (_id,email) => {
  return jwt.sign({ _id, }, process.env.JWT_SECRET || "", { expiresIn: "1y" });
};

// Function to handle social sign in (e.g., Google login)
const signInSocial = async (email, firstName, lastName, picture) => {
  try {
    const fullName = `${firstName} ${lastName ? lastName:''}`
    // Attempt to sign up the user with social login
    const user = await User.signup("social-login-user", email, fullName, '_' ,picture);
    // Create and return a token after successful sign-up
    const token = createToken(user._id,user.email);
    return { token, email: user.email };
  } catch (err) {
    return { error: "Error happened while signing up the user" };
  }
};

// Function to initialize Google sign-in process
const initSigninGoogle = async (req, res) => {
  try {
    const { id_token } = req.body;

    // Initialize Google OAuth client
    const client = new OAuth2Client();

    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.CLIENT_ID, // Ensure CLIENT_ID is in your environment variables
    });

    const payload = ticket.getPayload();

    // Destructure necessary fields from payload
    const {
      given_name: firstName,
      family_name: lastName,
      email,
      picture,
    } = payload || {};

    // Handle sign in with social details
    const { token, error } = await signInSocial(email, firstName, lastName, picture);

    if (error) {
      console.error("Error during social sign in:", error);
      return res.status(500).json({ error: "Error during social login" });
    }

    // Successfully created a token, return it along with email
    return res.status(200).json({ email, token });
  } catch (err) {
    console.error("Error in Google sign-in:", err);
    return res.status(401).json({ error: "Could not login with Google" });
  }
};

// Export the function to be used in routes
const signInWithGoogle = initSigninGoogle;

module.exports = {
  signInWithGoogle,
};
