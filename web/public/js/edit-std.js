//config to connect to firebase
// var config = {
//     apiKey: "AIzaSyDHN6epAFTpGwywxeqKpc1vzNERGLYfguE",
//     authDomain: "math-web-kmitl.firebaseapp.com",
//     databaseURL: "https://math-web-kmitl.firebaseio.com",
//     projectId: "math-web-kmitl",
//     storageBucket: "math-web-kmitl.appspot.com",
// };
var config = {
    apiKey: "AIzaSyDHN6epAFTpGwywxeqKpc1vzNERGLYfguE",
    authDomain: "math-web-kmitl.firebaseapp.com",
    databaseURL: "https://math-web-kmitl.firebaseio.com",
    projectId: "math-web-kmitl",
    storageBucket: "math-web-kmitl.appspot.com",
    messagingSenderId: "481311539108"
};
firebase.initializeApp(config);
var sID = sessionStorage.getItem('std_value');
var stRef = firebase.storage().ref().child('student_pic');
var refS = ['year', sID.substr(0, 2)].join('') + '/' + sID
var tdRef = firebase.database().ref('student/' + refS);

//load data once per refresh not realtime
tdRef.once('value', function (snapshot) {
    document.getElementById("std_name").value = snapshot.val().name;
    document.getElementById("std_sur").value = snapshot.val().surname;
    document.getElementById("std_title").value = snapshot.val().title;
    document.getElementById("std_id").value = snapshot.key;
});

function signOut() {
    firebase.auth().signOut().then(function () {
        localStorage.clear();
        swal('ออกจากระบบ', 'เสร็จสิ้น!', "success").then(function (value) { window.location.href = 'index.html' });
    }).catch(function (error) {
        swal('กรุณาตรวจสอบ', 'เครือข่ายอินเทอร์เน็ต', "error");
    });
}

function resetPassword() {
    var email = localStorage.getItem('email');
    firebase.auth().sendPasswordResetEmail(email).then(
        function () {
            swal('กรุณาตรวจสอบข้อความ', 'ที่เข้าอีเมลของคุณเพื่อเปลี่ยนรหัสผ่าน', "success");
        }).catch(
            function (error) {
                swal('กรุณาตรวจสอบ', 'เครือข่ายอินเทอร์เน็ต', "error");
            }
        )
}

async function createAccount() {
    var file = $('#profile_pic').get(0).files[0];
    var file_exten = '';
    if (file) {
        file_exten = file.name.replace(/^.*\./, '');
    }
    var check_pic = 1;

    if (document.getElementById("std_id").value.trim().length === 8 && !isNaN(parseInt(document.getElementById("std_id").value.trim(), 10))) {
        if (sID !== document.getElementById("std_id").value.trim()) {
            await tdRef.remove()
            await stRef.child(`${refS}.${file_exten}`).delete()
            const newID = document.getElementById("std_id").value.trim()
            refS = ['year', newID.substr(0, 2)].join('') + '/' + newID
            tdRef = firebase.database().ref('student/' + refS);
        }
    } else {
        swal("คำเตือน", "กรุณากรอกรหัสนักศึกษาให้ถูกต้อง", "warning");
    }

    // detail
    await tdRef.set(createJSON()).then(function (resp) {
    }).catch(function (error) {
        swal('กรุณาตรวจสอบ', 'เครือข่ายอินเทอร์เน็ต', "error");
    });

    // pic
    if (file && file_exten == 'jpg') {
        var task = stRef.child(`${refS}.${file_exten}`).put(file);
        await task
            .then(function (resp) {
            })
            .catch(function (error) {
                swal('กรุณาตรวจสอบ', 'เครือข่ายอินเทอร์เน็ต', "error");
            });
    } else if (file_exten != '') {
        swal('กรุณาอัพโหลด', 'ไฟล์นามสกุล .jpg', "warning");
        check_pic = 0;
    }

    // notification
    swal('อัพเดทข้อมูล', 'เสร็จสิ้น!', 'success').then(function (value) { window.location.href = 'std-manage.html'; });


}

function createJSON() {
    var json = {}
    if (document.getElementById("std_name").value == "") {
        swal("คำเตือน", "กรุณากรอกชื่อ", "warning");
        return;
    }
    else {
        json['name'] = document.getElementById("std_name").value
    }
    if (document.getElementById("std_sur").value == "") {
        swal("คำเตือน", "กรุณากรอกนามสกุล", "warning");
        return;
    }
    else {
        json['surname'] = document.getElementById("std_sur").value;
    }
    if (document.getElementById("std_title").value == "") {
        swal("คำเตือน", "กรุณากรอกคำนำหน้า", "warning");
        return;
    } else {
        json['title'] = document.getElementById("std_title").value ;
    } 
    return json;
}

function pad(d) {
    return (d < 10) ? '00' + d.toString() : (d < 100) ? '0' + d.toString() : d.toString();
}

window.alert = function () {
    $("#myModal .modal-body").text(arguments[0]);
    $("#myModal").modal('show');
};