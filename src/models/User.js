const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Please enter a full name'],
    },
    firstName: {
      type: String,
      required: [false, 'Please provide a first name'],
    },
    lastName: {
      type: String,
      required: [false, 'Please provide a last name'],
    },
    email: {
      type: String,
      required: [true, 'Please enter an email'],
      unique: true,
    },
    password: {
      type: String,
      select: false,
      required: [false, 'Please enter a password'],
      minlength: 6,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: [false, 'Please enter a gender'],
    },
    cover: {
      _id: {
        type: String,
      },
      url: { type: String },
      blurDataURL: {
        type: String,
      },
    },
    cart: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        color:String,
        size:String
      },
    ],
    wishlist: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
      },
    ],
    orders: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Order',
      },
    ],
    shop: { type: mongoose.Types.ObjectId, ref: 'SHop' },
    recentProducts: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
      },
    ],
    phone: {
      type: String,
      required: [false, 'Please provide a Phone Number.'],
      maxlength: [20, 'Phone cannot be more than 20 characters.'],
    },

    status: {
      type: String,
    },
    profileImage: {
      type: String,
    },
    address: {
      type: String,
    },
    apartment: {
      type: String,
    },
    city: {
      type: String,
    },
    zip: {
      type: String,
    },
    country: {
      type: String,
    },
    state: {
      type: String,
    },
    about: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    otp: {
      type: String,
      required: false,
    },
    lastOtpSentAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: ['super admin', 'admin', 'user','social-login-user'],
      required: true,
    },
  },
  {
    
      statics: {
        async signup(
          role,
          email,
          name,
          password,
          profileImage
        ) {
          if (!email || !name) {
            throw new CustomError("All fields must be filled", 400);
          }
          
          const existingUser = await this.findOne({ email });
          if (existingUser && role === "social-login-user") {
            existingUser.profileImage = profileImage;
            existingUser.role = "social-login-user";
            if (existingUser.password) {
              existingUser.password = undefined;
            }
            const updatedUser = await existingUser.save();
            return updatedUser;
          }
  
          if (existingUser && role !== "social-login-user") {
            throw new CustomError("Email already exist", 400);
          }
          let hash;
          if (password) {
            const salt = await bcrypt.genSalt(10);
            hash = await bcrypt.hash(password, salt);
          }
          const user = await this.create({
            role,
            email,
            password: hash,
            fullName:name,
            profileImage,
            emailVerified: role === "social-login-user" ? true : false,
          });
  
          return user;
        },
      },
    timestamps: true,
  }
);

// Hash the password before saving
UserSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }

    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    return next();
  } catch (error) {
    return next(error);
  }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
module.exports = User;
