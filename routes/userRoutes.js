const express = require('express')
const router = express.Router();
const {
    authenticateUser,
    authorizePermissions
} = require('../middleware/authMiddleware')

const  {
    getAllAdmins,
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword,
    deleteUser
} = require('../controllers/userController')

router.route('/').get(authenticateUser,authorizePermissions("admin"),getAllUsers)

router.route('/admins').get(authenticateUser , authorizePermissions('admin') , getAllAdmins)
router.route('/showMe').get(authenticateUser,showCurrentUser);
router.route('/updateUser').patch( authenticateUser,updateUser);
router.route('/deleteUser').delete(authenticateUser , deleteUser)
router.route('/updateUserPassword').patch(authenticateUser,updateUserPassword)

router.route('/:id').get(authenticateUser , getSingleUser)

module.exports = router