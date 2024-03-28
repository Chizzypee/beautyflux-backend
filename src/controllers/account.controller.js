const { hashSync, compareSync } = require("bcryptjs");
const AccountModel = require("../models/account");
const jwt = require("jsonwebtoken");
const { config } = require("../config");
const {isEmailValid, isNumberValid} = require("../utils/validator");
// const {isNumberValid} = require("../utils/validator");
const {cloudinary} = require("../utils/cloudinary");
const ProfileModel = require("../models/profile.account");
const { APIError } = require("../middlewares/error.Api");

exports.register = async(req, res, next) =>{
    try {
        const {firstName, lastName, middleName, number, username, dateOfBirth, origin, education, homeAddress, email, password} = req.body;
        if(!firstName) return next(APIError.badRequest("Invalid email"))  
        if(!lastName)return next(APIError.badRequest("Invalid email")) //res.status(400).json({error: "Last name is required"});
        if(!middleName)return next(APIError.badRequest("Invalid email")) //res.status(400).json({error: "middle name is required"});
        if(!number)return next(APIError.badRequest("Invalid email")) //res.status(400).json({error: "number is required"});
        if(!username) return next(APIError.badRequest("Invalid email")) //res.status(400).json({error: "username is required"});
        if(!dateOfBirth) return next(APIError.badRequest("Invalid email")) //res.status(400).json({error: "date of birth is required"});
        if(!origin) return next(APIError.badRequest("Invalid email")) //res.status(400).json({error: "origin is required"});
        if(!education) return next(APIError.badRequest("Invalid email")) //res.status(400).json({error: "education is required"});
        if(!homeAddress) return next(APIError.badRequest("Invalid email")) ////res.status(400).json({error: "home address is required"});
        if(!email) return next(APIError.badRequest("Invalid email")) //res.status(400).json({error: "email is required"});
        if(!password) return next(APIError.badRequest("Invalid email")) //res.status(400).json({error: "password is required"});


        if(!isEmailValid(email)) return next(APIError.badRequest("Invalid email")) //return res.status(400).json({error: "invalid email"});
        if(!isNumberValid(number)) return next(APIError.badRequest("Invalid number")) //return res.status(400).json({error: "invalid number"});

        const emailExist = await AccountModel.findOne({email}).exec();
        if(emailExist) return next(APIError.badRequest("Email already exists")) //return res.status(400).json({error: "Email already exists"});

        const numberExist = await AccountModel.findOne({number}).exec();
        if(numberExist) return next(APIError.badRequest("Number already exist")) //return res.status(400).json({error: "number already exists"})

        const usernameExist = await AccountModel.findOne({username}).exec();
        if(usernameExist) return next(APIError.badRequest("Username exist")) //return res.status(400).json({error: "username already exits"});
    
        const hashedPassword = hashSync(password,10)
        const user = {
            firstName,
            lastName,
            middleName,
            number, 
            username, 
            dateOfBirth, 
            origin,
            education,
            homeAddress,
            email,
            password:hashedPassword,
            type: "user"
            }
        const newUser = await AccountModel.create({...user})
        if(!newUser) return next(APIError.badRequest("No user found")) //return res.status(400).json({error: "No user found"})
        res.status(201).json({success:true, msg: "account created successfully"})
    } catch (error) {
        next(error);
    }

}

exports.login = async(req,res, next) =>{
    try {
        let token = req.headers?.authorization?.split("")[1];  //set cookie upon login
        if(!token) token = req.cookie?.bflux;
        if(!token) token = req.headers?.cookie?.split("=")[1];
        
        // const token = req.body
        const{username, password} = req.body
        if(!username) return next(APIError.notFound("username is required")) 
        if(!password) return next(APIError.notFound("password is required")) 
        
        const userExist = await AccountModel.findOne({username})
        if(!userExist) return next(APIError.notFound("User not found")) 

        const checkUser = compareSync(password,userExist.password)
        if(!checkUser) return next(APIError.notFound("incorrect password"))
    
        if(userExist.refreshToken.length > 0) return next(APIError.notFound("You're already logged in"))
        if(userExist.state === "deactivated") return next(APIError.unauthorized("Account has been deactivated"));

    //authentication
    const payload = {
        id: userExist._id.toString(),
        email:userExist.email,
        role:userExist.type,
    };
    const accessToken = jwt.sign(payload,config.ACCESS_TOKEN_SECRET,{expiresIn:"15m"});
    // console.log(accessToken);
    const refreshToken = jwt.sign(payload, config.REFRESH_TOKEN_SECRET,{expiresIn: "30m"});
    userExist.refreshToken = [...userExist.refreshToken, refreshToken]
    userExist.save();

    res.cookie(
        "bflux", accessToken,{
            httpOnly:false,
            secure:true,
            sameSite: "none",
            maxAge: 60*60 * 1000

        }
    )
 return res.status(200).json({
        success:true,
        msg:"login successfully",
        user:{
            username:userExist.username,
            email:userExist.email,
            firstName:userExist.firstName,
            middleName:userExist.middleName,
            number:userExist.number,
            lastName:userExist.lastName,
            dateOfBirth:userExist.dateOfBirth,
            origin:userExist.origin,
            homeAddress:userExist.homeAddress,
            
        },
        accessToken,
        refreshToken
    })
    
    } catch (error) {
        next (error)
    }
    }

