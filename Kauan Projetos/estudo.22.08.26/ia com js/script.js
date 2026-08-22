"use strict";

/*
==========================================================
                 NEXUS AI - LOCAL
==========================================================

IA experimental 100% JavaScript.

Sem:
- API
- Backend
- Banco de dados
- Bibliotecas externas

Possui:
- Memória
- Contexto de conversa
- Intenções
- Sentimentos
- Personalidade
- Respostas dinâmicas
- Sistema de confiança
- Conhecimento local
- Calculadora
- Data e hora
- Comandos
- Aprendizado de informações fornecidas pelo usuário
==========================================================
*/


/* ========================================================
   ELEMENTOS
======================================================== */

const entrada = document.getElementById("entrada");
const enviar = document.getElementById("enviar");
const mensagens = document.getElementById("mensagens");


/* ========================================================
   CONFIGURAÇÃO
======================================================== */

const CONFIG = {

    nome: "Nexus",

    personalidade: {
        amigavel: true,
        curiosa: true,
        divertida: true,
        formalidade: 0.35
    },

    memoriaMaxima: 50,

    tempoPensamento: {
        minimo: 300,
        maximo: 900
    }
};


/* ========================================================
   ESTADO DA IA
======================================================== */

const estado = {

    nomeUsuario: null,

    assuntoAtual: null,

    ultimaPergunta: null,

    ultimaResposta: null,

    historico: [],

    memoria: {},

    sentimento: "neutro",

    mensagens: 0,

    iniciada: false
};


/* ========================================================
   BASE DE CONHECIMENTO
======================================================== */

const conhecimento = {

    javascript: {
        palavras: [
            "javascript",
            "js",
            "ecmascript"
        ],

        respostas: [
            "JavaScript é uma linguagem extremamente versátil. Você pode usar no navegador, no servidor, em aplicativos e até em inteligência artificial.",

            "Se você está estudando JavaScript, eu recomendaria dominar funções, arrays, objetos, DOM, eventos, promises e async/await.",

            "Uma das coisas mais interessantes do JavaScript é que você consegue transformar conceitos simples em aplicações bastante complexas."
        ]
    },

    html: {
        palavras: [
            "html"
        ],

        respostas: [
            "HTML é responsável pela estrutura da página.",

            "HTML não é uma linguagem de programação tradicional. Ele é uma linguagem de marcação.",

            "Uma boa estrutura HTML facilita muito o trabalho do CSS e do JavaScript."
        ]
    },

    css: {
        palavras: [
            "css",
            "estilo",
            "design"
        ],

        respostas: [
            "CSS é responsável pela apresentação visual da página.",

            "Com CSS você consegue criar layouts responsivos, animações, transições e interfaces muito sofisticadas.",

            "Flexbox e Grid são dois assuntos que valem muito a pena dominar."
        ]
    },

    programacao: {
        palavras: [
            "programar",
            "programação",
            "codigo",
            "código",
            "desenvolvedor"
        ],

        respostas: [
            "Programar é basicamente ensinar o computador a resolver problemas através de instruções.",

            "Uma dica importante: tente criar projetos enquanto estuda. Isso acelera muito o aprendizado.",

            "Não tente memorizar tudo. Aprenda a entender problemas e procurar soluções."
        ]
    },

    ia: {
        palavras: [
            "ia",
            "inteligencia artificial",
            "inteligência artificial",
            "machine learning",
            "aprendizado de maquina",
            "aprendizado de máquina"
        ],

        respostas: [
            "Inteligência artificial é um campo enorme que envolve estatística, algoritmos, aprendizado de máquina e redes neurais.",

            "O sistema que você está conversando comigo agora é apenas uma simulação local. Um modelo como eu de verdade é muito mais complexo.",

            "Uma IA moderna aprende padrões a partir de enormes quantidades de dados e utiliza redes neurais com muitos parâmetros."
        ]
    },

    freelancer: {
        palavras: [
            "freelancer",
            "freela",
            "cliente",
            "clientes"
        ],

        respostas: [
            "Para trabalhar como freelancer, além de programação, comunicação e organização são habilidades muito importantes.",

            "Um bom portfólio pode ser tão importante quanto o currículo quando você está começando.",

            "Projetos reais são uma ótima maneira de mostrar para um cliente aquilo que você consegue construir."
        ]
    }

};


/* ========================================================
   VOCABULÁRIO EMOCIONAL
======================================================== */

