const { model, Schema} = require("mongoose")

const ProfileSchema = new Schema ({
    imageId:{
        type: String,
        required: true
    },
    imageUrl:{
        type: String,
        required: true
    },
    user:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Account",
    },
},  {timestamps: true}
);

const ProfileModel = model("Profile", ProfileSchema)
module.exports = ProfileModel;