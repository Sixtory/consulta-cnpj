$(document).ready(function () {
  // Evento de submissão do formulário
  $('#cnpj-form').on('submit', function (e) {
    e.preventDefault();
    const cnpj = $('#cnpj').val().replace(/\D/g, '');

    // Verificação básica do CNPJ
    if (cnpj.length !== 14) {
      alert('CNPJ inválido');
      return;
    }

    // Consulta à API para obter dados do CNPJ
    $.get(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`, function (data) {
      // Renderização dos dados da empresa
      renderCompanyData(data);

      var editedData = {
        nome_fantasia: data.nome_fantasia,
        razao_social: data.razao_social,
        data_inicio_atividade: data.data_inicio_atividade,
        situacao_cadastral: data.situacao_cadastral,
        descricao_situacao_cadastral: data.descricao_situacao_cadastral,
        cnae_fiscal_descricao: data.cnae_fiscal_descricao,
        logradouro: data.logradouro,
        numero: data.numero,
        bairro: data.bairro,
        municipio: data.municipio,
        uf: data.uf,
        cep: data.cep,
        ddd_telefone_1: data.ddd_telefone_1,
        email: data.email,
        qsa: []
      };

      data.qsa.forEach(socio => {
        const socioData = {
          nome_socio: socio.nome_socio,
          qualificacao_socio: socio.qualificacao_socio
        };
        editedData.qsa.push(socioData);
      });

      // Modo de edição
      $('#edit-mode').show();
      $('#edit-mode').off('click').on('click', function () {
        console.log(`${editedData.nome_fantasia}`);
        renderEditForm(editedData);
      });

      // Submissão da edição
      $('#submit-edit').off('click').on('click', function () {
        editedData = {
          nome_fantasia: $('#nome').val(),
          razao_social: $('#razao_social').val(),
          data_inicio_atividade: $('#data_inicio_atividade').val(),
          situacao_cadastral: $('#situacao').val(),
          descricao_situacao_cadastral: $('#descricao_situacao').val(),
          cnae_fiscal_descricao: $('#cnae_fiscal_descricao').val(),
          logradouro: $('#endereco').val().split(',')[0],
          numero: $('#endereco').val().split(',')[1],
          bairro: $('#endereco').val().split(',')[2],
          municipio: $('#endereco').val().split(',')[3],
          uf: $('#endereco').val().split(',')[4],
          cep: $('#endereco').val().split(',')[5],
          ddd_telefone_1: $('#telefone').val(),
          email: $('#email').val(),
          qsa: []
        };

        $('#socios .card').each(function (index) {
          const socio = {
            nome_socio: $(`#nome_socio_${index}`).val(),
            qualificacao_socio: $(`#qualificacao_socio_${index}`).val()
          };
          editedData.qsa.push(socio);
        });

        console.log('Dados Editados:', editedData);

        // Renderizar dados editados
        renderCompanyData(editedData);
        $('#edit-mode').show();
        $('#submit-edit').hide();
      });
    });
  });

  // Função para renderizar os dados da empresa
  function renderCompanyData(data) {
    $('#results').html(`
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">${data.nome_fantasia}</h5>
          <p class="card-text">
            <strong>Razão Social:</strong> ${data.razao_social}<br>
            <strong>Data de Abertura:</strong> ${data.data_inicio_atividade}<br>
            <strong>Situação Cadastral:</strong> ${data.situacao_cadastral}<br>
            <strong>Descrição Situação Cadastral:</strong> ${data.descricao_situacao_cadastral}<br>
            <strong>Atividade Principal:</strong> ${data.cnae_fiscal_descricao}<br>
            <strong>Endereço Completo:</strong> ${data.logradouro}, ${data.numero}, ${data.bairro}, ${data.municipio}, ${data.uf}, ${data.cep}<br>
            <strong>Telefone:</strong> ${data.ddd_telefone_1}<br>
            <strong>E-mail:</strong> ${data.email}
          </p>
          <h5 class="card-title mt-4">Sócios</h5>
          <div id="socios"></div>
        </div>
      </div>
    `);

    data.qsa.forEach(socio => {
      $('#socios').append(`
        <div class="card mt-2">
          <div class="card-body">
            <h5 class="card-title">${socio.nome_socio}</h5>
            <p class="card-text">
              <strong>Qualificação:</strong> ${socio.qualificacao_socio}
            </p>
          </div>
        </div>
      `);
    });
  }

  // Função para renderizar o formulário de edição
  function renderEditForm(data) {
    $('#results').html(`
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Dados da Empresa</h5>
          <p class="card-text">
            <label>Nome:</label> <input type="text" class="form-control" id="nome" value="${data.nome_fantasia}"><br>
            <label>Razão Social:</label> <input type="text" class="form-control" id="razao_social" value="${data.razao_social}"><br>
            <label>Data de Abertura:</label> <input type="text" class="form-control" id="data_inicio_atividade" value="${data.data_inicio_atividade}"><br>
            <label>Situação:</label> <input type="text" class="form-control" id="situacao" value="${data.situacao_cadastral}"><br>
            <label>Descrição Situação:</label> <input type="text" class="form-control" id="descricao_situacao" value="${data.descricao_situacao_cadastral}"><br>
            <label>Atividade Principal:</label> <input type="text" class="form-control" id="cnae_fiscal_descricao" value="${data.cnae_fiscal_descricao}"><br>
            <label>Endereço Completo:</label> <input type="text" class="form-control" id="endereco" value="${data.logradouro}, ${data.numero}, ${data.bairro}, ${data.municipio}, ${data.uf}, ${data.cep}"><br>
            <label>Telefone:</label> <input type="text" class="form-control" id="telefone" value="${data.ddd_telefone_1}"><br>
            <label>E-mail:</label> <input type="text" class="form-control" id="email" value="${data.email}">
          </p>
          <h5 class="card-title mt-4">Sócios</h5>
          <div id="socios"></div>
        </div>
      </div>
    `);

    data.qsa.forEach((socio, index) => {
      $('#socios').append(`
        <div class="card mt-2">
          <div class="card-body">
            <input type="text" class="card-title form-control" id="nome_socio_${index}" value="${socio.nome_socio}"><br>
            <label>Qualificação:</label> <input type="text" class="form-control" id="qualificacao_socio_${index}" value="${socio.qualificacao_socio}">
          </div>
        </div>
      `);
    });

    $('#edit-mode').hide();
    $('#submit-edit').show();
  }
});