const sentimentos = {

    positivo: [
        "gostei",
        "gosto",
        "legal",
        "ótimo",
        "otimo",
        "excelente",
        "incrível",
        "incrivel",
        "bom",
        "feliz",
        "show",
        "top",
        "massa",
        "parabéns",
        "parabens"
    ],

    negativo: [
        "ruim",
        "péssimo",
        "pessimo",
        "horrível",
        "horrivel",
        "triste",
        "odeio",
        "difícil",
        "dificil",
        "problema",
        "erro",
        "falhou"
    ]
};


/* ========================================================
   NORMALIZAÇÃO
======================================================== */

function normalizar(texto) {

    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}


/* ========================================================
   TOKENIZAÇÃO
======================================================== */

function palavras(texto) {

    return normalizar(texto)
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter(Boolean);
}


/* ========================================================
   DETECÇÃO DE SENTIMENTO
======================================================== */

function analisarSentimento(texto) {

    const tokens = palavras(texto);

    let positivo = 0;
    let negativo = 0;


    tokens.forEach(token => {

        if (
            sentimentos.positivo
                .map(normalizar)
                .includes(token)
        ) {
            positivo++;
        }


        if (
            sentimentos.negativo
                .map(normalizar)
                .includes(token)
        ) {
            negativo++;
        }

    });


    if (positivo > negativo) {
        return "positivo";
    }


    if (negativo > positivo) {
        return "negativo";
    }


    return "neutro";
}


/* ========================================================
   DETECÇÃO DE NOME
======================================================== */

function detectarNome(texto) {

    const regex = /(?:meu nome é|me chamo|sou o|sou a)\s+([a-zA-ZÀ-ÿ]+)/i;

    const resultado = texto.match(regex);

    if (!resultado) {
        return null;
    }

    return resultado[1];
}


/* ========================================================
   MEMÓRIA
======================================================== */

function salvarMemoria(chave, valor) {

    estado.memoria[chave] = valor;

    const chaves =
        Object.keys(estado.memoria);

    if (
        chaves.length >
        CONFIG.memoriaMaxima
    ) {

        delete estado.memoria[chaves[0]];
    }
}


function buscarMemoria(chave) {

    return estado.memoria[chave] || null;
}


/* ========================================================
   HISTÓRICO
======================================================== */

function salvarHistorico(usuario, ia) {

    estado.historico.push({
        usuario,
        ia,
        momento: new Date()
    });


    if (
        estado.historico.length >
        CONFIG.memoriaMaxima
    ) {

        estado.historico.shift();
    }
}


/* ========================================================
   CÁLCULO
======================================================== */

function tentarCalcular(texto) {

    const expressao =
        texto
            .replace(/quanto é/gi, "")
            .replace(/calcule/gi, "")
            .replace(/calcular/gi, "")
            .trim();


    /*
     * Permitimos apenas números
     * e operadores matemáticos.
     */

    if (
        !/^[0-9+\-*/().%\s]+$/.test(expressao)
    ) {
        return null;
    }


    try {

        /*
         * Function é utilizada aqui apenas
         * porque este é um projeto experimental.
         *
         * Em aplicações reais devemos tratar
         * expressões matemáticas com um parser.
         */

        const resultado =
            Function(
                `"use strict"; return (${expressao})`
            )();


        if (
            typeof resultado === "number" &&
            Number.isFinite(resultado)
        ) {

            return resultado;
        }

    } catch {
        return null;
    }


    return null;
}


/* ========================================================
   DATA E HORA
======================================================== */

function dataAtual() {

    return new Intl.DateTimeFormat(
        "pt-BR",
        {
            dateStyle: "full"
        }
    ).format(new Date());
}


function horaAtual() {

    return new Intl.DateTimeFormat(
        "pt-BR",
        {
            timeStyle: "medium"
        }
    ).format(new Date());
}


/* ========================================================
   DETECÇÃO DE INTENÇÃO
======================================================== */

function detectarIntencao(texto) {

    const mensagem = normalizar(texto);


    if (
        /^(oi|ola|e ai|eai|hello|hey)\b/.test(mensagem)
    ) {
        return "saudacao";
    }


    if (
        mensagem.includes("quem e voce") ||
        mensagem.includes("quem é voce") ||
        mensagem.includes("quem e vc") ||
        mensagem.includes("o que voce e")
    ) {
        return "identidade";
    }


    if (
        mensagem.includes("meu nome")
    ) {
        return "nome";
    }


    if (
        mensagem.includes("que horas") ||
        mensagem.includes("hora agora")
    ) {
        return "hora";
    }


    if (
        mensagem.includes("que dia") ||
        mensagem.includes("data de hoje") ||
        mensagem.includes("data")
    ) {
        return "data";
    }


    if (
        mensagem.includes("obrigado") ||
        mensagem.includes("obrigada") ||
        mensagem.includes("valeu")
    ) {
        return "agradecimento";
    }


    if (
        mensagem.includes("tchau") ||
        mensagem.includes("ate mais")
    ) {
        return "despedida";
    }


    if (
        mensagem.includes("ajuda") ||
        mensagem.includes("o que voce sabe")
    ) {
        return "ajuda";
    }


    if (
        mensagem.includes("como voce funciona") ||
        mensagem.includes("como funciona")
    ) {
        return "funcionamento";
    }


    return "conhecimento";
}


