/* =============================================
   SCRIPT.JS — Site Pessoal: Camila, Artista Visual
   Funcionalidades:
     1. Tema claro/escuro com persistência no localStorage
     2. Menu responsivo (hambúrguer)
     3. Cabeçalho com fundo ao rolar
     4. Animações de entrada (fade-in / slide-up)
     5. Filtro de portfólio por categoria
     6. Validação e envio do formulário de contato
     7. Ano atual no rodapé
   ============================================= */

/* =============================================
   UTILITÁRIO: Aguarda o DOM estar pronto
   ============================================= */
document.addEventListener('DOMContentLoaded', function () {

  // Inicializa todas as funcionalidades
  inicializarTema();
  inicializarMenu();
  inicializarCabecalhoScroll();
  inicializarAnimacoes();
  inicializarFiltroPortfolio();
  inicializarFormulario();
  atualizarAnoRodape();

});

/* =============================================
   1. TEMA CLARO / ESCURO
   Alterna entre as classes .light-theme e .dark-theme no <body>
   Salva a preferência no localStorage para persistir entre visitas
   ============================================= */
function inicializarTema() {
  const btnTema = document.getElementById('btn-theme');
  const body    = document.body;

  // Recupera o tema salvo ou usa o padrão (claro)
  const temaSalvo = localStorage.getItem('tema-camila') || 'light-theme';
  body.className = temaSalvo;

  // Atualiza o atributo aria para acessibilidade
  atualizarAriaTema(body.classList.contains('dark-theme'));

  // Evento de clique no botão de tema
  btnTema.addEventListener('click', function () {
    const temaEscuroAtivo = body.classList.contains('dark-theme');

    if (temaEscuroAtivo) {
      // Muda para tema claro
      body.classList.replace('dark-theme', 'light-theme');
      localStorage.setItem('tema-camila', 'light-theme');
      atualizarAriaTema(false);
    } else {
      // Muda para tema escuro
      body.classList.replace('light-theme', 'dark-theme');
      localStorage.setItem('tema-camila', 'dark-theme');
      atualizarAriaTema(true);
    }
  });
}

// Atualiza o label de acessibilidade do botão de tema
function atualizarAriaTema(temaEscuro) {
  const btnTema = document.getElementById('btn-theme');
  btnTema.setAttribute(
    'aria-label',
    temaEscuro ? 'Mudar para tema claro' : 'Mudar para tema escuro'
  );
}

/* =============================================
   2. MENU RESPONSIVO (HAMBÚRGUER)
   Abre e fecha o menu de navegação no mobile
   Fecha ao clicar em um link ou fora do menu
   ============================================= */
function inicializarMenu() {
  const btnMenu   = document.getElementById('btn-menu');
  const navLinks  = document.getElementById('nav-links');

  if (!btnMenu || !navLinks) return;

  // Alterna o estado do menu ao clicar no botão hambúrguer
  btnMenu.addEventListener('click', function () {
    const estaAberto = navLinks.classList.contains('aberto');

    if (estaAberto) {
      fecharMenu();
    } else {
      abrirMenu();
    }
  });

  // Fecha o menu ao clicar em qualquer link de navegação
  const links = navLinks.querySelectorAll('.nav-link');
  links.forEach(function (link) {
    link.addEventListener('click', fecharMenu);
  });

  // Fecha o menu ao pressionar a tecla Escape
  document.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape' && navLinks.classList.contains('aberto')) {
      fecharMenu();
      btnMenu.focus(); // Retorna o foco ao botão
    }
  });

  // Fecha o menu ao clicar fora dele (no overlay)
  navLinks.addEventListener('click', function (evento) {
    // Fecha apenas se o clique foi no fundo (não em um link)
    if (evento.target === navLinks) {
      fecharMenu();
    }
  });
}

// Abre o menu mobile
function abrirMenu() {
  const btnMenu  = document.getElementById('btn-menu');
  const navLinks = document.getElementById('nav-links');

  navLinks.classList.add('aberto');
  btnMenu.classList.add('aberto');
  btnMenu.setAttribute('aria-expanded', 'true');
  btnMenu.setAttribute('aria-label', 'Fechar menu de navegação');

  // Impede o scroll da página enquanto o menu está aberto
  document.body.style.overflow = 'hidden';
}

