const form = document.getElementById('form-contato');
const filtro = document.getElementById('filtro');
const tabelaBody = document.getElementById('corpo-tabela');
const totalEl = document.getElementById('total');
const btnLimpar = document.getElementById('btn-limpar');

// Área de edição
const formEdicao = document.getElementById('form-edicao');
const editId = document.getElementById('edit-id');
const editNome = document.getElementById('edit-nome');
const editEmail = document.getElementById('edit-email');
const editTelefone = document.getElementById('edit-telefone');
const btnAtualizar = document.getElementById('btn-atualizar');
const btnCancelar = document.getElementById('btn-cancelar');

let contatos = JSON.parse(localStorage.getItem('contatos')) || [];

function salvarNoLocalStorage() {
  localStorage.setItem('contatos', JSON.stringify(contatos));
  atualizarTotal();
}

function atualizarTotal() {
  totalEl.textContent = `Total de contatos: ${contatos.length}`;
}

function renderizarTabela(filtroTexto = '') {
  tabelaBody.innerHTML = '';

  const texto = filtroTexto.toLowerCase().trim();

  const filtrados = contatos.filter(c =>
    c.nome.toLowerCase().includes(texto)
  );

  filtrados.forEach(contato => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${contato.nome}</td>
      <td>${contato.email}</td>
      <td>${contato.telefone}</td>
      <td class="acoes">
        <button class="btn-editar" onclick="editarContato('${contato.id}')">Editar</button>
        <button class="btn-excluir" onclick="excluirContato('${contato.id}')">Excluir</button>
      </td>
    `;
    tabelaBody.appendChild(tr);
  });
}

function gerarId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function limparFormulario() {
  form.reset();
  formEdicao.style.display = 'none';
}

// Cadastrar
form.addEventListener('submit', e => {
  e.preventDefault();
  
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const telefone = document.getElementById('telefone').value.trim();

  if (!nome || !email || !telefone) return;

  const novoContato = {
    id: gerarId(),
    nome,
    email,
    telefone
  };

  contatos.push(novoContato);
  salvarNoLocalStorage();
  renderizarTabela(filtro.value);
  limparFormulario();
});

// Excluir
window.excluirContato = function(id) {
  if (!confirm('Deseja realmente excluir este contato?')) return;
  
  contatos = contatos.filter(c => c.id !== id);
  salvarNoLocalStorage();
  renderizarTabela(filtro.value);
};

// Editar
window.editarContato = function(id) {
  const contato = contatos.find(c => c.id === id);
  if (!contato) return;

  editId.value = contato.id;
  editNome.value = contato.nome;
  editEmail.value = contato.email;
  editTelefone.value = contato.telefone;

  formEdicao.style.display = 'block';
  window.scrollTo(0, formEdicao.offsetTop - 100);
};

// Salvar edição
btnAtualizar.addEventListener('click', () => {
  const id = editId.value;
  const nome = editNome.value.trim();
  const email = editEmail.value.trim();
  const telefone = editTelefone.value.trim();

  if (!nome || !email || !telefone) {
    alert('Preencha todos os campos!');
    return;
  }

  const index = contatos.findIndex(c => c.id === id);
  if (index !== -1) {
    contatos[index] = { id, nome, email, telefone };
    salvarNoLocalStorage();
    renderizarTabela(filtro.value);
    formEdicao.style.display = 'none';
  }
});

// Cancelar edição
btnCancelar.addEventListener('click', () => {
  formEdicao.style.display = 'none';
});

// Filtrar em tempo real
filtro.addEventListener('input', () => {
  renderizarTabela(filtro.value);
});

// Limpar formulário
btnLimpar.addEventListener('click', limparFormulario);

// Inicialização
atualizarTotal();
renderizarTabela();