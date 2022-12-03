const hashService = require("../services/hash-service");
const otpService = require("../services/otp-service");
const userService = require("../services/user-service");
const tokenService = require("../services/token-service");
const UserDto = require('../dtos/user-dto')


class AuthController {

    async sendOtp(req, res) {
        //logic

        const {
            phone
        } = req.body;

        if (!phone) {
            res.status(400).json({
                message: "Phone field is required"
            })
        }

        const otp = await otpService.generateOtp();

        const ttl = 1000 * 60 * 2 * 1000000;

        const expires = Date.now() + ttl;

        const data = `${phone}.${otp}.${expires}`;

        const hash = hashService.hashOtp(data);

        //send otp
        try {
            //await otpService.sendBySms(phone, otp);
            res.json({
                hash: `${hash}.${expires}`,
                phone,
                otp
            })
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: 'message sending failed'
            })
        }

    }

    async verifyOtp(req, res) {

        const {
            otp,
            hash,
            phone
        } = req.body;

        if (!otp || !hash || !phone) {
            res.status(400).json({
                message: "All fields are required"
            })
        }

        const [hashedOtp, expires] = hash.split(".");

        if (Date.now() > +expires) {
            res.status(400).json({
                message: "Otp expired"
            })
        }

        const data = `${phone}.${otp}.${expires}`;

        const isValid = otpService.verifyOtp(hashedOtp, data);

        if (!isValid) {
            res.status(400).json({
                message: "Invalid OTP"
            })
        }

        let user;

        try {
            user = await userService.findUser({
                phone
            })
            if (!user) {
                user = await userService.createUser({
                    phone
                });
            }
        } catch (err) {
            console.log(err);

            res.status(500).json({
                message: "Server error"
            })
        }

        let {
            accessToken,
            refreshToken
        } = tokenService.generateTokens({
            _id: user._id,
            activated: false
        });

        await tokenService.storeRefreshToken(refreshToken, user._id)

        res.cookie('refreshtoken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true
        })

        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true
        })

        const userDto = new UserDto(user);

        res.json({
            user: userDto,
            auth: true
        })








    }

    async refresh(req, res) {

        //get refresh token from cookie

        //console.log("refreh started",req.cookies);

        const {
            refreshtoken: refreshTokenFromCookie
        } = req.cookies;

        let userData;

        //check if token valid

        //console.log("got refresh token ",refreshTokenFromCookie);

        try {
            userData = await tokenService.verifyRefreshToken(refreshTokenFromCookie)
        } catch (err) {
            //console.log("faileddddd");
            return res.status(401).json({
                message: "Invalid token"
            })
        }

        // console.log("verified")


        //check token in db
        try {
            const token = await tokenService.findRefreshToken(userData._id, refreshTokenFromCookie);

            if (!token) {
                return res.status(401).json({
                    message: "Invalid token"
                })
            }
        } catch (err) {
            return res.status(500).json({
                message: "Internal Error"
            })
        }

        //check if valid user

        const user = await userService.findUser({
            _id: userData._id
        })

        if (!user) {
            return res.status(404).json({
                message: "No user"
            })
        }

        //generate new tokens

        const {
            accessToken,
            refreshToken
        } = tokenService.generateTokens({
            _id: userData._id
        })

        //update refresh token

        try {
            await tokenService.updateRefreshToken(userData._id, refreshToken)
        } catch (err) {
            return res.status(500).json({
                message: "Internal Error"
            })
        }


        //put in cookie

        res.cookie('refreshtoken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true
        })

        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true
        })

        const userDto = new UserDto(user);

        res.json({
            user: userDto,
            auth: true
        })


        //response

    }

    async logout(req, res) {
        //delete refresh token from db

        const {
            refreshtoken
        } = req.cookies;

        await tokenService.removeToken(refreshtoken);

        //delete cookie

        res.clearCookie('refreshtoken');
        res.clearCookie('accessToken');

        res.json({
            user: null,
            auth: false
        })
    }
}

module.exports = new AuthController();