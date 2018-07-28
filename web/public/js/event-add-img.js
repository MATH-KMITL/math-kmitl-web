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
var spRef = firebase.database().ref('category');
var StgRef = firebase.storage().ref('event');

console.log('ctgRef', spRef)
//load data once per refresh not realtime
spRef.once('value', function (snapshot) {
    //for in every child of data
    if (snapshot) {
        snapshot.forEach(function (category) {
            var key = category.key;
            var categoryData = category.val();
            console.log('categoryData', categoryData)
            // add menu 
            $('#event').append(categoryHtml(key, categoryData.displayName));
        });
    }
    $('#event').append(categoryHtml('add', 'เพิ่มกิจกรรมใหม่'));
});

function categoryHtml(key, categoryName) {
    let html = `<option value="${key}" id="${categoryName}"> ${categoryName} </option>`
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

var categoryName = ''

$("#event").on('change', function ({ target: { value, selectedOptions: { 0: { outerText } } } }) { // e.target.value
    document.getElementById('text-add-event').hidden = value !== 'add'
    categoryName = outerText.trim()
    validateSubmitButton()
})

var files

$("#input-img").on('change', function ({ target: { files: a } }) { // e.target.files 
    files = a
    document.getElementById('img-zone').hidden = false
    if (files) {
        Object.keys(files).map(key => files[key]).forEach(function (file) {
            const tmppath = URL.createObjectURL(file)
            $('#img-upload-zone').append(imgHtml(tmppath));
        })
    }
    validateSubmitButton()
})

function validateSubmitButton() {
    console.log('files', files)
    console.log('files', files == {})
    console.log('document.getElementById.value', document.getElementById('event').value === 'dont-select')
    console.log('files', document.getElementById('import button').hidden)
    document.getElementById('import button').hidden = !files || document.getElementById('event').value === 'dont-select'
    console.log('files', document.getElementById('import button').hidden)
}

function imgHtml(img) {
    let html = ''
    html += `<div class="item-gallery isotope-item bo-rad-10 hov-img-zoom events ">`
    html += `<img src="${img}" alt="IMG-GALLERY">`
    html += '<div id="btn-show" class="overlay-item-gallery trans-0-4 flex-c-m">'
    html += `<a class="btn-show-gallery flex-c-m" href=${img} data-lightbox="gallery"><div class="fa fa-search"></div></a>`
    html += '</div>'
    html += '</div>'
    return html
}

function uploadImg() {
    if (files && document.getElementById('event').value !== 'dont-select') {
        document.getElementById('btn-upload').hidden = true
        document.getElementById('wait-txt').hidden = false
        let categoryKey = document.getElementById('event').value // === 'add' ? document.getElementById('event-name').value : document.getElementById('event').value
        console.log(categoryKey, categoryName)
        if (categoryKey === 'add') { // new category
            const { key: newCategoryKey } = spRef.push({
                displayName: document.getElementById('event-name').value.trim(),
                originalName: document.getElementById('event-name').value.trim()
            })
            categoryKey = newCategoryKey
            categoryName = document.getElementById('event-name').value.trim()
        }
        let count = 0
        Object.keys(files).map(key => files[key]).forEach(async function (file, index, arr) {
            const { key: imgKey } = spRef.child(`${categoryKey}/image`).push({ name: file.name })
            const refForStorage = `${categoryName}(ctgKey ${categoryKey})/(imgKey ${imgKey})${file.name}`
            StgRef.child(refForStorage).put(file).then(snapshot => {
                return snapshot.ref.getDownloadURL()
            }).then(async (url) => {
                await spRef.child(`${categoryKey}/image/${imgKey}/url`).set(url)
                $('#wait-txt').append('.')
                if (arr.length === ++count) goBack()
            })

        })
    }
}

function goBack() {
    console.log(' -------------------------------------------------- ---------------------------------------------------- ')
    swal('upload สำเร็จ', 'เสร็จสิ้น!', "success").then(function (value) { window.location.href = 'event-manage.html' })
    // window.location.href = "event-manage.html"
}

window.alert = function () {
    $("#myModal .modal-body").text(arguments[0]);
    $("#myModal").modal('show');
};