//config to connect to firebase
var config = {
    apiKey: "AIzaSyDHN6epAFTpGwywxeqKpc1vzNERGLYfguE",
    authDomain: "math-web-kmitl.firebaseapp.com",
    databaseURL: "https://math-web-kmitl.firebaseio.com",
    projectId: "math-web-kmitl",
    storageBucket: "math-web-kmitl.appspot.com",
};
firebase.initializeApp(config);
var stRef = firebase.storage().ref().child('student_pic');
var tdRef = firebase.database().ref('student');
var yRef = firebase.database().ref('max_year');
yRef.once('value', function (snapshot) {
    sessionStorage.setItem("max_year", snapshot.val())
});
//load data once per refresh not realtime
tdRef.once('value', function (snapshot) {
    count = 5;
    var str_year = sessionStorage.getItem("max_year");
    var year = parseInt(str_year);
    var table = $('#student-table tbody');
    //for in every child of data
    snapshot.forEach(function (childSnapshot) {
        count -= 1;
        count_s = 0;
        var key = childSnapshot.key;
        var childData = childSnapshot.val();
        if (key == 'year'+String(year)) {
            for (i in childData) {
                count_s += 1;
                sessionStorage.setItem('year'+String(year), pad(count_s + 1))
            }
        }
        if (key == 'year'+String(year-1)) {
            for (i in childData) {
                count_s += 1;
                sessionStorage.setItem('year'+String(year-1), pad(count_s + 1))
            }
        }
        if (key == 'year'+String(year-2)) {
            for (i in childData) {
                count_s += 1;
                sessionStorage.setItem('year'+String(year-2), pad(count_s + 1))
            }
        }
        if (key == 'year'+String(year-3)) {
            for (i in childData) {
                count_s += 1;
                sessionStorage.setItem('year'+String(year-3), pad(count_s + 1))
            }
        }
        //     document.querySelector('#teacher-list')
        // .innerHTML += teacherCard(childData, count);
    });
});

function signOut() {
    firebase.auth().signOut().then(function () {
        localStorage.clear();
        swal('ออกจากระบบ', 'เสร็จสิ้น!',"success").then(function (value){window.location.href = 'index.html'});
    }).catch(function (error) {
        swal('กรุณาตรวจสอบ', 'เครือข่ายอินเทอร์เน็ต', "error");
        //console.log(error);
    });
}

function resetPassword() {
    var email = localStorage.getItem('email');
    firebase.auth().sendPasswordResetEmail(email).then(
        function () {
            swal('กรุณาตรวจสอบข้อความ', 'ที่เข้าอีเมลของคุณเพื่อเปลี่ยนรหัสผ่าน',"success");
        }).catch(
            function (error) {
                swal('กรุณาตรวจสอบ', 'เครือข่ายอินเทอร์เน็ต', "error");
                //console.log(error);
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
    //console.log(file_exten);
    if (file && file_exten == 'jpg') {

        var task = stRef.child(document.getElementById("std_year").value + '/' + 'user' + sessionStorage.getItem(document.getElementById("std_year").value)+ '.' + file_exten).put(file);
        task
            .then(function (resp) {
                student.set(JSON.parse(createJSON())).then(function (resp) {
                    // alert('success');
                    swal('อัพเดทข้อมูล','เสร็จสิ้น!','success').then(function (value){ window.location.href = 'std-manage.html';});
                   
                }).catch(function (error) {
                    swal('กรุณาตรวจสอบ', 'เครือข่ายอินเทอร์เน็ต', "error");
                    // //console.log(error);
                });
                
            })
            .catch(function (error) {
                swal('กรุณาตรวจสอบ', 'เครือข่ายอินเทอร์เน็ต', "error");
            });
    } else if (file_exten != '') {
        swal('กรุณาอัพโหลด','ไฟล์นามสกุล .jpg',"warning");
        //console.log('che');
        check_pic = 0;
    }else{
        swal('กรุณาอัพโหลด', 'รูปภาพ', "warning");
        //console.log('che');
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