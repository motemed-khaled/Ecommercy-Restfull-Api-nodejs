export const sanitizeUserSignUp = function(user) {
    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    };
  };
  
export const sanitizeUserLogin = function (user) {
    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active,
        wishList: user.wishList,
        addresses: user.addresses
    };
};