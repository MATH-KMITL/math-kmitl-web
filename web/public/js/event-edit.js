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
var StgRef = firebase.storage().ref('event')

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
});

function categoryHtml(key, categoryName) {
    let html = `<option value="${key}"> ${categoryName} </option>`
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

$("#event").on('change', function ({ target: { value, selectedOptions: { 0: { outerText } } } }) { // e.target.value 
    document.getElementById('text-add-event').hidden = value === 'dont-select'
    document.getElementById('event-name').value = outerText.trim()
})

function chageName() {
    if (document.getElementById('event').value !== 'dont-select') {
        const key = document.getElementById('event').value
        const newName = document.getElementById('event-name').value.trim()
        spRef.child(`${key}/displayName`).set(newName).then(() => {
            swal('เปลี่ยนชื่อกิจกรรม สำเร็จ', { icon: "success" }).then(function (value) { window.location.href = 'event-manage.html' })
        })
    }
}

function deleteEvent() {
    if (document.getElementById('event').value !== 'dont-select') {
        const categoryKey = document.getElementById('event').value
        swal({
            title: "คำเตือน",
            text: "ถ้าคุณลบแล้วจะไม่สามารถกู้ข้อมูลกลับมาได้อีก",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    spRef.child(`${categoryKey}`).once('value', (snapshot) => {
                        const categoryName = snapshot.val().originalName
                        const image = snapshot.val().image
                        // StgRef.child(`${categoryName}(ctgKey ${categoryKey})`).delete()
                        const delRef = StgRef.child(`${categoryName}(ctgKey ${categoryKey})`)
                        Object.keys(image).forEach(async (imgKey) => {
                            await delRef.child(`(imgKey ${imgKey})${image[imgKey]}`).delete()
                        })
                    }).then(() => {
                        spRef.child(categoryKey).remove().then(() => {
                            swal("ข้อมูลกิจกรรมนี้ถูกลบไปแล้ว", { icon: "success" }).then(function (value) { window.location.href = 'event-manage.html' });
                        })
                    })
                }
            });
    }

}

window.alert = function () {
    $("#myModal .modal-body").text(arguments[0]);
    $("#myModal").modal('show');
};