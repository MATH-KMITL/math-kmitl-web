
function createMenu(groupAndSub) {
    const group = groupAndSub.split('-submenu-')[0]
    const subgroup = groupAndSub.split('-submenu-')[1]
    // see icon at https://themify.me/themify-icons 
    const grouplist = [{
        group: 'User Profile',
        href: 'admin.html',
        icon: 'ti-user'
    }, {
        group: 'Staff Management',
        href: 'manage.html',
        icon: 'ti-list'
    }, {
        group: 'Student Management',
        href: 'std-manage.html',
        icon: 'ti-id-badge'
    }, {
        group: 'Event Management',
        href: '#', 
        icon: 'ti-gallery',
        submenu: [{
            group: 'Events Comings',
            href: 'events-comings.html',
            icon: 'ti-pin-alt'
        }, {
            group: 'Event Galley',
            href: 'event-manage.html',
            icon: 'ti-gallery'
        }, {
            group: 'Events Other',
            href: 'events-other.html',
            icon: 'ti-image'
        }]
    }, {
        group: 'Special Problems Management',
        href: 'special-problems-manage.html',
        icon: 'ti-bookmark-alt'
    }, {
        group: 'Document Management',
        href: '#', // document-manager-bachelor.html
        icon: 'ti-clipboard',
        submenu: [{
            group: 'Bachelor',
            href: 'document-manager-bachelor.html',
            icon: ''
        }, {
            group: 'Master',
            href: 'document-manager-master.html',
            icon: ''
        }, {
            group: 'Doctor',
            href: 'document-manager-doctor.html',
            icon: ''
        }, {
            group: 'Inside',
            href: 'document-manager-inside.html',
            icon: 'ti-agenda'
        }]
    }]
    if (grouplist.some(g => g.group === group)) {
        grouplist.forEach(g => {
            const cGrroup = g.group.split(' ').join('-')
            let html = ''
            html += g.group === group ? '<li class="active">' : '<li>'
            html += g.submenu ? `<a href="${g.group === group ? '#' : g.href}" onclick="openSubmenu('${cGrroup}')">` : `<a href="${g.group === group ? '#' : g.href}">`
            html += g.group === group ? `<i class="${g.icon}"></i>` : `<i class="${g.icon}" aria-hidden="true"></i>`
            html += g.group
            html += '</a>'
            html += '</li>'
            $('#menu-admin').append(html)
            if (g.submenu) {
                g.submenu.forEach(sg => {
                    let shtml = ''
                    shtml += sg.group === subgroup ? `<li class="active ${cGrroup}">` : `<li class="${cGrroup}">`
                    shtml += sg.group === subgroup ? '<a href="#" >' : `<a href="${sg.href}" >`
                    shtml += '<i class="ti-control-play"></i>'
                    shtml += sg.group === subgroup ? `<i class="${sg.icon}"></i>` : `<i class="${sg.icon}" aria-hidden="true"></i>`
                    shtml += sg.group
                    shtml += '</a>'
                    shtml += '</li>'
                    $('#menu-admin').append(shtml)
                })
                stateHidden[cGrroup] = true
                // console.log(subgroup, g.submenu.some(sg => sg.group === subgroup))
                if (!g.submenu.some(sg => sg.group === subgroup)) {
                    $(`.${cGrroup}`).hide()
                }
            }
        })
        let html = ''
        html += '<li>'
        html += '<a href="#" onclick="resetPassword()">'
        html += '<i class="ti-settings"></i>'
        html += 'Reset Password'
        html += '</a>'
        html += '</li>'
        html += '<li>'
        html += '<a href="#" onclick="signOut()">'
        html += '<i class="ti-new-window"></i>'
        html += 'Sign Out'
        html += '</a>'
        html += '</li>'
        $('#menu-admin').append(html)
    } else {
        console.log(` ไม่มี menu : ${group} นะ `)
    }
}

var stateHidden = {}

function openSubmenu(group) {
    if (stateHidden[group]) {
        $(`.${group}`).show()
    } else {
        $(`.${group}`).hide()
    }
    stateHidden[group] = !stateHidden[group]
}


