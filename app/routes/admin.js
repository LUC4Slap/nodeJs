module.exports = function(application) {
  application.get('/formulario_inclusao_noticia', function(req, res) {
    res.render('admin/form_add_noticia', { validacao: {} });
  });

  application.post('/noticias/salvar', function(req, res) {
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
      res.render('admin/form_add_noticia', { validacao: erros });
      return;
    }

    var connection = application.config.dbConnection();
    var NoticiasDAO = new application.app.models.NoticiasDAO(connection);

    NoticiasDAO.salvarNoticia(noticia, function(error, result) {
      res.redirect('/noticias');
    });
  });
};
