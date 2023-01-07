const userM = require('../models/users.m');
const CryptoJS = require("crypto-js");
const hashLength = 64 //bytes

exports.getAll = async (req, res, next) => {
   
    res.render('users/signin', {
        layout: 'option01_layouts'
    });
}

exports.getSignin = async (req, res, next) => {

    if (req.session.user) { // da dang nhap thi chuyen ve trang chu
        return res.redirect("/");
    }

    res.render('users/signin', {
        layout: 'option01_layouts'
    });
}

exports.getSignup = async (req, res, next) => {

    if (req.session.user) { // da dang nhap thi chuyen ve trang chu
        return res.redirect("/");
    }

    res.render('users/signup', {
        layout: 'option01_layouts'
    });
}

// exports.admin = async (req, res, next) => {
//     console.log(req.session);
//     if (!req.session.uid) {
//         return res.redirect('/signin');
//     }
//     res.redirect('/');
// };

// exports.add = async (req, res, next) => {
//     const u = {
//         username: 'uNew',
//         password: '123'
//     };
//     const uNew = await userM.add(u);
// 
// }

exports.postSignin = async (req, res, next) => {

    const usn = req.body.username;
    const pwd = req.body.password;

    console.log('signin');
    const userDb = await userM.getAll(usn);

    if (!userDb || !userDb?.length) {
        return res.render('users/signin', {
            layout: 'option01_layouts',
            error: 'No user found'
        });
    };

    const checkUser = userDb.find( (user) => {
        return user.username == usn;
    });

    // check username
    if (!checkUser) {
        return res.render('users/signin', {
            layout: 'option01_layouts',
            usnErr: 'Username does not exist'
        });
    }

    // password
    const pwdDb = checkUser.password;
    const salt = pwdDb.slice(hashLength);
    const pwdSalt = pwd + salt;
    const pwdHashed = CryptoJS.SHA3(pwdSalt, { outputLength: hashLength * 4 }).toString(CryptoJS.enc.Hex); // 1 kết quả mã hóa ra 1 mảng bytes, cần chuyển sang chuỗi -> sử dụng luôn hàm toString
        
    console.log(pwdDb === (pwdHashed + salt));
    if (pwdDb === (pwdHashed + salt)) {
        res.render('home', {
            signin: true
        });
        // res.redirect("/");
    }
    else {
        res.render('users/signin', {
            layout: 'option01_layouts',
            pwdErr: 'Password is incorrect'
        });
    }

    req.session.user = checkUser;
    // console.log(req.session.user);
}

exports.postSignup = async (req, res, next) => {

    const fulln = req.body.fullname,
        usn = req.body.username,
        phone = req.body.phone,
        email = req.body.email,
        addr = req.body.addr,
        pwd = req.body.pass,
        re_pwd = req.body.re_pass;
    
    const userDb = await userM.getAll(usn);
    
    const checkUser = userDb.find( (user) => {
        return user.username == usn;
    });

    if (checkUser) {
       return res.render('users/signup', {
            layout: 'option01_layouts',
            usnErr: 'Username has already existed'
        });
    }

    const checkPass = pwd === re_pwd;

    if (!checkPass) {
        return res.render('users/signup', {
            layout: 'option01_layouts',
            rePwdErr: 'Password confirmation does not match password'
        })
    }
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
    res.redirect('/signin');
}

exports.logout = async (res, req, next) => {
    req.session.user = null;
    res.redirect("/")
}