/* ========================================================
   BUSCA DE CONHECIMENTO
======================================================== */

function buscarConhecimento(texto) {

    const mensagem =
        normalizar(texto);


    let melhorResultado = null;

    let maiorPontuacao = 0;


    for (
        const [assunto, dados]
        of Object.entries(conhecimento)
    ) {

        let pontuacao = 0;


        dados.palavras.forEach(palavra => {

            if (
                mensagem.includes(
                    normalizar(palavra)
                )
            ) {

                pontuacao++;
            }

        });


        if (
            pontuacao > maiorPontuacao
        ) {

            maiorPontuacao = pontuacao;

            melhorResultado = {
                assunto,
                dados
            };
        }
    }


    if (!melhorResultado) {
        return null;
    }


    const respostas =
        melhorResultado.dados.respostas;


    const resposta =
        respostas[
            Math.floor(
                Math.random() *
                respostas.length
            )
        ];


    estado.assuntoAtual =
        melhorResultado.assunto;


    return resposta;
}


/* ========================================================
   RESPOSTAS DINÂMICAS
======================================================== */

function gerarResposta(texto) {

    const intencao =
        detectarIntencao(texto);


    const sentimento =
        analisarSentimento(texto);


    estado.sentimento =
        sentimento;


    /* ----------------------------------------
       SAUDAÇÃO
    ---------------------------------------- */

    if (
        intencao === "saudacao"
    ) {

        const nome =
            buscarMemoria("nome");


        if (nome) {

            return `Olá, ${nome}! 👋 Que bom conversar com você novamente.`;
        }


        return "Olá! 👋 Eu sou o Nexus. O que você gostaria de conversar?";
    }


    /* ----------------------------------------
       IDENTIDADE
    ---------------------------------------- */

    if (
        intencao === "identidade"
    ) {

        return `
Eu sou o Nexus 🤖.

Sou uma inteligência artificial experimental
construída apenas com JavaScript.

Não utilizo API, servidor ou modelo externo.

Minha "inteligência" vem de regras, padrões,
memória local, análise de texto e uma base
de conhecimento programada.
        `.trim();
    }


    /* ----------------------------------------
       NOME
    ---------------------------------------- */

    if (
        intencao === "nome"
    ) {

        const nome =
            detectarNome(texto);


        if (nome) {

            const nomeFormatado =
                nome.charAt(0).toUpperCase() +
                nome.slice(1).toLowerCase();


            salvarMemoria(
                "nome",
                nomeFormatado
            );


            return `Prazer em conhecer você, ${nomeFormatado}! 😄 Vou lembrar do seu nome durante esta conversa.`;
        }


        return "Ainda não consegui identificar seu nome. Tente dizer: 'Meu nome é Kauan'.";
    }


    /* ----------------------------------------
       HORA
    ---------------------------------------- */

    if (
        intencao === "hora"
    ) {

        return `Agora são ${horaAtual()} ⏰.`;
    }


    /* ----------------------------------------
       DATA
    ---------------------------------------- */

    if (
        intencao === "data"
    ) {

        return `Hoje é ${dataAtual()} 📅.`;
    }


    /* ----------------------------------------
       AGRADECIMENTO
    ---------------------------------------- */

    if (
        intencao === "agradecimento"
    ) {

        return "Por nada! 😄 Estou aqui para ajudar.";
    }


    /* ----------------------------------------
       DESPEDIDA
    ---------------------------------------- */

    if (
        intencao === "despedida"
    ) {

        return "Até mais! 👋 Continue estudando e criando coisas incríveis.";
    }


    /* ----------------------------------------
       AJUDA
    ---------------------------------------- */

    if (
        intencao === "ajuda"
    ) {

        return `
Posso conversar sobre:

• JavaScript
• HTML
• CSS
• Programação
• Inteligência artificial
• Freelancing
• Data e hora
• Cálculos

Também consigo lembrar informações que
você me contar durante esta sessão.
        `.trim();
    }


    /* ----------------------------------------
       FUNCIONAMENTO
    ---------------------------------------- */

    if (
        intencao === "funcionamento"
    ) {

        return `
Eu analiso sua mensagem, identifico palavras,
intenções e sentimentos e então escolho uma
resposta utilizando minha base de conhecimento.

Não existe um modelo neural por trás de mim.

É JavaScript puro. 🧠
        `.trim();
    }


    /* ----------------------------------------
       CÁLCULO
    ---------------------------------------- */

    const calculo =
        tentarCalcular(texto);


    if (calculo !== null) {

        return `O resultado é **${calculo}**. 🧮`;
    }


    /* ----------------------------------------
       CONHECIMENTO
    ---------------------------------------- */

    const conhecimentoEncontrado =
        buscarConhecimento(texto);


    if (conhecimentoEncontrado) {

        if (
            sentimento === "positivo"
        ) {

            return `${conhecimentoEncontrado}\n\nFico feliz que você esteja interessado nisso! 🚀`;
        }


        return conhecimentoEncontrado;
    }


    /* ----------------------------------------
       CONTEXTO
    ---------------------------------------- */

    if (
        estado.assuntoAtual
    ) {

        return `
Você está falando sobre
${estado.assuntoAtual}.

Se quiser, posso continuar conversando
sobre esse assunto.
        `.trim();
    }


    /* ----------------------------------------
       RESPOSTA DESCONHECIDA
    ---------------------------------------- */

    const respostasDesconhecidas = [

        "Interessante... 🤔 Ainda não tenho conhecimento suficiente sobre isso.",

        "Essa é uma pergunta que ainda está fora da minha base de conhecimento.",

        "Não sei responder isso com segurança. Mas essa é justamente uma oportunidade para eu aprender.",

        "Hmm... não encontrei uma resposta adequada. Tente reformular a pergunta.",

        "Essa pergunta me deixou pensando. 🤖"
    ];


    return respostasDesconhecidas[
        Math.floor(
            Math.random() *
            respostasDesconhecidas.length
        )
    ];
}


