import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
    email: {
        type: String,
        unique: [true, "Email already exists"],
        required: [true, "Email is required"],
    },

    username: {
        type: String,
        unique: [true, "Username already exists"],
        required: [true, "Username is required"],
/*         match: [/^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/, "Username is invalid, it should contain 8-20 alphanumeric characters and be unique!"], 
            DOESN'T WORK CORRECTLY, REMOVED INSTEAD*/
    },

    image: {
        type: String,
    },
});

const User = models.User || model("User", userSchema);

export default User