// Fecha o menu mobile
function fecharMenu() {
  const btnMenu  = document.getElementById('btn-menu');
  const navLinks = document.getElementById('nav-links');

  navLinks.classList.remove('aberto');
  btnMenu.classList.remove('aberto');
  btnMenu.setAttribute('aria-expanded', 'false');
  btnMenu.setAttribute('aria-label', 'Abrir menu de navegação');

  // Restaura o scroll da página
  document.body.style.overflow = '';
}

/* =============================================
   3. CABEÇALHO COM FUNDO AO ROLAR
   Adiciona a classe .scrolled ao cabeçalho
   quando o usuário rola mais de 50px
   ============================================= */
function inicializarCabecalhoScroll() {
  const cabecalho = document.getElementById('site-header');

  if (!cabecalho) return;

  // Verifica a posição inicial (caso a página já esteja rolada)
  verificarScroll();

  // Escuta o evento de scroll
  window.addEventListener('scroll', verificarScroll, { passive: true });

  function verificarScroll() {
    if (window.scrollY > 50) {
      cabecalho.classList.add('scrolled');
    } else {
      cabecalho.classList.remove('scrolled');
    }
  }
}

/* =============================================
   4. ANIMAÇÕES DE ENTRADA (INTERSECTION OBSERVER)
   Observa elementos com as classes .fade-in e .slide-up
   Adiciona a classe .visivel quando entram na viewport
   ============================================= */
function inicializarAnimacoes() {
  // Seleciona todos os elementos animáveis
  const elementosAnimaveis = document.querySelectorAll('.fade-in, .slide-up');

  if (!elementosAnimaveis.length) return;

  // Configuração do observer
  const opcoes = {
    root:       null,       // Viewport do navegador
    rootMargin: '0px 0px -80px 0px', // Ativa 80px antes do elemento aparecer
    threshold:  0.1         // 10% do elemento visível para ativar
  };

  // Cria o IntersectionObserver
  const observer = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        // Elemento entrou na viewport — adiciona a classe visível
        entrada.target.classList.add('visivel');

        // Para de observar após a animação (evita re-animação)
        observer.unobserve(entrada.target);
      }
    });
  }, opcoes);

  // Inicia a observação de cada elemento
  elementosAnimaveis.forEach(function (elemento) {
    observer.observe(elemento);
  });
}

/* =============================================
   5. FILTRO DE PORTFÓLIO
   Filtra os itens do portfólio por categoria
   Usa animação suave de entrada/saída
   ============================================= */
function inicializarFiltroPortfolio() {
  const botoesFiltro = document.querySelectorAll('.filtro-btn');
  const itensPortfolio = document.querySelectorAll('.portfolio-item');

  if (!botoesFiltro.length || !itensPortfolio.length) return;

  botoesFiltro.forEach(function (botao) {
    botao.addEventListener('click', function () {
      const categoriaAlvo = this.getAttribute('data-filtro');

      // Atualiza o estado ativo dos botões
      botoesFiltro.forEach(function (btn) {
        btn.classList.remove('ativo');
        btn.setAttribute('aria-pressed', 'false');
      });

      this.classList.add('ativo');
      this.setAttribute('aria-pressed', 'true');

      // Filtra os itens com animação
      itensPortfolio.forEach(function (item) {
        const categoriaItem = item.getAttribute('data-categoria');

        if (categoriaAlvo === 'todos' || categoriaItem === categoriaAlvo) {
          // Mostra o item com animação de entrada
          mostrarItem(item);
        } else {
          // Oculta o item com animação de saída
          ocultarItem(item);
        }
      });
    });
  });
}

// Mostra um item do portfólio com animação
function mostrarItem(item) {
  item.classList.remove('oculto');

  // Pequeno delay para a transição funcionar após o display mudar
  requestAnimationFrame(function () {
    item.style.opacity = '0';
    item.style.transform = 'scale(0.95)';

    requestAnimationFrame(function () {
      item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      item.style.opacity = '1';
      item.style.transform = 'scale(1)';
    });
  });
}

// Oculta um item do portfólio com animação
function ocultarItem(item) {
  item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  item.style.opacity = '0';
  item.style.transform = 'scale(0.95)';

  // Oculta completamente após a transição
  setTimeout(function () {
    item.classList.add('oculto');
    item.style.opacity = '';
    item.style.transform = '';
    item.style.transition = '';
  }, 300);
}

