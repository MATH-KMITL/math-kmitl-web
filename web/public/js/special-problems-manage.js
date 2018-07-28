//config to connect to firebase
var config = {
    apiKey: "AIzaSyBn6rrMZkB4eFq_XWT9iLawqLw3z-QYyac",
    authDomain: "math-web-kmitl-gallery.firebaseapp.com",
    databaseURL: "https://math-web-kmitl-gallery.firebaseio.com",
    projectId: "math-web-kmitl-gallery",
    storageBucket: "math-web-kmitl-gallery.appspot.com",
    messagingSenderId: "1016085984216"
};
firebase.initializeApp(config);

//prepare to get image from firebase database / storage
var spRef = firebase.database().ref('special-problems');

//load data once per refresh not realtime
spRef.once('value', function (snapshot) {
    //for in every child of data
    if (snapshot) {
        Object.keys(snapshot.val()).reverse().forEach(function (key) {
            var year = key;
            var data = snapshot.val()[key]
            // add sp zone 
            Object.keys(data).sort((a, b) => (a.split('M_')[1] - b.split('M_')[1])).forEach(function (spKey) {
                $('#sp-table').append(spTab(year, spKey, data[spKey]));
            })
        });
    }
    $('#sp-table').DataTable({
        "columns": [
            { className: "columnDataTable" },
            { className: "columnDataTable" },
            { className: "columnDataTable" },
            { className: "columnDataTable" }
        ]
    });
});

function spTab(year, spKey, spName) {
    var html = '';
    html += '<tr>';
    html += ` <td> ${year} </td> `
    html += `<td> ${spKey} </td>`;
    html += `<td> ${spName} </td>`;
    html += `<td> <button class="btn btn-del" onclick = "deleteSp(this.id)" id="${year}-splitter-${spKey}"> Delete </button> </td>`;
    html += '</tr>';
    return html;
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

function deleteSp(id) {
    swal({
        title: "คำเตือน",
        text: "ถ้าคุณลบแล้วจะไม่สามารถกู้ข้อมูลกลับมาได้อีก",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then(async (willDelete) => {
            if (willDelete) {
                const temp = id.split('-splitter-')
                const year = temp[0]
                const spKey = temp[1]
                spRef.child(year).once('value', function (snapshot) {
                    const objUpload = {}
                    let moveUp = false
                    Object.keys(snapshot.val()).forEach(key => {
                        if (key !== spKey) {
                            const keyU = moveUp
                                ? [key.split('M_')[0], parseInt(key.split('M_')[1], 10) - 1].join('M_')
                                : key
                            const name = snapshot.val()[key]
                            objUpload[keyU] = name
                        } else {
                            moveUp = true
                        }
                    })
                    console.log(objUpload)
                    spRef.child(year).set(objUpload).then(() => {
                        swal("ข้อมูลปัญหาพิเศษนี้ถูกลบไปแล้ว", {
                            icon: "success",
                        }).then(function (value) { window.location.href = 'special-problems-manage.html' });
                    })
                })
            }
        });
}

var file

$("#input-data").on('change', function (e) {
    file = e.target.files[0]
    document.getElementById('import button').hidden = false
})

//ฟังก์ชั่น import ไฟล์ excel
function importFile() {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const dataTemp = e.target.result;
            const workbook = XLSX.read(dataTemp, { type: 'binary' });
            const data = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 'A' });
            // read 
            let dataForFirebase = {}
            console.log(data)
            data.forEach(row => {
                if (row['A'] && row['B'] && row['C']) {
                    dataForFirebase[row['A'].trim()] = dataForFirebase[row['A'].trim()] || {} // initial
                    dataForFirebase[row['A'].trim()][row['B'].trim()] = row['C'].trim()
                }
            })
            console.log('dataForFirebase', dataForFirebase)
            // upload 
            tempForThen(dataForFirebase).then(() => {
                swal("เพื่มปัญหาพิเศษจากไฟล์ Excel เรียบร้อย", `จากไฟล์ : ${file.name}`, "success").then(function () { window.location.href = 'special-problems-manage.html' });
            })
        } catch (error) {
            console.log(error)
            swal("เกิดข้อผิดพลาด กรุณาเลือกไฟล์ใหม่", `ข้อมูลในไฟล์ไม่ถูกต้อง หรือ ไฟล์ไม่ถูกต้อง \n จากไฟล์ : ${file.name}`, "error")
        }
    }
    reader.readAsBinaryString(file);
}

async function tempForThen(dataForFirebase) {
    Object.keys(dataForFirebase).forEach(key => { // set ตามรหัสนศ 2 ตัวแรก
        spRef.child(key).set(dataForFirebase[key])
    })
}
