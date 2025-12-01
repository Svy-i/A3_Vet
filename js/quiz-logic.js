// js/quiz-logic.js

const medicinaQuizData = {
  "questions": [
    {
      "questionNumber": 1,
      "question": "Qual agente etiológico primário é responsável pela **Parvovirose Canina**, uma doença altamente contagiosa e frequentemente fatal em filhotes?",
      "answerOptions": [
        {
          "text": "Bactéria (Ex: Leptospira spp.)",
          "isCorrect": false,
          "rationale": "A Leptospirose é causada por bactérias, não pelo Parvovírus. A Parvovirose é causada por um vírus de DNA não envelopado."
        },
        {
          "text": "Vírus (Parvovirus Canino tipo 2 - CPV-2)",
          "isCorrect": true,
          "rationale": "A Parvovirose Canina é causada pelo **Parvovirus Canino Tipo 2 (CPV-2)**. Este vírus é resistente no ambiente e ataca células de divisão rápida, como as do trato gastrointestinal e medula óssea."
        },
        {
          "text": "Protozoário (Ex: Toxoplasma gondii)",
          "isCorrect": false,
          "rationale": "Toxoplasma gondii é um protozoário causador da Toxoplasmose. O Parvovírus é um vírus."
        },
        {
          "text": "Fungo (Ex: Microsporum canis)",
          "isCorrect": false,
          "rationale": "Microsporum canis é um fungo causador de dermatofitose (tinha). O Parvovírus é um vírus."
        }
      ],
      "hint": "Esta doença é uma das principais razões para a vacinação precoce em cães."
    },
    {
      "questionNumber": 2,
      "question": "Qual dos seguintes parâmetros é considerado o **sinal mais sensível e precoce** de dor ou desconforto em animais de companhia (cães e gatos)?",
      "answerOptions": [
        {
          "text": "Aumento extremo da temperatura corporal (febre).",
          "isCorrect": false,
          "rationale": "A febre (hipertermia) nem sempre está presente na dor e muitas vezes indica infecção ou inflamação sistêmica, sendo um sinal inespecífico de dor."
        },
        {
          "text": "Mudanças no comportamento e no temperamento (ex: relutância em se mover, vocalização, agressividade).",
          "isCorrect": true,
          "rationale": "As **mudanças comportamentais** são o indicador mais confiável e precoce de dor em animais. Relutância em se mover e alterações de postura são sinais mais sutis e comuns."
        },
        {
          "text": "Aumento da frequência cardíaca e respiratória (taquicardia e taquipneia).",
          "isCorrect": false,
          "rationale": "Taquicardia e taquipneia são sinais de estresse ou dor aguda, mas não são o sinal mais sensível e precoce, pois podem ser influenciados por excitação ou medo."
        },
        {
          "text": "Perda de peso abrupta em 24 horas.",
          "isCorrect": false,
          "rationale": "A perda de peso é um sinal crônico de doença, e não um indicador de dor aguda ou desconforto imediato."
        }
      ],
      "hint": "Animais são mestres em esconder o sofrimento. O que é mais fácil de notar na rotina diária?"
    },
    {
      "questionNumber": 3,
      "question": "Em gatos, qual doença endócrina é mais comumente observada em pacientes geriátricos, caracterizada por **perda de peso apesar do aumento do apetite (polifagia)**?",
      "answerOptions": [
        {
          "text": "Diabetes Mellitus",
          "isCorrect": false,
          "rationale": "Embora seja comum, o Diabetes Mellitus causa polifagia e perda de peso, mas o principal achado é a hiperglicemia e polidipsia/poliúria acentuada."
        },
        {
          "text": "Hipotireoidismo",
          "isCorrect": false,
          "rationale": "O Hipotireoidismo é raro em gatos e está associado ao **ganho** de peso."
        },
        {
          "text": "Doença de Cushing (Hiperadrenocorticismo)",
          "isCorrect": false,
          "rationale": "A Doença de Cushing é mais comum em cães. Em gatos, o hipertireoidismo é a principal causa de perda de peso com polifagia em idosos."
        },
        {
          "text": "Hipertireoidismo",
          "isCorrect": true,
          "rationale": "O **Hipertireoidismo** (produção excessiva de T4) é a endocrinopatia mais comum em gatos idosos, levando a um metabolismo acelerado, perda de peso e aumento do apetite (polifagia)."
        }
      ],
      "hint": "Esta doença afeta a glândula tireoide e acelera o metabolismo do felino."
    },
    {
      "questionNumber": 4,
      "question": "Na farmacologia veterinária, a via de administração **subcutânea (SC)** é preferível à intramuscular (IM) para grandes volumes de fluidos e certas vacinas. Qual é o principal motivo dessa preferência?",
      "answerOptions": [
        {
          "text": "A absorção subcutânea é significativamente mais rápida do que a intramuscular.",
          "isCorrect": false,
          "rationale": "A absorção SC é geralmente **mais lenta** que a IM devido à menor vascularização do tecido subcutâneo."
        },
        {
          "text": "O tecido muscular tem pouca tolerância a grandes volumes, e a injeção SC é menos dolorosa e tem menor risco de dano neural ou vascular.",
          "isCorrect": true,
          "rationale": "A via SC pode acomodar volumes maiores com **menor risco** de complicações graves (como lesão de nervos importantes ou necrose muscular) e menor desconforto."
        },
        {
          "text": "A via SC garante a biodisponibilidade de 100% dos fármacos injetados.",
          "isCorrect": false,
          "rationale": "A biodisponibilidade de 100% é tipicamente alcançada apenas pela via intravenosa (IV)."
        },
        {
          "text": "Grandes volumes de fluidos só podem ser administrados em veias periféricas, o que impede a via IM.",
          "isCorrect": false,
          "rationale": "Grandes volumes de fluidos (fluidoterapia) são frequentemente administrados IV ou SC. A via IM nunca é usada para grandes volumes."
        }
      ],
      "hint": "Pense no conforto do paciente e nos riscos de atingir estruturas profundas."
    },
    {
      "questionNumber": 5,
      "question": "Em cirurgia veterinária, o termo **'deiscência'** refere-se a qual complicação pós-operatória?",
      "answerOptions": [
        {
          "text": "A formação de um seroma (acúmulo de fluido seroso) sob a incisão.",
          "isCorrect": false,
          "rationale": "Seroma é o acúmulo de fluido sob a ferida, não a separação das bordas."
        },
        {
          "text": "A separação ou falha na cicatrização das bordas de uma ferida cirúrgica, resultando na abertura parcial ou total da incisão.",
          "isCorrect": true,
          "rationale": "**Deiscência** é a falha na aproximação dos tecidos, resultando na separação das margens da ferida. É uma complicação séria que pode levar à evisceração."
        },
        {
          "text": "Uma infecção no local da cirurgia (ISC) causada por bactérias resistentes.",
          "isCorrect": false,
          "rationale": "ISC é Infecção do Sítio Cirúrgico, enquanto deiscência é a falha mecânica da sutura/cicatrização."
        },
        {
          "text": "A aderência anormal de tecidos (bridas) no interior da cavidade abdominal.",
          "isCorrect": false,
          "rationale": "Aderências (bridas) são uma complicação interna, não a abertura da ferida externa."
        }
      ],
      "hint": "Esta complicação é o oposto do que se espera de uma boa sutura."
    }
  ]
};

