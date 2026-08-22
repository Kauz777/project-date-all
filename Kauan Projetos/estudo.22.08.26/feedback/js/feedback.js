"use strict";

/*
 * ==========================================
 * FORMULÁRIO DE FEEDBACK
 * ==========================================
 *
 * Responsabilidades:
 * - Controle das estrelas
 * - Validação dos campos
 * - Feedback visual de erros
 * - Prevenção de envio duplicado
 * - Mensagem de sucesso
 * - Compatibilidade com teclado e celular
 *
 * ==========================================
 */


/* ==========================================
   ELEMENTOS
========================================== */

const form = document.getElementById("formFeedback");

const nomeInput = document.getElementById("nome");
const emailInput = document.getElementById("email");
const notaInput = document.getElementById("nota");
const comentarioInput = document.getElementById("comentario");

const estrelas = document.querySelectorAll(".estrelas button");


/* ==========================================
   VERIFICAÇÃO INICIAL
========================================== */

if (!form || !nomeInput || !emailInput || !notaInput || !comentarioInput) {
    console.error(
        "Erro: não foi possível encontrar todos os elementos do formulário."
    );
}


/* ==========================================
   CONFIGURAÇÕES
========================================== */

const CONFIG = {
    notaMinima: 1,
    notaMaxima: 5,

    nomeMinimo: 2,
    nomeMaximo: 100,

    comentarioMinimo: 5,
    comentarioMaximo: 1000,

    mensagemSucesso:
        "Obrigado pelo seu feedback! Sua opinião foi registrada."
};


/* ==========================================
   ESTADO
========================================== */

let enviando = false;


/* ==========================================
   FUNÇÕES AUXILIARES
========================================== */


/**
 * Cria uma mensagem de erro para um campo.
 */
function mostrarErro(campo, mensagem) {

    removerErro(campo);

    campo.setAttribute("aria-invalid", "true");

    const erro = document.createElement("small");

    erro.className = "erro-campo";
    erro.textContent = mensagem;

    erro.setAttribute("role", "alert");

    campo.parentElement.appendChild(erro);
}


/**
 * Remove a mensagem de erro de um campo.
 */
function removerErro(campo) {

    campo.removeAttribute("aria-invalid");

    const erroExistente =
        campo.parentElement.querySelector(".erro-campo");

    if (erroExistente) {
        erroExistente.remove();
    }
}


/**
 * Remove todos os erros.
 */
function removerTodosErros() {

    const campos = [
        nomeInput,
        emailInput,
        notaInput,
        comentarioInput
    ];

    campos.forEach(removerErro);
}


/**
 * Verifica se o e-mail possui formato válido.
 */
function emailValido(email) {

    /*
     * Não precisamos de uma regex gigantesca.
     * Esta é suficiente para validação básica
     * no lado do cliente.
     */
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(email);
}


/**
 * Coloca uma mensagem de sucesso na tela.
 */
function mostrarSucesso() {

    const mensagemExistente =
        document.querySelector(".mensagem-sucesso");

    if (mensagemExistente) {
        mensagemExistente.remove();
    }

    const mensagem = document.createElement("div");

    mensagem.className = "mensagem-sucesso";
    mensagem.textContent = CONFIG.mensagemSucesso;

    mensagem.setAttribute("role", "status");
    mensagem.setAttribute("aria-live", "polite");

    form.insertBefore(mensagem, form.firstChild);
}


/**
 * Desabilita o formulário durante o envio.
 */
function bloquearFormulario() {

    enviando = true;

    const elementos =
        form.querySelectorAll("input, textarea, button");

    elementos.forEach((elemento) => {
        elemento.disabled = true;
    });

    const botaoEnviar =
        form.querySelector(".btn-enviar");

    if (botaoEnviar) {
        botaoEnviar.textContent = "Enviando...";
    }
}


/**
 * Reativa o formulário.
 */
function desbloquearFormulario() {

    enviando = false;

    const elementos =
        form.querySelectorAll("input, textarea, button");

    elementos.forEach((elemento) => {
        elemento.disabled = false;
    });

    const botaoEnviar =
        form.querySelector(".btn-enviar");

    if (botaoEnviar) {
        botaoEnviar.textContent = "Enviar Feedback";
    }
}


/* ==========================================
   ESTRELAS
========================================== */


/**
 * Atualiza visualmente as estrelas.
 */
function atualizarEstrelas(nota) {

    estrelas.forEach((estrela) => {

        const valor =
            Number(estrela.dataset.nota);

        estrela.classList.toggle(
            "ativa",
            valor <= nota
        );

        estrela.setAttribute(
            "aria-pressed",
            valor === nota ? "true" : "false"
        );
    });
}


/**
 * Seleciona uma nota.
 */
function selecionarNota(nota) {

    if (
        nota < CONFIG.notaMinima ||
        nota > CONFIG.notaMaxima
    ) {
        return;
    }

    notaInput.value = String(nota);

    atualizarEstrelas(nota);

    removerErro(notaInput);
}


/* ==========================================
   EVENTOS DAS ESTRELAS
========================================== */

estrelas.forEach((estrela) => {

    estrela.addEventListener("click", () => {

        const nota =
            Number(estrela.dataset.nota);

        selecionarNota(nota);
    });


    /*
     * Permite usar as estrelas com teclado.
     */
    estrela.addEventListener("keydown", (event) => {

        if (
            event.key === "Enter" ||
            event.key === " "
        ) {

            event.preventDefault();

            const nota =
                Number(estrela.dataset.nota);

            selecionarNota(nota);
        }
    });


    /*
     * Melhora a experiência no mouse.
     * No celular esse evento simplesmente
     * não interfere.
     */
    estrela.addEventListener("mouseenter", () => {

        const nota =
            Number(estrela.dataset.nota);

        atualizarEstrelas(nota);
    });

});


