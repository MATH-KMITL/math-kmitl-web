//config to connect to firebase
const config = {
    apiKey: "AIzaSyBn6rrMZkB4eFq_XWT9iLawqLw3z-QYyac",
    authDomain: "math-web-kmitl-gallery.firebaseapp.com",
    databaseURL: "https://math-web-kmitl-gallery.firebaseio.com",
    projectId: "math-web-kmitl-gallery",
    storageBucket: "math-web-kmitl-gallery.appspot.com",
    messagingSenderId: "1016085984216"
};
const config2 = {
    apiKey: "AIzaSyDHN6epAFTpGwywxeqKpc1vzNERGLYfguE",
    authDomain: "math-web-kmitl.firebaseapp.com",
    databaseURL: "https://math-web-kmitl.firebaseio.com",
    projectId: "math-web-kmitl",
    storageBucket: "math-web-kmitl.appspot.com",
    messagingSenderId: "481311539108"
};
const fb = firebase.initializeApp(config);
const fb2 = firebase.initializeApp(config2, "secondary");

//prepare to get image from firebase database / storage
var crsRef = fb.database().ref(`course/${course}`);
var docStgRef = fb.storage().ref(`course/${course}`);

const tchRef = fb2.database().ref('teacher')

// set documentCourse for next page
sessionStorage.setItem('documentCourse', course)

const positions = [{
    th: 'ประธานหลักสูตร',
    en: 'president'
}, {
    th: 'คณะกรรมการหลักสูตร',
    en: 'committee'
}, {
    th: 'เลขานุการ',
    en: 'secretary'
}, {
    th: 'อนุกรรมการบัณฑิต',
    en: 'subcommittee'
}]

//load data once per refresh not realtime 
tchRef.once('value', function (snapshot2) {
    const teacherList = {}
    Object.keys(snapshot2.val() || {}).forEach(userK => {
        teacherList[userK] = [snapshot2.val()[userK].title, snapshot2.val()[userK].name, snapshot2.val()[userK].surname].join(' ')
    })
    crsRef.once('value', function (snapshot) {
        const result = snapshot.val() || {}
        Object.keys(result.teacher || {}).forEach(position => {
            const po = positions.find(p => p.en === position).th
            Object.keys(result.teacher[position]).forEach(userKey => {
                const keyForDel = [userKey, position].join('-splitter-')
                $('#teacher-table').append(teacherTab(keyForDel, teacherList[result.teacher[position][userKey]], po))
            })
        })
        $('#teacher-table').DataTable({
            "columns": [
                null,
                null,
                { className: "columnDataTable" }
            ]
        });
        Object.keys(result.document || {}).forEach(docKey => {
            const temp = result.document[docKey]
            const keyForDel = [docKey, temp.fileName].join('-splitter-')
            $('#doc-table').append(docTab(parseInt(docKey, 10) + 1, keyForDel, temp.name, temp.url))
        })
        $('#doc-table').DataTable({
            "columns": [
                { className: "columnDataTable" },
                null,
                { className: "columnDataTable" },
                { className: "columnDataTable" }
            ]
        });
    });
})

function teacherTab(key, tName, position) {
    var html = '';
    html += '<tr>';
    html += `<td> ${tName} </td>`;
    html += `<td> ${position} </td>`;
    html += `<td> <button class="btn btn-del" onclick = "deleteTeacher(this.id)" id="${key}"> Delete </button> </td>`;
    html += '</tr>';
    return html;
}

function docTab(no, key, docName, url) {
    var html = '';
    html += '<tr>';
    html += `<td> ${no} </td>`;
    html += `<td> ${docName} </td>`;
    html += `<td> <a href="${url}" class="btn btn-success">Link</a> </td>`;
    html += `<td> <button class="btn btn-del" onclick = "deleteDoc(this.id)" id="${key}"> Delete </button> </td>`;
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

function deleteTeacher(id) {
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
                const userKey = temp[0]
                const position = temp[1]
                await crsRef.child(`teacher/${position}/${userKey}`).remove()
                swal("ข้อมูลนี้ถูกลบไปแล้ว", {
                    icon: "success",
                }).then(function (value) { window.location.href = `document-manager-${course}.html` });
            }
        });
}

function deleteDoc(id) {
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
                const docKey = temp[0]
                const fileName = temp[1]
                await crsRef.child(`document/${docKey}`).remove()
                await docStgRef.child(fileName).delete()
                swal("ข้อมูลเอกสารนี้ถูกลบไปแล้ว", {
                    icon: "success",
                }).then(function (value) { window.location.href = `document-manager-${course}.html` });
            }
        });
}