exports.updateProfile = async (req, res, next) =>{
    try {
        
        const {fileData} = req.body;
        // first image upload
        const profile = {};
        if(fileData){
            const result = await cloudinary.uploader.upload(fileData, (error, result) =>{
               if(error) return next(APIError.notFound(error));
               profile.imageId = result.public_id;
               profile.imageUrl = result.secure_url;
            });
        }
        console.log(profile);
        // save image url to database
        const saveImage = Profile.create({...profile});
        if(saveImage.error) return next(APIError.notFound(error));
        res.status(200).json({success: true, msg: "profile picture updated successfully"});
    } catch (error) {
       console.log(error);
       next(error);
    }
}

exports.uploadPicture = async (req,res) =>{
    try {
        if(!req.userId) return next(APIError.unauthenticated());
        if(!req.body.file) return next(APIError.badRequest("No file uploaded"));

        const user = await AccountModel.findOne({_id:req.userId}).exec();
        if(!user) return next(APIError.notFound("user does not exist"));

        //upload file to cloudinary
        const result = await cloudinary.uploader.upload(req.file);

        const profile = {
            imageId: result.public_id,
            imageUrl: result.secure_url,
            user: req.userId,
        }
        //return the url of the uploaded image
        const createPic = await ProfileModel.create({...profile});
        if(!createPic) return next(APIError.badRequest("Profile update failed, try again"));
        if(!createPic.error) return next(APIError.badRequest(createPic.error));
        res.status(200).json({success: true, msg: "profile updated successfully"});
    } catch (err) {
        next(err);
    }
}

exports.updateAccountState  = async (req, res, next) =>{
    try {
        const {id, state} = req.body;
        if(!id) return next(APIError.badRequest("Account ID is required"));
        if(!state) return next(APIError.badRequest("Account state is required"));

        const userExist = await AccountModel.findOne({_id:id.toString()});
        if(!userExist) return next(APIError.notFound());
        if(userExist.error) return next(APIError.badRequest(userExist.error));

        //update status
        userExist.state = state;
        userExist.save();
        res.status(200).json({success: true, msg: "Account state updated"})
    } catch (error) {
        next(error);
    }
}

exports.userAccounts = async (req, res, next) =>{
    try {
       const users = await AccountModel.find().exec(); //searching for users account but wont include thw admin account
       if(users.length === 0) return next(APIError.notFound()); 
       res.status(200).json({success: true, msg: "Found", users})
    } catch (error) {
        next(error);
    }
}
// _id:{$ne:req.userId}


