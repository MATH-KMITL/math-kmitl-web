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

//prepare to get student from firebase database
var tdRef = firebase.database().ref('student');
var stRef = firebase.storage().ref().child('student_pic');

// set format student data
// tdRef.once('value', (snapshot) => {
//     const newStudent = {}
//     Object.keys(snapshot.val()).forEach(y => {
//         newStudent[y] = {}
//         Object.keys(snapshot.val()[y]).forEach(s => {
//             if (s.substr(0, 4) === 'user') {
//                 const { user_id, name, surname, title } = snapshot.val()[y][s]
//                 newStudent[y][user_id] = {
//                     name,
//                     surname,
//                     title
//                 }
//             } else {
//                 newStudent[y][s] = snapshot.val()[y][s]
//             }

//         })
//     })
//     tdRef.set(newStudent)
// })

var students = []

//load data once per refresh not realtime
tdRef.once('value', function (snapshot) {
    var table = $('#student-table tbody');
    const result = snapshot.val()
    const freshy = result['freshy']
    //for in every child of data
    Object.keys(result).forEach(function (key) {
        if (key !== 'freshy') {
            var childData = result[key];
            for (i in childData) {
                students.push(i)
                table.append(studentTab(i, childData[i].name, childData[i].surname));
            }
            $('#selctFreshy').append(`<option ${freshy === key.substr(4, 2) && 'selected'}> ${key.substr(4, 2)} </option>`)
            //     document.querySelector('#teacher-list')
            // .innerHTML += teacherCard(childData, count);
        }
    });
    page();
});

$('#selctFreshy').on('change', function ({ target: { selectedOptions: { 0: { outerText } } } }) {
    tdRef.child('freshy').set(outerText.trim())
})

function studentTab(sID, name, surname) {
    var html = '';
    html += '<tr>';
    html += '<td>' + sID + '</td>';
    html += '<td>' + name + '</td>';
    html += '<td>' + surname + '</td>';
    html += '<td>' + '<button class="btn btn-all" onclick = "editStd(this.id)" id="' + sID + '">' + 'Edit' + '</button>' + '</td>';
    html += '<td>' + '<button class="btn btn-del" onclick = "deleteStd(this.id)" id="' + sID + '">' + 'Delete' + '</button>' + '</td>';
    html += '</tr>';
    return html;
}

//pad number one length with zero
function pad(d) {
    return (d < 10) ? '00' + d.toString() : (d < 100) ? '0' + d.toString() : d.toString();
}


window.alert = function () {
    $("#myModal .modal-body").text(arguments[0]);
    $("#myModal").modal('show');
};

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

function page() {
    $('#student-table').DataTable();
}

function deleteStd(id) {
    const year = ['year', id.substr(0, 2)].join('')
    swal({
        title: "คำเตือน",
        text: "ถ้าคุณลบแล้วจะไม่สามารถกู้ข้อมูลกลับมาได้อีก",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then(async (willDelete) => {
            if (willDelete) {
                await tdRef.child(`${year}/${id}`).remove()
                await stRef.child(`${year}/${id}.jpg`).delete()
                swal("ข้อมูลนักศึกษาคนนี้ถูกลบไปแล้ว", {
                    icon: "success",
                }).then(function (value) { window.location.href = 'std-manage.html' });
            }
        });
}

function editStd(id) {
    sessionStorage.setItem('std_value', id);
    window.location.href = "std-edit.html";
}

var file

$("#data").on('change', function (e) {
    file = e.target.files[0]
    document.getElementById('import button').hidden = false
})

//ฟังก์ชั่น import ไฟล์ excel
function importFile() {
    document.getElementById('import button').hidden = true
    document.getElementById('txt_wait_upload').hidden = false
    const reader = new FileReader();
    reader.onload = (e) => {
        const dataTemp = e.target.result;
        const workbook = XLSX.read(dataTemp, { type: 'binary' });
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 'A' });
        // read 
        let dataForFirebase = {}
        data.forEach(row => { // ถ้าไม่มี รหัสนศ คำนำหน้าชื่อ ชื่อ นามสกุล หรือ รหัสนศ ไม่ครบ 8 ตำแหน่ง หรือมีอักษร จะไม่เพิ่ม นศ
            if (row['B'] && row['C'] && row['D'] && row['A'].trim().length === 8 && !isNaN(parseInt(row['A'].trim(), 10))) {
                const key = ['year', row['A'].substr(0, 2)].join('')  // เช็คว่าอยู่ ปีไหน (ซึ่งเช็คทุกคน)
                dataForFirebase[key] = dataForFirebase[key] || {} // initial
                dataForFirebase[key][row.A] = {
                    name: row.C,
                    surname: row.D,
                    title: row.B
                }
            }
        })
        // upload 
        Object.keys(dataForFirebase).forEach(ykey => { // set ตามรหัสนศ 2 ตัวแรก
            Object.keys(dataForFirebase[ykey]).forEach(async (sID) => {
                await tdRef.child(ykey).child(sID).set(dataForFirebase[ykey][sID])
            })

        })
        // refresh 
        swal("เพิ่มนักศึกษา", "ปีการศึกษา " + Object.keys(dataForFirebase).map(y => [' 25'].concat(y.split('year')).join('')), "success").then(function () { window.location.href = 'std-manage.html' });

    }
    reader.readAsBinaryString(file);
}

// เพิ่มรูปภาพ
$("#input-img").on('change', function ({ target: { files } }) { // e.target.files 
    if (files) {
        swal({
            title: "คำเตือน",
            text: " กรุณาตั้งชื่อภาพตามรหัสนักศึกษา \n จะเพิ่มแค่นักศึกษาที่อยู่ในระบบ และไฟล์เป็น .jpg (ตัวเล็กเท่านั้น) ",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then(willDelete => {
                if (willDelete) {
                    document.getElementById('upload_pic').hidden = true
                    document.getElementById('txt_wait_pic').hidden = false
                    let num = 0
                    Object.keys(files).map(key => files[key]).forEach(async (file) => {
                        const name = file.name.split('.')[0]
                        const name_end = file.name.split('.')[1]
                        if (students.some(s => s === name) && 'jpg' === name_end) {
                            num++
                            await stRef.child(`${['year', name.substr(0, 2)].join('')}/${name}.jpg`).put(file)
                        }
                    })
                    swal(` อัพโหลดรูปแล้วทั้งหมด ${num} รูป `, {
                        icon: "success",
                    }).then(function (value) { window.location.href = 'std-manage.html' });
                }
            });
    }
})
