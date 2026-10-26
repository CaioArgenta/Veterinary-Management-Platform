
function apenasAdministrador(req, res, next) {
  if (req.perfil?.tipo !== 'ADMINISTRADOR') {
    return res.status(403).json({
      mensagem: 'Apenas o administrador pode gerenciar funcionários.'
    })
  }

  next()
}

module.exports = apenasAdministrador
