const { model, Schema} = require("mongoose")

const ProfileSchema = new Schema ({
    imageId:{
        type: string
    },
    imageUrl:{
        type: string
    },
},  {timestamps: true}
);
const AccountModel = model("Account", ProfileSchema)
module.exports = AccountModel;