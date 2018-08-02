//config to connect to firebase
const config = {
    apiKey: "AIzaSyBn6rrMZkB4eFq_XWT9iLawqLw3z-QYyac",
    authDomain: "math-web-kmitl-gallery.firebaseapp.com",
    databaseURL: "https://math-web-kmitl-gallery.firebaseio.com",
    projectId: "math-web-kmitl-gallery",
    storageBucket: "math-web-kmitl-gallery.appspot.com",
    messagingSenderId: "1016085984216"
};
const fb = firebase.initializeApp(config);

//prepare to get image from firebase database / storage
var crsRef = fb.database().ref(`course/inside`);
var docStgRef = fb.storage().ref(`course/inside`);

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
crsRef.once('value', function (snapshot) {
    const result = snapshot.val() || {}
    Object.keys(result.form || {}).forEach(docKey => {
        const temp = result.form[docKey]
        const keyForDel = [docKey, temp.fileName].join('-splitter-')
        $('#doc-form-table').append(docFormTab(parseInt(docKey, 10) + 1, keyForDel, temp.name, temp.url))
    })
    $('#doc-form-table').DataTable({
        "columns": [
            { className: "columnDataTable" },
            null,
            { className: "columnDataTable" },
            { className: "columnDataTable" }
        ]
    });
    Object.keys(result.other || {}).forEach(docKey => {
        const temp = result.other[docKey]
        const keyForDel = [docKey, temp.fileName].join('-splitter-')
        $('#doc-other-table').append(docOtherTab(parseInt(docKey, 10) + 1, keyForDel, temp.name, temp.url))
    })
    $('#doc-other-table').DataTable({
        "columns": [
            { className: "columnDataTable" },
            null,
            { className: "columnDataTable" },
            { className: "columnDataTable" }
        ]
    });
});

function docFormTab(no, key, docName, url) {
    var html = '';
    html += '<tr>';
    html += `<td> ${no} </td>`;
    html += `<td> ${docName} </td>`;
    html += `<td> <a href="${url}" class="btn btn-success">Link</a> </td>`;
    html += `<td> <button class="btn btn-del" onclick = "deleteDocForm(this.id)" id="${key}"> Delete </button> </td>`;
    html += '</tr>';
    return html;
}

function docOtherTab(no, key, docName, url) {
    var html = '';
    html += '<tr>';
    html += `<td> ${no} </td>`;
    html += `<td> ${docName} </td>`;
    html += `<td> <a href="${url}" class="btn btn-success">Link</a> </td>`;
    html += `<td> <button class="btn btn-del" onclick = "deleteDocOther(this.id)" id="${key}"> Delete </button> </td>`;
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
    // console.log(email);
    firebase.auth().sendPasswordResetEmail(email).then(
        function () {
            swal('กรุณาตรวจสอบข้อความ', 'ที่เข้าอีเมลของคุณเพื่อเปลี่ยนรหัสผ่าน', "success");
        }).catch(
            function (error) {
                swal('กรุณาตรวจสอบ', 'เครือข่ายอินเทอร์เน็ต', "error");
                console.log(error);
            }
        )
}

function setInsideType(insideType) {
    sessionStorage.setItem('insideType', insideType)
}

function deleteDocForm(id) {
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
                await crsRef.child(`form/${docKey}`).remove()
                await docStgRef.child(`form/${fileName}`).delete()
                swal("ข้อมูลเอกสารนี้ถูกลบไปแล้ว", {
                    icon: "success",
                }).then(function (value) { window.location.href = `document-manager-inside.html` });
            }
        });
}

function deleteDocOther(id) {
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
                await crsRef.child(`other/${docKey}`).remove()
                await docStgRef.child(`other/${fileName}`).delete()
                swal("ข้อมูลเอกสารนี้ถูกลบไปแล้ว", {
                    icon: "success",
                }).then(function (value) { window.location.href = `document-manager-inside.html` });
            }
        });
}

