
// valid còn sai số điện thoại: >10 số -> đúng ??? , username:  trường hợp 1 ký tự -> sai
const regex_fields = {
    fullname: /^([A-Z]|\S)[a-zA-Z\s]+/,
    username: /^\D[A-Za-z0-9_]+$/i,
    phone: /^0[0-9]{9}/,
    email: /^[a-z][a-z\d_\.]{5,32}@[a-z\d]{2,}(\.[a-z0-9]{2,}){1,3}$/,
};

const error_messages = {
    fullname: "Họ tên không dấu, không bắt đầu bằng khoảng trắng, không chứa ký số và ký tự đầu phải viết hoa",
    username: "Không được có khoảng trắng, chỉ gồm các ký tự, ký số và dấu _, không được bắt đầu bằng ký số",
    phone: "Số điện thoại phải theo chuẩn 10 số, bắt đầu bằng số 0",
    email: "Email không đúng chuẩn",
    repass: "Mật khẩu xác nhận không trùng khớp",
};

function checkPassword(pwd, re_pwd) {
    return pwd.value === re_pwd.value;
}

$('.signin-form').submit((e) => {

    const userInput = document.querySelector("input[id='userRegex']");

    var bool = true;

    let name = userInput.attributes.name.value
    if (regex_fields[name].test(userInput.value)) {
        console.log(name + ': ' + bool);

        userInput.style.borderColor = null;
        $('span p[id="userErr"]').html("");
        $('span p[id="userErr"]').css("margin-top", "0");
    }
    else {
        console.log(name + ': false');
        userInput.style.borderColor = "red";
        $('span p[id="userErr"]').html(error_messages[name]);
        $('span p[id="userErr"]').css("margin-top", "-10px");
        e.preventDefault();
    }
})

$('.signup-form').submit((e) => {

    const keys = document.querySelectorAll('input[id$="Regex"]');

    console.log(keys);

    var bool = true;

    for (var item of keys) {

        let name = item.attributes.name.value;
        // console.log(`${name}Valid`);
        console.log(item.value);
        console.log(name);

        if (regex_fields[name].test(item.value)) {
            console.log(name + ': ' + bool);
            item.style.borderColor = null;
            $(`span p[id="${name}Valid"]`).html("");
            $(`span p[id="${name}Valid"]`).css("margin-top", "0");
        }
        else {
            item.style.borderColor = "red";
            console.log(name + ': false');

            $(`span p[id="${name}Valid"]`).html(error_messages[name]);
            $(`span p[id="${name}Valid"]`).css("margin-top", "10px");
            e.preventDefault();
        }
    }



    const password = document.getElementById('pass');
    const rePassword = document.getElementById('repass');

    if (password && rePassword) {
        if (!checkPassword(password, rePassword)) {
    
            rePassword.style.borderColor = "red";
            $('span p[id="repassValid"]').html(error_messages["repass"]);
            $('span p[id="repassValid"]').css("margin-top", "-10px");
            e.preventDefault();
        }
        else {
            rePassword.style.borderColor = null;
            $('span p[id="repassValid"]').html("");
            $('span p[id="repassValid"]').css("margin-top", "0");
        }
    }
})