// =================================================================
// Lógica de Renderização e Interação (Ajustada para usar medicinaQuizData)
// =================================================================

let currentQuestionIndex = 0;
let score = 0;
// Note a referência à medicinaQuizData
const quizData = medicinaQuizData; 
const questionArea = document.getElementById('question-area');
const nextButton = document.getElementById('next-btn');
const resultsArea = document.getElementById('results-area');

document.addEventListener('DOMContentLoaded', loadQuestion);
nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.questions.length) {
        loadQuestion();
    } else {
        showResults();
    }
});

function loadQuestion() {
    // Limpa a área de perguntas e o botão
    questionArea.innerHTML = '';
    nextButton.style.display = 'none';
    resultsArea.innerHTML = ''; // Limpa resultados anteriores
    
    if (currentQuestionIndex >= quizData.questions.length) {
        showResults();
        return;
    }

    const currentQuestion = quizData.questions[currentQuestionIndex];
    
    // Renderiza o número da pergunta e o texto
    const questionEl = document.createElement('div');
    questionEl.innerHTML = `
        <h2>Pergunta ${currentQuestion.questionNumber} de ${quizData.questions.length}</h2>
        <p><strong>${currentQuestion.question}</strong></p>
        <div id="options-container"></div>
        <div id="feedback-area"></div>
        <div id="hint-area" style="font-size: 0.9em; color: #888;">Dica: ${currentQuestion.hint}</div>
    `;
    questionArea.appendChild(questionEl);
    
    const optionsContainer = document.getElementById('options-container');

    // Renderiza as opções
    currentQuestion.answerOptions.forEach((option, index) => {
        const optionButton = document.createElement('button');
        optionButton.textContent = option.text;
        optionButton.className = 'quiz-option';
        optionButton.dataset.index = index;
        optionButton.addEventListener('click', handleAnswerClick);
        optionsContainer.appendChild(optionButton);
    });
}

