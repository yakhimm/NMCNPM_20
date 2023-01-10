const userM = require('../models/users.m');
const CryptoJS = require("crypto-js");
const hashLength = 64 //bytes

exports.getAll = async (req, res, next) => {

    // res.render('users/signin', {
    //     layout: 'option01_layouts'
    // });

    try {
        if (!req.session.user) {
            return res.render('users/signin', {
                layout: 'option01_layouts'
            });
        }
        console.log(req.session.username);
        return res.redirect('/home');
    } catch (error) {
        next(error);
    }
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

exports.postSignin = async (req, res, next) => {

    const usn = req.body.username;
    const pwd = req.body.password;

    const userDb = await userM.getAll(usn);

    if (!userDb || !userDb?.length) {
        return res.render('users/signin', {
            layout: 'option01_layouts',
            error: 'Không tìm thấy tài khoản'
        });
    };

    const checkUser = userDb.find((user) => {
        return user.username == usn;
    });

    // check username
    if (!checkUser) {
        return res.render('users/signin', {
            layout: 'option01_layouts',
            usnErr: 'Tên đăng nhập không tồn tại'
        });
    }

    // password
    const pwdDb = checkUser.password;
    const salt = pwdDb.slice(hashLength);
    const pwdSalt = pwd + salt;
    const pwdHashed = CryptoJS.SHA3(pwdSalt, { outputLength: hashLength * 4 }).toString(CryptoJS.enc.Hex); // 1 kết quả mã hóa ra 1 mảng bytes, cần chuyển sang chuỗi -> sử dụng luôn hàm toString

    if (pwdDb === (pwdHashed + salt)) {

        req.session.user = checkUser;
        req.session.authenticated = true;

        return res.redirect('/home');
    }
    else {
        res.render('users/signin', {
            layout: 'option01_layouts',
            pwdErr: 'Sai mật khẩu'
        });
    }
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

    const checkUser = userDb.find((user) => {
        return user.username == usn;
    });

    if (checkUser) {
        return res.render('users/signup', {
            layout: 'option01_layouts',
            usnErr: 'Tên đăng nhập đã tồn tại'
        });
    }

    const checkPass = pwd === re_pwd;

    if (!checkPass) {
        return res.render('users/signup', {
            layout: 'option01_layouts',
            rePwdErr: 'Mật khẩu xác nhận không trùng khớp'
        })
    }
    const salt = Date.now().toString(16); // sử dụng toString để chuyển sang cơ số hex ~ 16 thì dùng toString(16)
    const pwdSalt = pwd + salt;

    // chuyen pwd ve 64 kytu hexa, moi kytu hexa (0->F) co 4bit ~ 16 giatri
    // 1 kytu thuong (thuan) thi co 256 gia tri ~ 8bit
    const pwdHashed = CryptoJS.SHA3(pwdSalt, { outputLength: hashLength * 4 }).toString(CryptoJS.enc.Hex); // 1 kết quả mã hóa ra 1 mảng bytes, cần chuyển sang chuỗi -> sử dụng luôn hàm toString

    const user = {
        fullname: fulln,
        username: usn,
        phone: phone,
        email: email,
        address: addr,
        password: pwdHashed + salt // lưu password đã hash và salt
    };

    const newUser = await userM.add(user);
    res.redirect('/signin');
}

exports.getLogout = async (req, res, next) => {
    // console.log(req.session.username);
    delete req.session.user;
    req.session.authenticated = false;
    res.redirect('/');
}

exports.postAccount = async (req, res, next) => {

    try {
        if (!req.session.user) {
            return res.render('users/signin', {
                layout: 'option01_layouts'
            });
        }

        const { id } = req.body;
        console.log(id);

    } catch (error) {
        next(error);
    }
}