module.exports.formulario_inclusao_noticia = (application, req, res) => {
  res.render('admin/form_add_noticia', { validacao: {}, noticia: {} });
};

module.exports.noticias_salvar = (application, req, res) => {
  var noticia = req.body;

  req.assert('titulo', 'Titulo é obrigatório').notEmpty();
  req.assert('resumo', 'Resumo é obrigatório').notEmpty();
  req
    .assert('resumo', 'Resumo deve conter entre 10 e 100 caracteres')
    .len(10, 100);
  req.assert('autor', 'Autor é obrigatório').notEmpty();
  req
    .assert('data', 'Data é obrigatório')
    .notEmpty()
    .isDate({ format: 'YYYY-MM-DD' });
  req.assert('noticia', 'Notcia é obrigatório').notEmpty();

  var erros = req.validationErrors();

  if (erros) {
    res.render('admin/form_add_noticia', {
      validacao: erros,
      noticia: noticia,
    });
    return;
  }

  var connection = application.config.dbConnection();
  var NoticiasDAO = new application.app.models.NoticiasDAO(connection);

  NoticiasDAO.salvarNoticia(noticia, function(error, result) {
    res.redirect('/noticias');
  });
};
