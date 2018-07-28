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

var dataFormDatabase = {}
//load data once per refresh not realtime
spRef.once('value', function (snapshot) {
    //for in every child of data
    if (snapshot) {
        snapshot.forEach(function (year) {
            var key = year.key;
            dataFormDatabase[key] = year.val()
            // add menu 
            $('#sp-menu').append(menuHtml(key));
        });
    }
    $('#sp-menu').append(`<option value="add"> เพิ่มปีการศึกษาใหม่ </option>`);
});

function menuHtml(key) {
    let html = `<option value="${key}"> ${key} </option>`
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

var addedOld = 0
var addedNew = 0

$("#sp-menu").on('change', function ({ target: { value } }) { // e.target.value 
    document.getElementById('text-add-sp').hidden = value !== 'add'
    $('#add-space').empty()
    addedOld = value === 'add' ? 0 : Object.keys(dataFormDatabase[value]).length
    addSpText()
})

$("#year-txt").on('input', function () { // change key in addSpInputText 
    if (document.getElementById('year-txt').value.length === 4) {
        let count = 0
        $('.sp-key').each(function () {
            $(this).empty()
            const year = document.getElementById('year-txt').value
            const keyForAdded = [year.substr(2, 4), ++count].join('M_')
            $(this).append(keyForAdded)
        })
    }
})

function addSpText() {
    if ((
        document.getElementById('sp-menu').value !== 'dont-select' &&
        document.getElementById('sp-menu').value !== 'add') || (
            document.getElementById('sp-menu').value === 'add' &&
            document.getElementById('year-txt').value.length === 4
        )) {
        const year = document.getElementById('sp-menu').value === 'add'
            ? document.getElementById('year-txt').value
            : document.getElementById('sp-menu').value
        const keyForAdded = [year.substr(2, 4), addedOld + ++addedNew].join('M_')
        $('#add-space').append(addSpInputTextHtml(keyForAdded));
    }
}

var originKeyList = []

function addSpInputTextHtml(key) {
    originKeyList.push(key)
    let html = ''
    html += `<div class="row sp-group-input" id="row${key}" >`
    html += '<div class="col-md-2">'
    html += '<div class="form-group">'
    html += `<label id="key-${key}" class="form-control border-input flex-c-m sp-key">${key}</label>`
    html += '</div>'
    html += '</div>'
    html += '<div class="col-md-4">'
    html += '<div class="form-group">'
    html += `<input type="text" id="${key}" class="form-control border-input sp-text" placeholder="ชื่อปัญหาพิเศษ">`
    html += '</div>'
    html += '</div>'
    html += '<div class="col-md-3" id="text-add-sp">'
    html += '<div class="form-group flex-c-m">'
    html += `<span class="btn btn-del" onclick="deleteSp('${key}')">` // originKeyList.indexOf(key)
    html += 'ลบปัญหาพิเศษ'
    html += '</span>'
    html += '</div>'
    html += '</div>'
    html += '</div>'
    return html
}

function deleteSp(key) {
    $(`#row${key}`).remove()
    console.log('from', originKeyList)
    originKeyList = originKeyList.filter(k => k !== key) // .filter( (k,i)=>i===index) .splice(index, 1)
    console.log('deleted', originKeyList)
    // change to top 
    let count = addedOld
    $('.sp-key').each(function () {
        $(this).empty()
        const year = document.getElementById('sp-menu').value === 'add'
            ? document.getElementById('year-txt').value
            : document.getElementById('sp-menu').value
        const keyForAdded = [year.substr(2, 4), ++count].join('M_')
        $(this).append(keyForAdded)
    })
}

function uploadSp() {
    if ((
        document.getElementById('sp-menu').value !== 'dont-select' &&
        document.getElementById('sp-menu').value !== 'add') || (
            document.getElementById('sp-menu').value === 'add' &&
            document.getElementById('year-txt').value.length === 4
        )) {
        const year = document.getElementById('sp-menu').value === 'add'
            ? document.getElementById('year-txt').value
            : document.getElementById('sp-menu').value
        const newObjUpload = {}
        let haveEmpty = false
        const keysEmpty = []
        console.log(originKeyList)
        originKeyList.forEach(function (originKey) {
            const key = document.getElementById(`key-${originKey}`).innerText
            const spName = document.getElementById(originKey).value
            if (spName.trim() === '') {
                haveEmpty = true
                keysEmpty.push(key)
                // originKeyList.length = 0
            }
            newObjUpload[key] = spName.trim()
        })
        if (!haveEmpty) {
            const targetRef = spRef.child(year)
            targetRef.on('value', function (snapshot) {
                const objUpload = { ...snapshot.val(), ...newObjUpload }
                targetRef.set(objUpload).then(
                    swal('upload สำเร็จ', 'เสร็จสิ้น!', "success").then(function (value) { window.location.href = 'special-problems-manage.html' })
                )
            })

        } else {
            swal('ชื่อปัญหาพิเศษเว้นว่าง', ` รหัส : ${keysEmpty.join(', ')} `, 'error') // { icon: 'error' }
        }
    }
}

window.alert = function () {
    $("#myModal .modal-body").text(arguments[0]);
    $("#myModal").modal('show');
};