//config to connect to firebase
var config = {
    apiKey: "AIzaSyDHN6epAFTpGwywxeqKpc1vzNERGLYfguE",
    authDomain: "math-web-kmitl.firebaseapp.com",
    databaseURL: "https://math-web-kmitl.firebaseio.com",
    projectId: "math-web-kmitl",
    storageBucket: "math-web-kmitl.appspot.com",
};
firebase.initializeApp(config);
var list = sessionStorage.getItem('std_value').split(",");
var stRef = firebase.storage().ref().child('student_pic');
var tdRef = firebase.database().ref('student/' + list[0] + '/user' + list[1]);

//load data once per refresh not realtime
tdRef.once('value', function (snapshot) {
    count = 5;
    year = 61;
    var table = $('#student-table tbody');
        document.getElementById("std_name").value = snapshot.val().name;
        document.getElementById("std_sur").value = snapshot.val().surname;
        document.getElementById("std_title").value = snapshot.val().title;
        document.getElementById("std_id").value = snapshot.val().user_id;
        document.getElementById("std_year").value = list[0];
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

function createAccount() {
    var file = $('#profile_pic').get(0).files[0];
    var file_exten = '';
    if (file) {
        file_exten = file.name.replace(/^.*\./, '');
    }
    var check_pic = 1;
    var student = tdRef.child(document.getElementById("std_year").value + '/' + 'user' + sessionStorage.getItem(document.getElementById("std_year").value));
    student.set(JSON.parse(createJSON())).then(function (resp) {
        // alert('success');
        swal('อัพเดทข้อมูล', 'เสร็จสิ้น!', 'success').then(function (value) { window.location.href = 'std-manage.html'; });

    }).catch(function (error) {
        swal('กรุณาตรวจสอบ', 'เครือข่ายอินเทอร์เน็ต', "error");
    });
    if (file && file_exten == 'jpg') {

        var task = stRef.child(document.getElementById("std_year").value + '/' + 'user' + sessionStorage.getItem(document.getElementById("std_year").value) + '.' + file_exten).put(file);
        task
            .then(function (resp) {
            })
            .catch(function (error) {
                swal('กรุณาตรวจสอบ', 'เครือข่ายอินเทอร์เน็ต', "error");
            });
    } else if (file_exten != '') {
        swal('กรุณาอัพโหลด', 'ไฟล์นามสกุล .jpg', "warning");
        check_pic = 0;
    }


}

function createJSON() {
    var json_str = "";
    json_str += '{';
    if (document.getElementById("std_name").value == "") {
        swal("คำเตือน", "กรุณากรอกชื่อ", "warning");
        return;
    }
    else {
        json_str += '"name":"' + document.getElementById("std_name").value + '",';
    }
    if (document.getElementById("std_sur").value == "") {
        swal("คำเตือน", "กรุณากรอกนามสกุล", "warning");
        return;
    }
    else {
        json_str += '"surname" : "' + document.getElementById("std_sur").value + '",';
    }
    if (document.getElementById("std_sur").value == "กรุณาเลือกชั้นปี") {
        swal("คำเตือน", "กรุณาเลือกชั้นปี", "warning");
        return;
    } else {
        json_str += '"title" : "' + document.getElementById("std_title").value + '",';
    }
    if (document.getElementById("std_sur").value == "กรุณาเลือกชั้นปี") {
        swal("คำเตือน", "กรุณาเลือกคำนำหน้า", "warning");
        return;
    } else {
        json_str += '"user_id" :"' + document.getElementById("std_id").value + '"';
    }
    json_str += '}';
    return json_str;
}

function pad(d) {
    return (d < 10) ? '00' + d.toString() : (d < 100) ? '0' + d.toString() : d.toString();
}

window.alert = function () {
    $("#myModal .modal-body").text(arguments[0]);
    $("#myModal").modal('show');
};