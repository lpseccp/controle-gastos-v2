// Carregar dados do localStorage
let transacoes = JSON.parse(localStorage.getItem('transacoes')) || [];
let salario = parseFloat(localStorage.getItem('salario')) || 0;

// Atualizar salário
const formSalario = document.getElementById('form-salario');
if (formSalario) {
  formSalario.addEventListener('submit', (e) => {
    e.preventDefault();
    const valorSalario = document.getElementById('inputSalario').value;
    if (valorSalario) {
      salario = parseFloat(valorSalario);
      localStorage.setItem('salario', salario);
      alert('Salário atualizado!');
      document.getElementById('inputSalario').value = '';
    }
  });
}

// Adicionar nova transação
const formTransacao = document.getElementById('form-transacao');
if (formTransacao) {
  formTransacao.addEventListener('submit', (e) => {
    e.preventDefault();
    const descricao = document.getElementById('descricao').value;
    const valor = parseFloat(document.getElementById('valor').value);
    const categoria = document.getElementById('categoria').value;
    const tipo = document.getElementById('tipo').value;

    if (descricao && !isNaN(valor) && categoria && tipo) {
      transacoes.push({ descricao, valor, categoria, tipo });
      localStorage.setItem('transacoes', JSON.stringify(transacoes));
      alert('Transação adicionada com sucesso!');
      formTransacao.reset();
    }
  });
}

// Mostrar transações salvas
const listaTransacoes = document.getElementById('lista-transacoes');
if (listaTransacoes) {
  transacoes.forEach(t => {
    const li = document.createElement('li');
    li.innerText = `${t.descricao} - R$${t.valor.toFixed(2)} (${t.categoria}) [${t.tipo}]`;
    listaTransacoes.appendChild(li);
  });

  const totalReceitas = transacoes
    .filter(t => t.tipo === 'receita')
    .reduce((sum, t) => sum + t.valor, 0);

  const totalDespesas = transacoes
    .filter(t => t.tipo === 'despesa')
    .reduce((sum, t) => sum + t.valor, 0);

  const saldoAtual = salario + totalReceitas - totalDespesas;
  const saldoPrevisto = saldoAtual - (totalDespesas / (new Date().getDate()));

  if (document.getElementById('salario')) {
    document.getElementById('salario').innerText = `Salário: R$ ${salario.toFixed(2)}`;
  }
  if (document.getElementById('saldo')) {
    document.getElementById('saldo').innerText = `Saldo Atual: R$ ${saldoAtual.toFixed(2)}`;
  }
  if (document.getElementById('previsto')) {
    document.getElementById('previsto').innerText = `Saldo Previsto: R$ ${saldoPrevisto.toFixed(2)}`;
  }
}

// Mostrar gráficos
const graficoPizza = document.getElementById('graficoPizza');
const graficoBarras = document.getElementById('graficoBarras');
if (graficoPizza && graficoBarras) {
  const categorias = {};
  let totalReceitas = 0;
  let totalDespesas = 0;

  transacoes.forEach(t => {
    if (t.tipo === 'despesa') {
      categorias[t.categoria] = (categorias[t.categoria] || 0) + t.valor;
      totalDespesas += t.valor;
    } else {
      totalReceitas += t.valor;
    }
  });

  // Gráfico de Pizza (despesas por categoria)
  new Chart(graficoPizza, {
    type: 'pie',
    data: {
      labels: Object.keys(categorias),
      datasets: [{
        data: Object.values(categorias),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#FF5722'
        ]
      }]
    }
  });

  // Gráfico de Barras (receita vs despesa)
  new Chart(graficoBarras, {
    type: 'bar',
    data: {
      labels: ['Receitas', 'Despesas'],
      datasets: [{
        label: 'Valores (R$)',
        data: [totalReceitas, totalDespesas],
        backgroundColor: ['#4CAF50', '#F44336']
      }]
    }
  });

  // Alerta se ultrapassar 80% do salário ou teto
  const porcentagemGasto = (totalDespesas / salario) * 100;
  if (porcentagemGasto >= 80) {
    alert('Atenção: Você já gastou mais de 80% do seu salário!');
  }
}