/* =============================================
   6. VALIDAÇÃO E ENVIO DO FORMULÁRIO DE CONTATO
   Valida os campos obrigatórios antes de "enviar"
   Simula um envio bem-sucedido (sem backend)
   ============================================= */
function inicializarFormulario() {
  const formulario = document.getElementById('contato-form');

  if (!formulario) return;

  formulario.addEventListener('submit', function (evento) {
    // Impede o envio padrão do formulário
    evento.preventDefault();

    // Limpa erros anteriores
    limparErros();

    // Valida os campos
    const valido = validarFormulario();

    if (valido) {
      // Simula o envio (aqui você conectaria a um backend ou serviço de e-mail)
      simularEnvio();
    }
  });

  // Remove o erro de um campo ao começar a digitar
  const campos = formulario.querySelectorAll('.form-input');
  campos.forEach(function (campo) {
    campo.addEventListener('input', function () {
      const grupoErro = document.getElementById('erro-' + this.id);
      if (grupoErro) {
        grupoErro.textContent = '';
      }
      this.style.borderColor = '';
    });
  });
}

// Valida os campos obrigatórios do formulário
function validarFormulario() {
  let valido = true;

  // Valida o campo Nome
  const nome = document.getElementById('nome');
  if (!nome.value.trim()) {
    exibirErro('erro-nome', nome, 'Por favor, informe seu nome.');
    valido = false;
  }

  // Valida o campo E-mail
  const email = document.getElementById('email');
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim()) {
    exibirErro('erro-email', email, 'Por favor, informe seu e-mail.');
    valido = false;
  } else if (!regexEmail.test(email.value.trim())) {
    exibirErro('erro-email', email, 'Por favor, informe um e-mail válido.');
    valido = false;
  }

  // Valida o campo Mensagem
  const mensagem = document.getElementById('mensagem');
  if (!mensagem.value.trim()) {
    exibirErro('erro-mensagem', mensagem, 'Por favor, escreva sua mensagem.');
    valido = false;
  } else if (mensagem.value.trim().length < 20) {
    exibirErro('erro-mensagem', mensagem, 'A mensagem deve ter pelo menos 20 caracteres.');
    valido = false;
  }

  return valido;
}

// Exibe uma mensagem de erro em um campo
function exibirErro(idErro, campo, mensagem) {
  const spanErro = document.getElementById(idErro);
  if (spanErro) {
    spanErro.textContent = mensagem;
  }
  if (campo) {
    campo.style.borderColor = '#e7204e';
    campo.focus();
  }
}

// Limpa todos os erros do formulário
function limparErros() {
  const erros = document.querySelectorAll('.form-erro');
  erros.forEach(function (erro) {
    erro.textContent = '';
  });

  const campos = document.querySelectorAll('.form-input');
  campos.forEach(function (campo) {
    campo.style.borderColor = '';
  });
}

// Simula o envio do formulário com feedback visual
function simularEnvio() {
  const formulario  = document.getElementById('contato-form');
  const btnEnviar   = formulario.querySelector('button[type="submit"]');
  const msgSucesso  = document.getElementById('form-sucesso');

  // Desabilita o botão e mostra estado de carregamento
  btnEnviar.disabled = true;
  btnEnviar.textContent = 'Enviando...';

  // Simula um delay de rede (1.5 segundos)
  setTimeout(function () {
    // Reseta o formulário
    formulario.reset();

    // Mostra a mensagem de sucesso
    msgSucesso.removeAttribute('hidden');
    msgSucesso.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Restaura o botão
    btnEnviar.disabled = false;
    btnEnviar.textContent = 'Enviar mensagem';

    // Oculta a mensagem de sucesso após 6 segundos
    setTimeout(function () {
      msgSucesso.setAttribute('hidden', '');
    }, 6000);

  }, 1500);
}

/* =============================================
   7. ANO ATUAL NO RODAPÉ
   Atualiza automaticamente o ano no copyright
   ============================================= */
function atualizarAnoRodape() {
  const spanAno = document.getElementById('ano-atual');
  if (spanAno) {
    spanAno.textContent = new Date().getFullYear();
  }
}

/* =============================================
   FIM DO SCRIPT
   Para adicionar novas funcionalidades, crie
   uma nova função e chame-a dentro do
   DOMContentLoaded acima.
   ============================================= */
