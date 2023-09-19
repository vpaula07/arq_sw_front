/*
  --------------------------------------------------------------------------------------
  Função para adequar o front-end de acordo com os parâmetros
  --------------------------------------------------------------------------------------
*/
const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

/*
  ----------------------------------------------
  Função para Pesquisar usuários
  ---------------------------------------------
*/
let campoPesquisa = document.getElementById("newSearch");
campoPesquisa.addEventListener("keyup", pesquisarUsuarios);

function pesquisarUsuarios() {
  let termoPesquisa = campoPesquisa.value.toLowerCase();
  let tabelaUsuarios = document.getElementById("myTable");
  let linhasUsuarios = tabelaUsuarios.getElementsByTagName("tr");

  for (let i = 1; i < linhasUsuarios.length; i++) {
    let nomeUsuario = linhasUsuarios[i].getElementsByTagName("td")[0];
    if (nomeUsuario.innerHTML.toLowerCase().indexOf(termoPesquisa) > -1) {
      linhasUsuarios[i].style.display = "";
    } else {
      linhasUsuarios[i].style.display = "none";
    }
  }
}

/***********************************
 * Função para acessar o CEP via API
 ***********************************/


function limpa_formulário_cep() {
  //Limpa valores do formulário de cep.
  document.getElementById('newLogradouro').value=("");
  document.getElementById('bairro').value=("");
  document.getElementById('cidade').value=("");
  document.getElementById('newUf').value=("");
}

function meu_callback(conteudo) {
if (!("erro" in conteudo)) {
  //Atualiza os campos com os valores.
  document.getElementById('newLogradouro').value=(conteudo.logradouro);
  document.getElementById('bairro').value=(conteudo.bairro);
  document.getElementById('cidade').value=(conteudo.localidade);
  document.getElementById('newUf').value=(conteudo.uf);
  } //end if.
else {
  //CEP não Encontrado.
  limpa_formulário_cep();
  alert("CEP não encontrado.");
}
}

function pesquisacep(valor) {

//Nova variável "cep" somente com dígitos.
var cep = valor.replace(/\D/g, '');

//Verifica se campo cep possui valor informado.
if (cep != "") {

  //Expressão regular para validar o CEP.
  var validacep = /^[0-9]{8}$/;

  //Valida o formato do CEP.
  if(validacep.test(cep)) {

      //Preenche os campos com "..." enquanto consulta webservice.
      document.getElementById('newLogradouro').value="...";
      document.getElementById('bairro').value="...";
      document.getElementById('cidade').value="...";
      document.getElementById('newUf').value="...";
      

      //Cria um elemento javascript.
      var script = document.createElement('script');

      //Sincroniza com o callback.
      script.src = 'https://viacep.com.br/ws/'+ cep + '/json/?callback=meu_callback';

      //Insere script no documento e carrega o conteúdo.
      document.body.appendChild(script);

  } //end if.
  else {
      //cep é inválido.
      limpa_formulário_cep();
      alert("Formato de CEP inválido.");
  }
} //end if.
else {
  //cep sem valor, limpa formulário.
  limpa_formulário_cep();
}
};


/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
    let url = 'http://127.0.0.1:5000/cadastros';
      fetch(url, {
      method: 'get',
    })
      .then((response) => response.json())
      .then((data) => {
        data.cadastros.forEach(item => insertList(item.usuario, item.cep, item.logradouro, item.bairro, item.cidade, item.uf))
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

   /*
    --------------------------------------------------------------------------------------
    Chamada da função para carregamento inicial dos dados
    --------------------------------------------------------------------------------------
  */
  getList()

 
  /*
    --------------------------------------------------------------------------------------
    Função para colocar um usuario na lista do servidor via requisição POST
    --------------------------------------------------------------------------------------
  */
  const postItem = async (inputUser, inputCep, inputLogradouro, inputBairro, inputCidade, inputUf) => {
    const formData = new FormData();
    formData.append('usuario', inputUser);
    formData.append('cep', inputCep);
    formData.append('logradouro', inputLogradouro);
    formData.append('bairro', inputBairro)
    formData.append('cidade', inputCidade)
    formData.append('uf', inputUf);
    
         
  
    let url = 'http://127.0.0.1:5000/cadastro';
      fetch(url, {
      method: 'post',
      body: formData
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error('Error:', error);
      });
    
  }

  
      
  /*
    --------------------------------------------------------------------------------------
    Função para criar um botão close para cada usuario da lista
    --------------------------------------------------------------------------------------
  */
  const insertButton = (parent) => {
    let span = document.createElement("span");
    let txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    parent.appendChild(span);
  }
  
  
  /*
    --------------------------------------------------------------------------------------
    Função para remover um usuario da lista de acordo com o click no botão close
    --------------------------------------------------------------------------------------
  */
  const removeElement = () => {
    let close = document.getElementsByClassName("close");
    // var table = document.getElementById('myTable');
    let i;
    for (i = 0; i < close.length; i++) {
      close[i].onclick = function () {
        let div = this.parentElement.parentElement;
        const usuarioItem = div.getElementsByTagName('td')[0].innerHTML
        if (confirm("Você tem certeza?")) {
          div.remove()
          deleteItem(usuarioItem)
          alert("Removido!")
        }
      }
    }
  }
  
  /*
    --------------------------------------------------------------------------------------
    Função para deletar um usuario da lista do servidor via requisição DELETE
    --------------------------------------------------------------------------------------
  */
  const deleteItem = (item) => {
    console.log(item)
    let url = 'http://127.0.0.1:5000/cadastro?usuario=' + item;
    fetch(url, {
      method: 'delete'
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  
  /*
    --------------------------------------------------------------------------------------
    Função para adicionar um novo item com usuario, cpf, logradouro e uf
    --------------------------------------------------------------------------------------
  */
  const newItem = () => {
    let inputUser = document.getElementById("newInput").value;
    let inputCep = document.getElementById("newCep").value;
    let inputLogradouro = document.getElementById("newLogradouro").value;
    let inputBairro = document.getElementById("bairro").value;
    let inputCidade = document.getElementById("cidade").value;
    let inputUf = document.getElementById("newUf").value;
    
        
    if (inputUser === '') {
      alert("Escreva o usuario solicitado!");
    } else if (isNaN(inputCep)) {
      alert("CEP precisa ser números!");
    }
    else {
      insertList(inputUser, inputCep, inputLogradouro, inputBairro, inputCidade, inputUf)
      postItem(inputUser, inputCep, inputLogradouro, inputBairro, inputCidade, inputUf)
      alert("Item adicionado!")
    }
  }
  
  /*
    --------------------------------------------------------------------------------------
    Função para inserir usuarios na lista apresentada
    --------------------------------------------------------------------------------------
  */
  const insertList = (nameUser, cep, logradouro, bairro, cidade, uf) => {
    var item = [nameUser, cep, logradouro, bairro, cidade, uf]
    var table = document.getElementById('myTable');
    var row = table.insertRow();
  
    for (var i = 0; i < item.length; i++) {
      var cel = row.insertCell(i);
      cel.textContent = item[i];
    }
    insertButton(row.insertCell(-1))
    document.getElementById("newInput").value = "";
    document.getElementById("newCep").value = "";
    document.getElementById("newLogradouro").value = "";
    document.getElementById("bairro").value = "";
    document.getElementById("cidade").value = "";
    document.getElementById("newUf").value = "";
   
       
  
    removeElement()
  }

 

  