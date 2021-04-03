module.exports.formatDate = (x, reqDate) => {
    let year = x.getFullYear();
    let month = x.getMonth();
    let dt = x.getDate();
    if (dt < 10) {
        dt = '0' + dt;
    }
    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    let date = `${monthNames[month]} ${dt}, ${year}`;
    if (reqDate === false) {
        date = `${monthNames[month]} ${year}`;
    }
    return date;
};

module.exports.isFollowing = (signedInUser, id) => {
    for (let obj of signedInUser.following) {
        if (obj.equals(id)) {
            return true;
        }
    }
    return false;
};

module.exports.hasAldreadyLiked = (post, signedInUserId) => {
    for (let likedUser of post.likes) {
        if (likedUser.equals(signedInUserId)) {
            return true;
        }
    }
    return false;
};

module.exports.majorityFollowing = (l1, l2) => {
    let list = l1.concat(l2);
    let c = 0;
    let count = 0;
    for (let i = 0; i < list.length; i++) {
        if (count == 0) {
            c = list[i];
            count++;
        } else if (list[i].equals(c)) {
            count++;
        } else {
            count--;
        }
    }
    return c;
};


