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
var stRef = firebase.storage().ref().child('student_pic');
var tdRef = firebase.database().ref('student');

function signOut() {
    firebase.auth().signOut().then(function () {
        localStorage.clear();
        swal('ออกจากระบบ', 'เสร็จสิ้น!', "success").then(function (value) { window.location.href = 'index.html' });
    }).catch(function (error) {
        swal('กรุณาตรวจสอบ', 'เครือข่ายอินเทอร์เน็ต', "error");
        //console.log(error);
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
                //console.log(error);
            }
        )
}

function createAccount() {
    const studentID = document.getElementById("std_id").value.trim()
    if (studentID.length === 8 && !isNaN(parseInt(studentID.trim(), 10))) {
        var file = $('#profile_pic').get(0).files[0];
        var file_exten = '';
        if (file) {
            file_exten = file.name.replace(/^.*\./, '');
        }
        var check_pic = 1;

        const refS = ['year', studentID.substr(0, 2)].join('') + '/' + studentID
        //console.log(file_exten);
        if (file && file_exten == 'jpg') {
            stRef.child(`${refS}.${file_exten}`).put(file)
                .then(function (resp) {
                    tdRef.child(refS).set(createJSON()).then(function (resp) {
                        // alert('success');
                        swal('อัพเดทข้อมูล', 'เสร็จสิ้น!', 'success').then(function (value) { window.location.href = 'std-manage.html'; });
                    }).catch(function (error) {
                        console.log(error)
                        swal('กรุณาตรวจสอบ', 'เครือข่ายอินเทอร์เน็ต', "error");
                        // //console.log(error);
                    });

                })
                .catch(function (error) { 
                    swal('กรุณาตรวจสอบ', 'เครือข่ายอินเทอร์เน็ต', "error");
                });
        } else if (file_exten != '') {
            swal('กรุณาอัพโหลด', 'ไฟล์นามสกุล .jpg', "warning");
            //console.log('che');
            check_pic = 0;
        } else {
            swal('กรุณาอัพโหลด', 'รูปภาพ', "warning");
            //console.log('che');
            check_pic = 0;
        }
    } else {
        swal("คำเตือน", "กรุณากรอกรหัสนักศึกษาให้ถูกต้อง", "warning");
    }
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

window.alert = function () {
    $("#myModal .modal-body").text(arguments[0]);
    $("#myModal").modal('show');
};