module.exports = async (oldUser, newUser) => {
    if (oldUser.tag != newUser.tag) require('../src/modules/logging').usernameUpdate(oldUser, newUser);
    //maybe logging avatar changes can be implemented later...
    // if (oldUser.avatar != newUser.avatar) await require('../src/modules/logging').avatarUpdate(oldUser, newUser);
}