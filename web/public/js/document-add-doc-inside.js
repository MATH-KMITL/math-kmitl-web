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

const insideType = sessionStorage.getItem('insideType') // form or other 

const docType = [{
    en: 'form',
    th: 'เอกสารแบบฟอร์ม / คำร้อง'
}, {
    en: 'other',
    th: 'เอกสารอื่นๆ'
}]

$('#doc-title').append(`เพิ่ม${docType.find(d => d.en === insideType).th}`)

//prepare to get image from firebase database / storage
var docRef = firebase.database().ref(`course/inside/${insideType}`);
var docStgRef = firebase.storage().ref(`course/inside/${insideType}`);

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

var file

$("#input-file").on('change', function ({ target: { files: temp } }) { // e.target.files 
    file = temp[0]
    if (file) {
        $('#txtFullName').empty()
        $('#txtFullName').append(file.name)
    }
})

function addDoc() {
    if (file) {
        document.getElementById('btn-upload').hidden = true
        document.getElementById('wait-txt').hidden = false
        docRef.once('value', function (snapshot) {
            const docName = document.getElementById('doc-name').value.trim() === ''
                ? file.name.split('.').filter((f, i, arr) => i !== arr.length - 1).join('.')
                : document.getElementById('doc-name').value.trim()
            const docList = Object.keys(snapshot.val() || []).map(k => snapshot.val()[k])
            if (!docList.some(doc => doc.name === docName)) {
                const fileName = [docName, file.name].join('-')
                docStgRef.child(fileName).put(file).then(snapshot => {
                    return snapshot.ref.getDownloadURL()
                }).then((url) => {
                    docList.push({
                        name: docName,
                        url,
                        fileName
                    })
                    docRef.set(docList).then(() => {
                        swal('upload สำเร็จ', 'เสร็จสิ้น!', "success").then(function (value) { window.location.href = `document-manager-inside.html` })
                    })
                })
            } else {
                document.getElementById('wait-txt').hidden = true
                document.getElementById('btn-upload').hidden = false
                swal('เกิดข้อผิดพลาด', 'มีเอกสารชื่อนี้แล้ว', "error")
            }
        })
    }
}

window.alert = function () {
    $("#myModal .modal-body").text(arguments[0]);
    $("#myModal").modal('show');
};