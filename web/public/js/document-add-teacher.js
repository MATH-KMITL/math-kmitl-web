function readTeacherDataFromFirebase() {
    const config = {
        apiKey: "AIzaSyDHN6epAFTpGwywxeqKpc1vzNERGLYfguE",
        authDomain: "math-web-kmitl.firebaseapp.com",
        databaseURL: "https://math-web-kmitl.firebaseio.com",
        projectId: "math-web-kmitl",
        storageBucket: "math-web-kmitl.appspot.com",
        messagingSenderId: "481311539108"
    };
    const fb = firebase.initializeApp(config);

    const tchRef = fb.database().ref('teacher');

    tchRef.once('value', function (snapshot) {
        if (snapshot) {
            snapshot.forEach(function (teacher) {
                const key = teacher.key;
                const teacherData = teacher.val();
                const teacherName = [teacherData.title, teacherData.name, teacherData.surname].join(' ')
                // add menu 
                $('#teacher').append(teacherHtml(key, teacherName));
            });
        }
    });
}

readTeacherDataFromFirebase()

function teacherHtml(userKey, teacherName) {
    let html = `<option value="${userKey}" > ${teacherName} </option>`
    return html
}

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

var techerName = ''

$("#teacher").on('change', function ({ target: { selectedOptions: { 0: { outerText } } } }) { // e.target.value
    techerName = outerText.trim()
})

const config2 = {
    apiKey: "AIzaSyBn6rrMZkB4eFq_XWT9iLawqLw3z-QYyac",
    authDomain: "math-web-kmitl-gallery.firebaseapp.com",
    databaseURL: "https://math-web-kmitl-gallery.firebaseio.com",
    projectId: "math-web-kmitl-gallery",
    storageBucket: "math-web-kmitl-gallery.appspot.com",
    messagingSenderId: "1016085984216"
};

const fb2 = firebase.initializeApp(config2, "secondary");

const course = sessionStorage.getItem('documentCourse')
const crsRef = fb2.database().ref(`course/${course}/teacher`);

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

function addTeacher() {
    if (document.getElementById('teacher').value !== 'dont-select') {
        crsRef.once('value', function (snapshot) {
            const result = snapshot.val()
            const position = document.getElementById('position').value
            if (result) {
                const techerKey = document.getElementById('teacher').value
                const alluser = Object.keys(result[position] || []).map(k => result[position][k])
                // Object.keys(result.president || []).map(k => result.president[k]).concat(
                //     Object.keys(result.committee || []).map(k => result.committee[k]).concat(
                //         Object.keys(result.secretary || []).map(k => result.secretary[k]).concat(
                //             Object.keys(result.subcommittee || []).map(k => result.subcommittee[k])
                //         )
                //     )
                // )
                if (alluser.some(tk => tk === techerKey)) {
                    swal('เกิดข้อผิดพลาด', ` อาจารย์ : ${techerName} \n เป็น${positions.find(p => p.en === position).th}อยู่แล้ว `, "error")
                } else {
                    const arr = Object.keys(result[position] || []).map(k => result[position][k])
                    setTeacherToFirebase(crsRef.child(`${position}`), arr)
                }
            } else {
                setTeacherToFirebase(crsRef.child(`${position}`), [])
            }
        });
    }
}

function setTeacherToFirebase(ref, arr) {
    const techerKey = document.getElementById('teacher').value
    arr.push(techerKey)
    ref.set(arr).then(() => {
        swal('เพิ่มสำเร็จ', 'เสร็จสิ้น!', "success").then(function (value) { window.location.href = `document-manager-${course}.html` })
    })
}

window.alert = function () {
    $("#myModal .modal-body").text(arguments[0]);
    $("#myModal").modal('show');
};