/* ========================================================
   INTERFACE
======================================================== */

function adicionarMensagem(
    texto,
    classe
) {

    const mensagem =
        document.createElement("div");


    mensagem.classList.add(
        "mensagem",
        classe
    );


    /*
     * textContent evita interpretar
     * HTML enviado pelo usuário.
     */

    mensagem.textContent =
        texto;


    mensagens.appendChild(
        mensagem
    );


    mensagens.scrollTop =
        mensagens.scrollHeight;
}


/* ========================================================
   INDICADOR DE PENSAMENTO
======================================================== */

function mostrarPensamento() {

    const pensamento =
        document.createElement("div");


    pensamento.classList.add(
        "mensagem",
        "ia",
        "pensando"
    );


    pensamento.textContent =
        "Nexus está pensando...";


    mensagens.appendChild(
        pensamento
    );


    mensagens.scrollTop =
        mensagens.scrollHeight;


    return pensamento;
}


/* ========================================================
   TEMPO DE PENSAMENTO
======================================================== */

function tempoPensamento() {

    const {
        minimo,
        maximo
    } = CONFIG.tempoPensamento;


    return Math.floor(
        Math.random() *
        (maximo - minimo + 1)
    ) + minimo;
}


/* ========================================================
   PROCESSAMENTO
======================================================== */

async function processarMensagem() {

    const texto =
        entrada.value.trim();


    if (!texto) {
        return;
    }


    /*
     * Limpa input
     */

    entrada.value = "";


    /*
     * Mostra usuário
     */

    adicionarMensagem(
        texto,
        "usuario"
    );


    estado.mensagens++;


    /*
     * Indicador
     */

    const pensamento =
        mostrarPensamento();


    /*
     * Simula processamento
     */

    await new Promise(resolve => {

        setTimeout(
            resolve,
            tempoPensamento()
        );

    });


    pensamento.remove();


    /*
     * Gera resposta
     */

    const resposta =
        gerarResposta(texto);


    /*
     * Mostra resposta
     */

    adicionarMensagem(
        resposta,
        "ia"
    );


    /*
     * Salva histórico
     */

    salvarHistorico(
        texto,
        resposta
    );


    estado.ultimaPergunta =
        texto;

    estado.ultimaResposta =
        resposta;
}


/* ========================================================
   EVENTOS
======================================================== */

enviar.addEventListener(
    "click",
    processarMensagem
);


entrada.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            event.preventDefault();

            processarMensagem();
        }
    }
);


/* ========================================================
   INICIALIZAÇÃO
======================================================== */

function iniciar() {

    estado.iniciada = true;


    adicionarMensagem(
        `
Olá! 👋

Eu sou o Nexus, uma IA experimental
100% JavaScript.

Pode me perguntar sobre programação,
JavaScript, HTML, CSS, IA ou freelancing.

Experimente perguntar:
"Quem é você?"
        `.trim(),

        "ia"
    );
}


iniciar();
