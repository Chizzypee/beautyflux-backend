const { model, Schema} = require("mongoose")

const AccountSchema = new Schema ({
    firstName:{
        type: String,
        require: true
    },
    lastName:{
        type: String,
        require: true
    },
    middleName:{
        type: String,
        require: true
    },
    number:{
        type: String,
        require: true,
        indexed: true
    },
    username:{
        type: String,
        require: true,
        unique: true
    },
    dateOfBirth:{
        type: String,
        require: true,
        indexed: true
    },
    origin:{
        type: String,
        require: true
    },
    education:{
        type: String,
        require: true
    },
    homeAddress:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true,
        unique: true,
        indexed: true
    },
    password:{
        type: String,
        require: true,
        indexed: true
    },
    refreshToken:{
        type:[]
    },
    type:{
        type: String,
        required: true,
        indexed: true,
        enum:["admin", "user"]
    },
    state:{
       type: String,
       required: true,
       enum: ["active", "suspended", "deactivated",],
       default: "active",  
    },
}, {timestamps: true}
)

const AccountModel = model("Account", AccountSchema)
module.exports = AccountModel;