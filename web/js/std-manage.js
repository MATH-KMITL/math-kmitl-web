//config to connect to firebase
var config = {
    apiKey: "AIzaSyDHN6epAFTpGwywxeqKpc1vzNERGLYfguE",
    authDomain: "math-web-kmitl.firebaseapp.com",
    databaseURL: "https://math-web-kmitl.firebaseio.com",
    projectId: "math-web-kmitl",
    storageBucket: "math-web-kmitl.appspot.com",
};
firebase.initializeApp(config);

//prepare to get student from firebase database
var tdRef = firebase.database().ref('student');
var yRef = firebase.database().ref('max_year');
yRef.once('value', function (snapshot) {
    sessionStorage.setItem("max_year", snapshot.val())
});
//load data once per refresh not realtime
tdRef.once('value', function (snapshot) {
    count = 5;
    var table = $('#student-table tbody');
    //for in every child of data
    snapshot.forEach(function (childSnapshot) {
        count -= 1;
        count_s = 0;
        var key = childSnapshot.key;
        var childData = childSnapshot.val();
        for (i in childData) {
            count_s += 1;
            table.append(studentTab(childData[i], pad(count_s), key));
        }
        //     document.querySelector('#teacher-list')
        // .innerHTML += teacherCard(childData, count);
    });
    page();
});
function studentTab(student, id, key) {
    var html = '';
    html += '<tr>';
    html += '<td>' + student.user_id + '</td>';
    html += '<td>' + student.name + '</td>';
    html += '<td>' + student.surname + '</td>';
    html += '<td>' + '<button class="btn btn-all" onclick = "editStd(this.id)" id="' + key + '-' + id + '">' + 'Edit' + '</button>' + '</td>';
    html += '<td>' + '<button class="btn btn-del" onclick = "deleteStd(this.id)" id="' + key + '-' + id + '">' + 'Delete' + '</button>' + '</td>';
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
    year = id.split("-")[0];
    std_id = id.split("-")[1];
    swal({
        title: "คำเตือน",
        text: "ถ้าคุณลบแล้วจะไม่สามารถกู้ข้อมูลกลับมาได้อีก",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                tdRef.child(year + '/user' + std_id).remove();
                swal("ข้อมูลนักศึกษาคนนี้ถูกลบไปแล้ว", {
                    icon: "success",
                }).then(function (value) { window.location.href = 'std-manage.html' });
            }
        });
}

function editStd(id) {
    sessionStorage.setItem('std_value', id.split("-"));
    window.location.href = "std-edit.html";
}

var file

$("#data").on('change', function (e) {
    file = e.target.files[0] 
    document.getElementById('import button').hidden = false
})

//ฟังก์ชั่น import ไฟล์ excel
function importFile() {
    const reader = new FileReader();
    reader.onload = (e) => {
        const dataTemp = e.target.result;
        const workbook = XLSX.read(dataTemp, { type: 'binary' });
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 'A' });
        // read 
        let dataForFirebase = {}
        data.forEach(row => { // ถ้าไม่มี รหัสนศ คำนำหน้าชื่อ ชื่อ นามสกุล หรือ รหัสนศ ไม่ครบ 8 ตำแหน่ง หรือมีอักษร จะไม่เพิ่ม นศ
            if (row['B'] && row['C'] && row['D'] && row['E'] && row['A'].trim().length === 8 && !isNaN(parseInt(row['A'].trim(), 10))) {
                const key = ['year', row['A'].substr(0, 2)].join('')  // เช็คว่าอยู่ ปีไหน (ซึ่งเช็คทุกคน)
                dataForFirebase[key] = dataForFirebase[key] || {} // initial
                dataForFirebase[key][row.E] = {
                    name: row.C,
                    surname: row.D,
                    title: row.B,
                    user_id: row.A
                }
            }
        })
        // upload 
        Object.keys(dataForFirebase).forEach(key => { // set ตามรหัสนศ 2 ตัวแรก
            tdRef.child(key).set(dataForFirebase[key])
        })
        const years = Object.keys(dataForFirebase).map(key => key.substr(4, 2)) // ชั้นปีที่ เพิ่งเพิ่มมา
        console.log(years);
        yRef.once('value', snapshot => {
            years.push(snapshot.val()) // เพิ่มชั้นปีที่มากที่สุด (max_year)
            yRef.set(years.sort()[years.length - 1])
        }).then(() => {
            // refresh 
            swal("เพิ่มนักศึกษา","ปีการศึกษา "+years[1],"success").then(function (){window.location.href = 'std-manage.html'});
           
        })
    }
    reader.readAsBinaryString(file);
}