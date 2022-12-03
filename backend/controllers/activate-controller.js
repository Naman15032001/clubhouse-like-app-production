// const Jimp = require('jimp');
// const path = require('path');
// const userService = require('../services/user-service');
// const UserDto = require('../dtos/user-dto');
// class ActivateController {

//     async activate(req, res) {

//         const {
//             name,
//             avatar
//         } = req.body;

//         if (!name || !avatar) {
//             res.status(400).json({
//                 message: "All fields required"
//             })
//         }

//         //image base64 

//         const buffer = Buffer.from(
//             avatar.replace(/^data:image\/png;base64,/, ''),
//             'base64'
//         );

//         const imagePath = `${Date.now()}-${Math.round(
//             Math.random() * 1e9
//         )}.png`;

//         try {

//             const jimpResp = await Jimp.read(buffer);

//             jimpResp.resize(150, Jimp.AUTO).write(path.resolve(__dirname, `../storage/${imagePath}`))

//         } catch (err) {
//             res.status(500).json({
//                 message: "Could not process the image"
//             })
//         }

//         //update user

//         console.log(req.user);

//         const userId = req.user._id

//         try {

//             const user = await userService.findUser({
//                 _id: userId
//             })

//             if (!user) {
//                 res.status(404).json({
//                     message: "User not found!"
//                 })
//             }

//             console.log("hello");

//             user.activated = true;

//             user.name = name;

//             user.avatar = `/storage/${imagePath}`;

//             user.save();

//             console.log("hello", user);

//             return res.json({
//                 user: new UserDto(user),
//                 auth: true
//             });
//         } catch (err) {
//             res.status(500).json({
//                 message: 'Something went wrong!'
//             });
//         }


//     }
// }

// module.exports = new ActivateController();

const Jimp = require('jimp');
const path = require('path');
const userService = require('../services/user-service');
const UserDto = require('../dtos/user-dto');

class ActivateController {
    async activate(req, res) {
        // Activation logic
        const {
            name,
            avatar
        } = req.body;
        if (!name || !avatar) {
            res.status(400).json({
                message: 'All fields are required!'
            });
        }

        // Image Base64
        const buffer = Buffer.from(
            avatar.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''),
            'base64'
        );

        console.log("buffer", buffer);
        const imagePath = `${Date.now()}-${Math.round(
            Math.random() * 1e9
        )}.png`;
        // 32478362874-3242342342343432.png

        try {

            console.log("hello11");


            const jimResp = await Jimp.read(buffer);

            console.log("hello12");

            jimResp
                .resize(50, Jimp.AUTO)
                .write(path.resolve(__dirname, `../storage/${imagePath}`));
            console.log("yes");
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: 'Could not process the image'
            });
        }

        const userId = req.user._id;
        // Update user
        try {
            const user = await userService.findUser({
                _id: userId
            });
            if (!user) {
                res.status(404).json({
                    message: 'User not found!'
                });
            }
            user.activated = true;
            user.name = name;
            user.avatar = `/storage/${imagePath}`;
            user.save();
            console.log("hello", user);
            res.json({
                user: new UserDto(user),
                auth: true
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: 'Something went wrong!'
            });
        }
    }
}

module.exports = new ActivateController();