exports.logout = async (req, res, next) => {
    try {
        let token = req.headers?.authorization?.split("")[1];
        if(!token) token = req.cookie?.bflux;
        if(!token) token = req.headers?.cookie?.split("=")[1];

        const {refreshToken} = req.body;
        if(!refreshToken) return res.status(400).json({error: "RefreshToken is required"});
        if(!token) return res.status(400).json({error: "AccessToken is required"});

        const checkToken = jwt.decode(token)
        if(!checkToken || checkToken.error) return next(APIError.unauthenticated());

        const foundUser = await AccountModel.findOne({refreshToken}).exec();
        //Detected refresh token reuse
        if(!foundUser) {
            jwt.verify(refreshToken,config.REFRESH_TOKEN_SECRET, async (err, decoded) =>{
                if(err) return next(APIError.unauthorized("Invalid refresh Token"));
                const usedToken = await AccountModel.findOne({_id:decoded.id}).exec();
                usedToken.refreshToken = [];
                usedToken.save();
            });
            return next(APIError.unauthorized("Invalid Refresh Token"));
        }

        const newRefreshTokenArr = foundUser.refreshToken.filter(rt => rt !== refreshToken);
        //evaluate jwt
        jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET, async (err, decoded) =>{
            if(err){
                foundUser.refreshToken = [...newRefreshTokenArr];
                foundUser.save();
            }
            if(err || foundUser._id.toString() !== decoded.id) return next(APIError.unauthenticated("Token expired"))
        });
        res.clearCookie("bflux");
        res
        .status(200)
        .json({success: true, msg: "You have successfully logged out"});
    } catch (error) {
        next(error);
    }
}

exports.refreshToken = async (req, res, next) =>{
    try {
        let token = req.headers?.authorization?.split("")[1];
        if(!token) token = req.headers?.cookie?.split("=")[1];
        const {refreshToken} = req.body;
        if(!refreshToken) return res.status(400).json({error: "Refresh token is required"});
        if(!token) return res.status(400).json({error: "Access token is required"});
        const checkToken = jwt.decode(token, config.ACCESS_TOKEN_SECRET) 
        if(!checkToken || checkToken.error) return next(APIError.unauthenticated());

        const foundUser = await AccountModel.findOne({refreshToken}).exec();
        //Detected refresh token reuse
        if(!foundUser){
            jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET, async (err, decode)=>{
                const usedToken = await AccountModel.findOne({_id:decode.id}).exec();
                usedToken.refreshToken = [];
                usedToken.save();
            });
            return next(APIError.unauthorized("Invalid Refresh Token"));
        }

        const newRefreshTokenArr = foundUser.refreshToken.filter(rt => rt !== refreshToken);
        //evaluate jwt
        jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET, async (err, decode)=>{
            if(err){
                foundUser.refreshToken = [...newRefreshTokenArr];
                foundUser.save();
            }
            if(err || foundUser.toString() !== decode.id) return next(APIError.unauthenticated("tOken expired"));
        });

        //Refresh token still valid

        const payload = {
            id: foundUser._id.toString(),
            email:foundUser.email,
            role:foundUser.type,
        };
        const accessToken = jwt.sign(payload,config.ACCESS_TOKEN_SECRET,{expiresIn:"15m"});
        const newRefreshToken = jwt.sign(payload, config.REFRESH_TOKEN_SECRET,{expiresIn: "30m"});
        foundUser.refreshToken = [...newRefreshTokenArr, newRefreshToken]
        foundUser.save();
        res.clearCookie("bflux");
        res.cookie(
            "bflux", accessToken,{
                httpOnly:false,
                secure:true,
                sameSite: "none",
                maxAge: 60*60 * 1000
    
            }
        )
        return res.status(200).json({
            success:true,
            msg:"RefreshToken Renewed",
            newRefreshToken,
            accessToken
        })

    } catch (error) {
       next(error) 
    }
}

exports.adminRegister = async (req, res, next) =>{
    try {
        const { firstName, lastName, username, email, password} = req.body;
        if(!firstName) return next(APIError.badRequest("Invalid firstname"));
        if(!lastName) return next(APIError.badRequest("Invalid lastnme"));
        if(!username) return next(APIError.badRequest("Invalid usernme"));
        if(!email) return next(APIError.badRequest("Invalid email"));
        if(!password) return next(APIError.badRequest("Invalid password"));

        if(!isEmailValid(email)) return next(APIError.badRequest("Invalid email"))

        const emailExist = await AccountModel.findOne({email}).exec();
        if(emailExist) return next(APIError.badRequest("Email already exists"))

        const usernameExist = await AccountModel.findOne({username}).exec();
        if(usernameExist) return next(APIError.badRequest("Username exist"))

        const admin = {
            firstName,
            lastName,
            number, 
            username, 
            email,
            password:hashedPassword,
            type: "admin"
            }
        const newAdmin = await AccountModel.create({...admin})
        if(!newAdmin) return next(APIError.badRequest("No admin found"));
        res.status(201).json({success:true, msg: "Admin account created successfully"})
    
    } catch (error) {
       next(error); 
    }
}