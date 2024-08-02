import { users } from '../dummyData/data.js';
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

const userResolver = {
  Mutation: {
    signUp: async (_, { input }, context) => {
      try {
        const { username, name, password, gender } = input;

        if (!username || !name || !password || !gender)
          throw new Error("All Fields are required.");

        const existingUser = await User.findOne({ username });
        if (existingUser) throw new Error("User already exists.");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // https://avatar-placeholder.iran.liara.run/
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
          username,
          name,
          password: hashedPassword,
          gender,
          profilePicture: gender === "male" ? boyProfilePic : girlProfilePic,
        });

        await newUser.save();
        await context.login(newUser);

        return newUser;
      } catch (err) {
        console.log("Error in signUp: ", err);
        throw newError(err.message || "Internal Server Error");
      }
    }, //End of signUp function

    login: async (_, { input }, context) => {
      try {
        const { username, password } = input;
        if (!username || !password) throw new Error("All Fields are required.");

        const { user } = await context.authenticate("graphql-local", { username, password });
        await context.login(user);

        return user;
      } catch (err) {
        console.log("Error in login", err);
        throw new Error(err.message || "Internal Server Error");
      }
    }, // End of login function

    logout: async (_, _, context) => {
      try {

      } catch (err) {
        console.log("Error in logout", err);
        throw new Error(err.message || "Internal Server Error");
      }
    }, // End of logout function
  },
  Query: {
    users: (_, _, { req, res }) => {
      return users;
    },

    user: (_, { userId }) => {
      return users.find((user) => user._id === userId);
    }
  },
};

export default userResolver;