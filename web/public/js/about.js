
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
var crsRef = fb.database().ref(`course`);
var docStgRef = fb.storage().ref(`course`);

const tchRef = fb2.database().ref('teacher')

//load data once per refresh not realtime 
tchRef.once('value', function (snapshot2) {
    const teacherList = {}
    Object.keys(snapshot2.val() || {}).forEach(userK => {
        teacherList[userK] = [snapshot2.val()[userK].title, snapshot2.val()[userK].name, snapshot2.val()[userK].surname].join(' ')
    })
    crsRef.once('value', function (snapshot) {
        const result = snapshot.val() || {}
        Object.keys(result).forEach(course => {
            if (course !== 'inside') {
                const make = positions.map(p => p.en)
                // Object.keys(result[course].teacher || {}).forEach(position => {
                make.forEach(position => {
                    Object.keys(result[course].teacher[position]||{}).forEach(userKey => {
                        $(`#teacher-zone-${course}`).append(teacherHtml(teacherList[result[course].teacher[position][userKey]], position))
                    })
                })
                Object.keys(result[course].document || {}).forEach(docKey => {
                    const temp = result[course].document[docKey]
                    $(`#doc-zone-${course}`).append(docHtml(temp.name, temp.url))
                })
            } else {
                Object.keys(result['inside'] || {}).forEach(docType => {
                    Object.keys(result['inside'][docType] || {}).forEach(docKey => {
                        const temp = result['inside'][docType][docKey]
                        $(`#doc-zone-inside-${docType}`).append(docHtml(temp.name, temp.url))
                    })
                })
            }
        })
    });
})

const positions = [{
    html: '<div class="price-item-mainmenu txt21"> ประธานหลักสูตร </div>', // ประธานหลักสูตร 
    th: 'ประธานหลักสูตร',
    en: 'president'
}, {
    html: '', // คณะกรรมการหลักสูตร
    th: 'คณะกรรมการหลักสูตร',
    en: 'committee'
}, {
    html: '<div class="price-item-mainmenu txt21"> เลขานุการ </div>', // เลขานุการ
    th: 'เลขานุการ',
    en: 'secretary'
}, {
    html: '<div class="price-item-mainmenu txt21"> อนุกรรมการบัณฑิต </div>', // อนุกรรมการบัณฑิต
    th: 'อนุกรรมการบัณฑิต',
    en: 'subcommittee'
}]

function teacherHtml(name, position) { // id="teacher-zone-bachelor"  
    console.log(position)
    let html = ''
    html += '<div class="item-mainmenu m-b-20">'
    html += '<div class="flex-w flex-b">'
    html += '<div class="name-item-mainmenu txt21">'
    html += name
    html += '</div>'
    html += '<div class="line-item-mainmenu bg3-pattern"></div>'
    html += positions.find(p => p.en === position).html
    html += '</div>'
    html += '</div>'
    return html
}

function docHtml(name, url) { // id="doc-zone-bachelor"     
    let html = ''
    html += '<div class="item-mainmenu m-b-36">'
    html += '<div class="flex-w flex-b">'
    html += `<a class="name-item-mainmenu" href="${url}">`
    html += ' <div class="name-item-mainmenu txt21">'
    html += name
    html += '</div>'
    html += '</a>'
    html += '</div>'
    html += '</div>'
    return html
}


