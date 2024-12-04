const produtos = JSON.parse(localStorage.getItem("produtos")) || [];  // Inicia como um array vazio se não houver dados no localStorage
const tabela = document.getElementById("tabela-produtos");
let produtoEditando = null;  // Variável que armazena o produto que está sendo editado

// Função para renderizar a tabela de produtos
function renderizarTabela() {
    tabela.innerHTML = "";  // Limpa a tabela antes de renderizar novamente
    produtos.forEach((produto) => {
        const linha = `
            <tr>
                <td>${produto.id}</td>
                <td>${produto.nome}</td>
                <td>${produto.quantidade}</td>
                <td>${produto.descrição}</td>
                <td>
                    <div class="btn btn-sm btn-primary" onclick="prepareEditProduct(${produto.id})" data-bs-toggle="modal" data-bs-target="#modalEditarProduto">Editar</div>
                    <div class="btn btn-sm btn-danger" onclick="apagarProduto(${produto.id})">Excluir</div>
                </td>
            </tr>
        `;
        tabela.innerHTML += linha;
    });
}

// Função para adicionar um novo produto
function adicionarProduto(produtoNovo) {
    produtos.push(produtoNovo);
    localStorage.setItem("produtos", JSON.stringify(produtos));
    renderizarTabela();
}

// Função chamada quando o botão "Adicionar" é clicado
function prepareAddProduct() {
    produtoEditando = null;  // Garantir que estamos adicionando um novo produto
    document.getElementById("formulario_modal_adicionar").reset();
    document.querySelector("#modalAdicionarProduto .modal-title").innerText = "Adicionar Produto";  // Alterar título do modal
}

// Função para editar um produto
function prepareEditProduct(id) {
    produtoEditando = produtos.find((produto) => produto.id === id);
    document.getElementById("nome_produto_edit").value = produtoEditando.nome;
    document.getElementById("quantidade_produto_edit").value = produtoEditando.quantidade;
    document.getElementById("descrição_produto_edit").value = produtoEditando.descrição;
    document.querySelector("#modalEditarProduto .modal-title").innerText = "Editar Produto";  // Alterar título do modal
}

// Função chamada ao submeter o formulário de produto (Adicionar)
document.getElementById("formulario_modal_adicionar").addEventListener("submit", (event) => {
    event.preventDefault();

    const produtoNovo = {
        id: (produtos[produtos.length - 1]?.id || 0) + 1,
        nome: document.getElementById("nome_produto").value,
        quantidade: document.getElementById("quantidade_produto").value,
        descrição: document.getElementById("descrição_produto").value
    };

    adicionarProduto(produtoNovo);

    localStorage.setItem("produtos", JSON.stringify(produtos));
    renderizarTabela();
    $('#modalAdicionarProduto').modal('hide');  // Fecha o modal após salvar
});

// Função chamada ao submeter o formulário de produto (Editar)
document.getElementById("formulario_modal_editar").addEventListener("submit", (event) => {
    event.preventDefault();

    const produtoEditado = {
        id: produtoEditando.id,
        nome: document.getElementById("nome_produto_edit").value,
        quantidade: document.getElementById("quantidade_produto_edit").value,
        descrição: document.getElementById("descrição_produto_edit").value
    };

    const index = produtos.findIndex((produto) => produto.id === produtoEditando.id);
    produtos[index] = produtoEditado;

    localStorage.setItem("produtos", JSON.stringify(produtos));
    renderizarTabela();
    $('#modalEditarProduto').modal('hide');  // Fecha o modal após salvar
});

// Função para excluir um produto
function apagarProduto(id) {
    const produtoEncontrado = produtos.find((produto) => produto.id == id);
    
    Swal.fire({
        title: "Você deseja apagar o produto?",
        text: "Essa ação não poderá ser desfeita!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#008000",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, deletar produto!"
    }).then((result) => {
        if (result.isConfirmed) {
            produtos.splice(produtos.indexOf(produtoEncontrado), 1);
            localStorage.setItem("produtos", JSON.stringify(produtos));
            renderizarTabela();
        }
    });
}

// Inicializa a tabela ao carregar a página
renderizarTabela();