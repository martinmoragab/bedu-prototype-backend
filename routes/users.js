/*const router = require('express').Router();
const {
  crearUsuario,
  obtenerUsuarios,
  modificarUsuario,
  eliminarUsuario
} = require('../controllers/usuarios')

router.get('/', obtenerUsuarios)
router.post('/', crearUsuario)
router.put('/:id', modificarUsuario)
router.delete('/:id', eliminarUsuario)

module.exports = router;*/

const router = require('express').Router();
const {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  logIn
} = require('../controllers/users')
const auth = require('./auth');

router.get('/', auth.requerido, getUsers)
router.get('/:id', auth.requerido, getUsers);
router.post('/', createUser)
router.post('/login', logIn)
router.put('/:id', auth.requerido, updateUser)
router.delete('/:id', auth.requerido, deleteUser)

module.exports = router;