function handleAnswerClick(event) {
    const selectedButton = event.target;
    const selectedIndex = parseInt(selectedButton.dataset.index);
    const currentQuestion = quizData.questions[currentQuestionIndex];
    const isCorrect = currentQuestion.answerOptions[selectedIndex].isCorrect;
    const rationale = currentQuestion.answerOptions[selectedIndex].rationale;
    const feedbackArea = document.getElementById('feedback-area');

    // Desabilita todos os botões de opção após o clique
    document.querySelectorAll('.quiz-option').forEach(button => {
        button.disabled = true;
        // Marca a opção correta
        if (currentQuestion.answerOptions[parseInt(button.dataset.index)].isCorrect) {
            button.classList.add('correct-answer');
        } 
    });
    
    // Marca a opção incorreta selecionada
    if (!isCorrect) {
        selectedButton.classList.add('incorrect-answer');
    }

    // Adiciona feedback e rationale
    if (isCorrect) {
        score++;
        feedbackArea.innerHTML = `<p class="feedback correct">✅ Correto! 🎉</p><p class="rationale">${rationale}</p>`;
    } else {
        feedbackArea.innerHTML = `<p class="feedback incorrect">❌ Incorreto. A resposta correta está marcada em verde.</p><p class="rationale">${rationale}</p>`;
    }

    nextButton.style.display = 'block';
}

function showResults() {
    questionArea.innerHTML = '';
    // Certifique-se de que a referência a 'nextButton' existe e está correta
    if (typeof nextButton !== 'undefined') {
        nextButton.style.display = 'none';
    }
    
    // Certifique-se de que a referência a 'resultsArea' existe e está correta
    const resultsArea = document.getElementById('results-area');
    
    const totalQuestions = quizData.questions.length;
    const percentage = ((score / totalQuestions) * 100).toFixed(0);
    
    resultsArea.innerHTML = `
        <h2>Resultados do Teste</h2>
        <p>Sua pontuação final é ${score} de ${totalQuestions} (${percentage}%).</p>
        <p>Parabéns por completar o módulo! 🎉</p>
        
        <button id="returnToModuleBtn" class="return-btn" 
            onclick="window.location.href='index.html'">
            Voltar a Página Inicial
        </button>
    `;

    // Você também pode adicionar o listener via JS (Alternativa ao onclick):
    // document.getElementById('returnToModuleBtn').addEventListener('click', () => {
    //     window.location.href = 'index.html'; 
    // });
}

// Estilos básicos (CSS) injetados para demonstração
const style = document.createElement('style');
style.innerHTML = `
    #quiz-container { max-width: 600px; margin: 50px auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px; font-family: Arial, sans-serif; }
    #options-container { display: flex; flex-direction: column; gap: 10px; margin: 20px 0; }
    .quiz-option { padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9; cursor: pointer; text-align: left; transition: all 0.2s; border-radius: 4px; }
    .quiz-option:hover:not(:disabled) { background-color: #eee; }
    .quiz-option:disabled { opacity: 0.9; }
    .correct-answer { background-color: #d4edda !important; border-color: #c3e6cb !important; font-weight: bold; }
    .incorrect-answer { background-color: #f8d7da !important; border-color: #f5c6cb !important; }
    .feedback.correct { color: #155724; }
    .feedback.incorrect { color: #721c24; }
    .rationale { border-left: 3px solid #007bff; padding: 10px; margin-top: 10px; background-color: #f8f8ff; border-radius: 4px; }
    #next-btn { padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; margin-top: 20px; }
    #hint-area { margin-top: 10px; padding: 5px; background-color: #ffffcc; border: 1px solid #ffcc00; border-radius: 4px;}
    #returnToModuleBtn { 
        padding: 10px 20px; 
        margin-top: 20px; 
        background-color: #28a745; /* Um verde atraente */
        color: white; 
        border: none; 
        border-radius: 5px; 
        cursor: pointer; 
        font-weight: bold;
        transition: background-color 0.2s;
    }
    #returnToModuleBtn:hover {
        background-color: #218838;
    }
    h2 { font-size: 1.2em; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 15px; }
`;
document.head.appendChild(style);