require("dotenv").config();

export default {
  jwt: {
    secret: process.env.JWT_TOKEN as string,
    expiresIn: "1d",
  },
};