/*
 * Quando o mouse sair da área das estrelas,
 * volta para a nota realmente selecionada.
 */
const containerEstrelas =
    document.querySelector(".estrelas");

if (containerEstrelas) {

    containerEstrelas.addEventListener(
        "mouseleave",
        () => {

            const nota =
                Number(notaInput.value) || 0;

            atualizarEstrelas(nota);
        }
    );
}


/* ==========================================
   VALIDAÇÃO
========================================== */


/**
 * Valida o nome.
 */
function validarNome() {

    const nome =
        nomeInput.value.trim();

    if (!nome) {

        mostrarErro(
            nomeInput,
            "Digite seu nome."
        );

        return false;
    }


    if (nome.length < CONFIG.nomeMinimo) {

        mostrarErro(
            nomeInput,
            `O nome deve ter pelo menos ${CONFIG.nomeMinimo} caracteres.`
        );

        return false;
    }


    if (nome.length > CONFIG.nomeMaximo) {

        mostrarErro(
            nomeInput,
            `O nome deve ter no máximo ${CONFIG.nomeMaximo} caracteres.`
        );

        return false;
    }


    removerErro(nomeInput);

    return true;
}


/**
 * Valida o e-mail.
 */
function validarEmail() {

    const email =
        emailInput.value.trim();

    if (!email) {

        mostrarErro(
            emailInput,
            "Digite seu e-mail."
        );

        return false;
    }


    if (!emailValido(email)) {

        mostrarErro(
            emailInput,
            "Digite um e-mail válido."
        );

        return false;
    }


    removerErro(emailInput);

    return true;
}


/**
 * Valida a nota.
 */
function validarNota() {

    const nota =
        Number(notaInput.value);


    if (
        !Number.isInteger(nota) ||
        nota < CONFIG.notaMinima ||
        nota > CONFIG.notaMaxima
    ) {

        mostrarErro(
            notaInput,
            "Selecione uma avaliação de 1 a 5 estrelas."
        );

        return false;
    }


    removerErro(notaInput);

    return true;
}


/**
 * Valida o comentário.
 */
function validarComentario() {

    const comentario =
        comentarioInput.value.trim();


    if (!comentario) {

        mostrarErro(
            comentarioInput,
            "Digite um comentário."
        );

        return false;
    }


    if (
        comentario.length <
        CONFIG.comentarioMinimo
    ) {

        mostrarErro(
            comentarioInput,
            `O comentário deve ter pelo menos ${CONFIG.comentarioMinimo} caracteres.`
        );

        return false;
    }


    if (
        comentario.length >
        CONFIG.comentarioMaximo
    ) {

        mostrarErro(
            comentarioInput,
            `O comentário deve ter no máximo ${CONFIG.comentarioMaximo} caracteres.`
        );

        return false;
    }


    removerErro(comentarioInput);

    return true;
}


/**
 * Valida todo o formulário.
 */
function validarFormulario() {

    const nomeValido =
        validarNome();

    const emailValido =
        validarEmail();

    const notaValida =
        validarNota();

    const comentarioValido =
        validarComentario();


    return (
        nomeValido &&
        emailValido &&
        notaValida &&
        comentarioValido
    );
}


/* ==========================================
   VALIDAÇÃO EM TEMPO REAL
========================================== */

nomeInput.addEventListener(
    "blur",
    validarNome
);

emailInput.addEventListener(
    "blur",
    validarEmail
);

comentarioInput.addEventListener(
    "blur",
    validarComentario
);


/*
 * Remove o erro enquanto o usuário
 * começa a corrigir o campo.
 */
nomeInput.addEventListener(
    "input",
    () => removerErro(nomeInput)
);

emailInput.addEventListener(
    "input",
    () => removerErro(emailInput)
);

comentarioInput.addEventListener(
    "input",
    () => removerErro(comentarioInput)
);


/* ==========================================
   ENVIO DO FORMULÁRIO
========================================== */

form.addEventListener("submit", async (event) => {

    /*
     * Impede o navegador de recarregar
     * a página.
     */
    event.preventDefault();


    /*
     * Impede múltiplos envios.
     */
    if (enviando) {
        return;
    }


    removerTodosErros();


    /*
     * Valida antes de qualquer processamento.
     */
    const formularioValido =
        validarFormulario();


    if (!formularioValido) {

        /*
         * Procura o primeiro campo inválido.
         */
        const primeiroErro =
            form.querySelector(
                '[aria-invalid="true"]'
            );


        if (primeiroErro) {

            primeiroErro.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            primeiroErro.focus();
        }

        return;
    }


    /*
     * Bloqueia o formulário.
     */
    bloquearFormulario();


    try {

        /*
         * Aqui futuramente entrará o envio
         * para seu backend/API.
         *
         * Por enquanto simulamos um pequeno
         * processamento.
         */
        await new Promise((resolve) => {
            setTimeout(resolve, 800);
        });


        mostrarSucesso();


        /*
         * Limpa os campos.
         */
        form.reset();


        /*
         * Limpa a avaliação.
         */
        notaInput.value = "";

        atualizarEstrelas(0);


        /*
         * Leva o usuário novamente ao topo
         * do formulário.
         */
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


    } catch (erro) {

        console.error(
            "Erro ao processar feedback:",
            erro
        );


        alert(
            "Não foi possível enviar seu feedback. Tente novamente."
        );


    } finally {

        desbloquearFormulario();
    }
});
