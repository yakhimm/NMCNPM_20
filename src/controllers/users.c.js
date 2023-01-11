const userM = require('../models/users.m');
const allRecipesM = require('../models/recipes.m');
const CryptoJS = require("crypto-js");
const hashLength = 64 //bytes




exports.getAll = async (req, res, next) => {

    try {
        if (!req.session.user) {
            return res.render('users/signin', {
                layout: 'option01_layouts'
            });
        }

        return res.redirect('/home');
    } catch (error) {
        next(error);
    }
};

exports.getSignin = async (req, res, next) => {

    if (req.session.user) { // da dang nhap thi chuyen ve trang chu
        return res.redirect("/");
    }

    res.render('users/signin', {
        layout: 'option01_layouts'
    });
};

exports.getSignup = async (req, res, next) => {

    if (req.session.user) { // da dang nhap thi chuyen ve trang chu
        return res.redirect("/");
    }

    res.render('users/signup', {
        layout: 'option01_layouts'
    });
};

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
};

exports.postSignup = async (req, res, next) => {

    const fulln = req.body.fullname,
        usn = req.body.username,
        phone = req.body.phone,
        email = req.body.email,
        addr = req.body.addr,
        pwd = req.body.pass,
        re_pwd = req.body.re_pass;

    const userDb = await userM.getAll();

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

    let id;
    if (!userDb || !userDb?.length) {
        id = 0;
    }
    else
        id = userDb[userDb.length - 1].id + 1;

    const user = {
        id,
        fullname: fulln,
        username: usn,
        phone: phone,
        email: email,
        address: addr,
        password: pwdHashed + salt // lưu password đã hash và salt
    };

    const newUser = await userM.add(user);
    res.redirect('/signin');
};

exports.getLogout = async (req, res, next) => {
    // console.log(req.session.username);
    delete req.session.user;
    req.session.authenticated = false;
    res.redirect('/');
};

exports.getAccount = async (req, res, next) => {
    try {
        if (!req.session.user) {
            return res.render('users/signin', {
                layout: 'option01_layouts'
            });
        }

        const { id } = req.params;
        const favoriteRecipesDb = await allRecipesM.getAllFavoriteRecipesByUserID(req.session.user.id);

        const users = await userM.getAll();
        const user = users.find((u) => u.id === +id);

        res.render('users/account', {
            authenticated: req.session.authenticated,
            favorite_counts: favoriteRecipesDb.length,
            user: req.session.user,
            favorRecipes: favoriteRecipesDb,
            showCategorySide: true,
            layout: 'option02_layouts'
        })

    } catch (error) {
        next(error);
    }
};

exports.postAccount = async (req, res, next) => {
    try {
        if (!req.session.user) {
            return res.render('users/signin', {
                layout: 'option01_layouts'
            });
        }

        const { id } = req.params;

        const { fullname, phone, email, address } = req.body;

        const u = {
            id: id,
            fullname: fullname,
            phone: phone,
            email: email,
            address: address
        };

        // cập nhật lại user trong session
        req.session.user = u;

        const uNew = await userM.editAccount(u, id);

        res.redirect(`/account/${id}`);
    } catch (error) {
        next(error);
    }
};

exports.getSetting = async (req, res, next) => {
    try {
        if (!req.session.user) {
            return res.render('users/signin', {
                layout: 'option01_layouts'
            });
        }

        const { id } = req.params;
        const favoriteRecipesDb = await allRecipesM.getAllFavoriteRecipesByUserID(req.session.user.id);

        const users = await userM.getAll();
        const user = users.find((u) => u.id === +id);

        res.render('users/setting', {
            authenticated: req.session.authenticated,
            favorite_counts: favoriteRecipesDb.length,
            favorRecipes: favoriteRecipesDb,
            user: req.session.user,
            showCategorySide: true,
            layout: 'option02_layouts'
        })

    } catch (error) {
        next(error);
    }
};

exports.postSetting = async (req, res, next) => {
    try {
        if (!req.session.user) {
            return res.render('users/signin', {
                layout: 'option01_layouts'
            });
        }

        const { id } = req.params;

        const { old_pw, new_pw, confirm_pw } = req.body;

        const users = await userM.getAll();
        const user = users.find((u) => u.id === +id);

        console.log(req.session.user);

        // const favoriteRecipesDb = await allRecipesM.getAllFavoriteRecipesByUserID(req.session.user.id);
        // console.log(favoriteRecipesDb);

        const pwdDb = user.password;
        const salt = pwdDb.slice(hashLength);
        const pwdSalt = old_pw + salt;
        const pwdHashed = CryptoJS.SHA3(pwdSalt, { outputLength: hashLength * 4 }).toString(CryptoJS.enc.Hex);

        if (pwdDb === (pwdHashed + salt)) {
            if (old_pw === new_pw) {
                return res.render('users/setting', {
                    authenticated: req.session.authenticated,
                    favorite_counts: favoriteRecipesDb.length,
                    favorRecipes: favoriteRecipesDb,
                    user: req.session.user,
                    showCategorySide: true,
                    error: "Mật khẩu mới không được trùng mật khẩu cũ",
                    layout: 'option02_layouts'
                })
            }
            else {
                if (new_pw !== confirm_pw) {
                    return res.render('users/setting', {
                        authenticated: req.session.authenticated,
                        favorite_counts: favoriteRecipesDb.length,
                        favorRecipes: favoriteRecipesDb,
                        user: req.session.user,
                        showCategorySide: true,
                        error: "Mật khẩu xác nhận không đúng",
                        layout: 'option02_layouts'
                    })
                }
                else {
                    const salt = Date.now().toString(16);
                    const pwdSalt = new_pw + salt;

                    const pwdHashed = CryptoJS.SHA3(pwdSalt, { outputLength: hashLength * 4 }).toString(CryptoJS.enc.Hex);
                    const pw = pwdHashed + salt;
                    const pwNew = await userM.editPassword(pw, id);

                    // xóa session
                    delete req.session.user;
                    delete req.session.authenticated;
                    return res.redirect('/signin');
                }
            }
        }
        else {
            return res.render('users/setting', {
                authenticated: req.session.authenticated,
                favorite_counts: favoriteRecipesDb.length,
                favorRecipes: favoriteRecipesDb,
                user: req.session.user,
                showCategorySide: true,
                error: "Mật khẩu cũ không đúng",
                layout: 'option02_layouts'
            })
        }
    } catch (error) {
        next(error);
    }
};