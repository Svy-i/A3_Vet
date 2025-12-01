export const roadmapData = {
    title: 'Módulo Sistemas Vitais (Cardio, Resp, Renal)',
        topics: [
            {
                id: 'cardiologia-basica',
                title: 'Cardiologia Básica',
                subtopics: [
                    { title: 'Anatomia e Fisiologia Cardíaca [Resumo]', url: 'resumos/cardio-fisiologia.html' },
                    { title: 'Ausculta Cardíaca: Sons e Sopros [Áudios]', url: 'https://www.vetdigital.com.br/ausculta-cardiaca-veterinaria' },
                    { title: 'Principais Cardiopatias [PDF]', url: 'pdfs/cardiopatias-veterinarias.pdf' },
                    { title: 'Introdução ao ECG [Vídeo]', url: 'https://www.youtube.com/watch?v=ecg-basico-vet' }
                ],
                description: 'Fundamentos da cardiologia veterinária.',
                status: 'not-started'
            },
            {
                id: 'pneumologia-e-respiracao',
                title: 'Pneumologia e Sistema Respiratório',
                subtopics: [
                    { title: 'Mecânica Respiratória [Artigo]', url: 'https://www.scielo.br/j/rvz/a/mecanica-respiratoria' },
                    { title: 'Diagnóstico Respiratório [Guia]', url: 'guias/diagnostico-respiratorio-vet.pdf' },
                    { title: 'Emergências Respiratórias [Protocolo]', url: 'protocolos/emergencia-respiratoria.pdf' },
                    { title: 'Oxigenoterapia e Nebulização [Manual]', url: 'manuais/oxigenoterapia-nebulizacao.pdf' }
                ],
                description: 'Diagnóstico e manejo de doenças respiratórias.',
                status: 'not-started'
            },
            {
                id: 'nefrologia-e-urogenital',
                title: 'Nefrologia e Sistema Urinário',
                subtopics: [
                    { title: 'Fisiologia Renal [Apostila]', url: 'apostilas/fisiologia-renal.pdf' },
                    { title: 'Urinálise Completa [Passo a Passo]', url: 'passo-a-passo/urinalise-completa.html' },
                    { title: 'Doença Renal Crônica [Artigo]', url: 'https://www.revistaclinicaveterinaria.com.br/artigos/drc-estadiamento' },
                    { title: 'Urolitíase e Obstrução Uretral [Vídeo]', url: 'https://www.youtube.com/watch?v=urolitiase-obstrucao' }
                ],
                description: 'Função renal e manejo das principais doenças urinárias.',
                status: 'not-started'
            },
            {
                id: 'teste-final-sistemas',
                title: 'Teste Final',
                subtopics: [
                    { title: 'Iniciar Quiz: Avaliação dos Sistemas Vitais', url: 'sistemas-vitais-quiz.html' }
                ],
                description: 'Avaliação final do módulo.',
                status: 'not-started'
            }
        ]
};