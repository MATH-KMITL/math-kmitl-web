
function createMenu(group) {
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
        group: 'Events Comings',
        href: 'events-comings.html',
        icon: 'ti-image'
    }, {
        group: 'Event Management',
        href: 'event-manage.html',
        icon: 'ti-map-alt'
    }, {
        group: 'Events Other',
        href: 'events-other.html',
        icon: 'ti-gallery'
    }, {
        group: 'Special Problems Management',
        href: 'special-problems-manage.html',
        icon: 'ti-clipboard'
    }]
    if (grouplist.some(g => g.group === group)) {
        grouplist.forEach(g => {
            let html = ''
            html += g.group === group ? '<li class="active">' : '<li>'
            html += g.group === group ? '<a href="#" >' : `<a href="${g.href}" >`
            html += g.group === group ? `<i class="${g.icon}"></i>` : `<i class="${g.icon}" aria-hidden="true"></i>`
            html += g.group
            html += '</a>'
            html += '</li>'
            $('#menu-admin').append(html)
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
