const userM = require('../models/users.m');
const CryptoJS = require("crypto-js");
const hashLength = 64 //bytes

exports.getAll = async (req, res, next) => {
    // const us = await userM.all();
    res.redirect('/users/signin');
    next();
}

exports.signin = async (req, res, next) => {
    res.render('users/signin');
};

exports.admin = async (req, res, next) => {
    console.log(req.session);
    if (!req.session.uid) {
        return res.redirect('/users/signin');
    }
    res.redirect('/');
};

exports.add = async (req, res, next) => {
    const u = {
        username: 'uNew',
        password: '123'
    };
    const uNew = await userM.add(u);
    next();
}

exports.postSignin = async (req, res, next) => {

    const usn = req.body.username;
    const pwd = req.body.password;

    console.log('signin');
    const userDb = await userM.byName(usn);

    const pwdDb = userDb.password;
    const salt = pwdDb.slice(hashLength);
    const pwdSalt = pwd + salt;
    const pwdHashed = CryptoJS.SHA3(pwdSalt, { outputLength: hashLength * 4 }).toString(CryptoJS.enc.Hex); // 1 kết quả mã hóa ra 1 mảng bytes, cần chuyển sang chuỗi -> sử dụng luôn hàm toString
    
    console.log(pwdDb === (pwdHashed + salt));
    if (pwdDb === (pwdHashed + salt)) {
        res.render('home');
    }
    else {
        res.redirect('/users/signin');
        alert("Đăng nhập sai, vui lòng thử lại");
    }

    // switch (req.body.signin) {
    //     case 'signin':
    //     {
    //         console.log('signin');
    //         const userDb = await userM.byName(usn);

    //         const pwdDb = userDb.password;
    //         const salt = pwdDb.slice(hashLength);
    //         const pwdSalt = pwd + salt;
    //         const pwdHashed = CryptoJS.SHA3(pwdSalt, { outputLength: hashLength * 4 }).toString(CryptoJS.enc.Hex); // 1 kết quả mã hóa ra 1 mảng bytes, cần chuyển sang chuỗi -> sử dụng luôn hàm toString
            
    //         console.log(pwdDb === (pwdHashed + salt));
    //         if (pwdDb === (pwdHashed + salt)) {
    //             res.render('home');
    //         }
    //         else {
    //             alert("Đăng nhập sai, vui lòng thử lại");
    //             res.redirect('/users/signin')
    //         }
    //     }
    //     break;
    //     case 'register':
    //     {
    //         console.log('register');
            
    //         const salt = Date.now().toString(16); // sử dụng toString để chuyển sang cơ số hex ~ 16 thì dùng toString(16)
    //         const pwdSalt = pwd + salt;

    //         // chuyen pwd ve 64 kytu hexa, moi kytu hexa (0->F) co 4bit ~ 16 giatri
    //         // 1 kytu thuong (thuan) thi co 256 gia tri ~ 8bit
    //         const pwdHashed = CryptoJS.SHA3(pwdSalt, { outputLength: hashLength * 4 }).toString(CryptoJS.enc.Hex); // 1 kết quả mã hóa ra 1 mảng bytes, cần chuyển sang chuỗi -> sử dụng luôn hàm toString
            
    //         const user = {
    //             username: usn,
    //             password: pwdHashed + salt // lưu password đã hash và salt
    //         };
            
    //         const newUser = await userM.add(user);
    //         res.redirect('/user/signin');
    //     }
    //     break;
    //     case 'temp':
    //     {
    //         //logout
    //         req.session.destroy(); //xóa toàn bộ session
    //     }

    // }
}


exports.postSignup = async (req, res, next) => {

    const fulln = req.body.fullname,
        usn = req.body.username,
        phone = req.body.phone,
        email = req.body.email,
        addr = req.body.addr,
        pwd = req.body.pass;

    
   // const userDb = await userM.byName(usn);
    // console.log(userDb);
    // console.log("check usn");
    // // if (userDb )

    const salt = Date.now().toString(16); // sử dụng toString để chuyển sang cơ số hex ~ 16 thì dùng toString(16)
    const pwdSalt = pwd + salt;

    // chuyen pwd ve 64 kytu hexa, moi kytu hexa (0->F) co 4bit ~ 16 giatri
    // 1 kytu thuong (thuan) thi co 256 gia tri ~ 8bit
    const pwdHashed = CryptoJS.SHA3(pwdSalt, { outputLength: hashLength * 4 }).toString(CryptoJS.enc.Hex); // 1 kết quả mã hóa ra 1 mảng bytes, cần chuyển sang chuỗi -> sử dụng luôn hàm toString
    

    const user = {
        fullname : fulln,
        username: usn,
        phone : phone,
        email : email,
        address : addr,
        password: pwdHashed + salt // lưu password đã hash và salt
    };
    
    const newUser = await userM.add(user);
    res.redirect('/users/signin');
}