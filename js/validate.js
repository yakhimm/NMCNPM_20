
const regex_fields = {
    name : /^([A-Z]|\S)[a-zA-Z\s]+/,
    username : /^\D[A-Za-z0-9_]+$/i,
    phone : /^0[0-9]{9}/,
    email : /^[a-z][a-z\d_\.]{5,32}@[a-z\d]{2,}(\.[a-z0-9]{2,}){1,3}$/,
};

const error_messages = {
    name : "Họ tên không dấu, không bắt đầu bằng khoảng trắng, không chứa ký số và ký tự đầu phải viết hoa",
    username : "Không được có khoảng trắng, chỉ gồm các ký tự, ký số và dấu _, không được bắt đầu bằng ký số",
    phone : "Số điện thoại phải theo chuẩn 10 số, bắt đầu bằng số 0",
    email : "Email không đúng chuẩn",
    // re_pass : "Mật khẩu xác nhận không trùng khớp",
};

$('.signup-form').submit( (e) => {
    
    const keys = document.querySelectorAll("input[id$='Regex']");
    const agree = document.querySelector("input[id='agree-term']");
    console.log(keys);
    
    var bool = true;
    for (var item of keys) {
       
        if (regex_fields[item.attributes.name.value].test(item.value)) {
            console.log(item.attributes.name.value + ': ' + bool);
            item.style.borderColor = "black";
        }
        else {
            item.style.borderColor = "red";
            console.log(item.attributes.name.value + ': false');
            let msg = `Error: ${error_messages[item.attributes.name.value]}`;
            setTimeout(alertMsg(msg), 5000);
            e.preventDefault();
        }
    }

    const password = document.getElementById('pass');
    const rePassword = document.getElementById('re_pass');

    if (!checkPassword(password, rePassword)) {
        e.preventDefault();
        // console.log(error_messages[re_pass]);
        rePassword.style.borderColor = "red";
        msg = `Error: Mật khẩu xác nhận không trùng khớp`;
        setTimeout(alertMsg(msg), 5000);
    }
})

function alertMsg (msg) {
    alert(msg);
}

function checkPassword(pwd, re_pwd) {
    return pwd.value === re_pwd.value;
}


$('.signin-form').submit( (e) => {

    const keys = document.querySelectorAll("input[id$='Regex']");
    console.log(keys);
    
    var bool = true;
    for (var item of keys) {
       
        if (regex_fields[item.attributes.name.value].test(item.value)) {
            console.log(item.attributes.name.value + ': ' + bool);
        }
        else {
            console.log(item.attributes.name.value + ': false');
            item.style.borderColor = "red";
            let msg = `${item.attributes.name.value}: ${error_messages[item.attributes.name.value]}`;
            // setTimeout(alertMsg(msg), 5000);s
            alertBox(msg);
            e.preventDefault();
        }
    }
})

const alertBox = (msg) => {
    const alertContainer = document.querySelector('.alert-box');
    const alertMsg = document.querySelector('.alert');

    alertMsg.innerHTML = msg;

    alertContainer.style.top = '5%';
    setTimeout(() => {
        alertContainer.style.top = null;
    }, 5000);
}

