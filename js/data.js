export const roadmapData = {
    title: 'Módulo Medicina Veterinária',
    topics: [
        {
            id: 'medicina-ruminantes',
            title: 'Medicina de Ruminantes',
            subtopics: [
                { title: 'Semiologia e Exame Clínico [PDF]', url: 'https://www.unimar.br/biblioteca/publicacoes/XX_unimar_ciencias.pdf'},
                { title: 'Afecções do Sistema Digestório [Artigo]', url: 'https://caesegatos.com.br/diarreia-aguda-em-caes-novas-diretrizes/'},
                { title: 'Doenças Sistêmicas e Metabólicas [PDF]', url: 'pdfs/doencas-sistemicas.pdf'},
                { title: 'Doenças Infecciosas e Parasitárias [Vídeo - Webinar]', url: 'https://www.youtube.com/watch?v=ktyhN3IxCM8'},
                { title: 'Medicina de Neonatos [PDF]', url: 'pdfs/neonato-canino.pdf'},
                { title: 'Afecções da Glândula Mamária [Artigo - PDF]', url: 'https://repositorio-racs.famerp.br/racs_ol/vol-15-4/IDB%20293.pdf'}
            ],
            description: 'Estudo abrangente da medicina de ruminantes, incluindo diagnóstico e tratamento de afecções comuns.',
            status: 'not-started'
        },
        {
            id: 'medicina-equideos',
            title: 'Medicina e Criação de Equídeos',
            subtopics: [
                { title: 'Sistema Respiratório [Artigo - PDF]', url: 'https://repositorio.ufmg.br/server/api/core/bitstreams/087c99c7-93a2-4779-89d9-b7168df12b2a/content'},
                { title: 'Criação e Manejo [PDF - Manual]', url: 'https://www.cnabrasil.org.br/assets/arquivos/185-EQUIDEOS.pdf'},
                { title: 'Nutrição Equina [Artigo - PDF]', url: 'https://revistas.ufpr.br/veterinary/article/view/51605/31037'}, 
                { title: 'Farmacologia e Terapêutica [PDF - Guia]', url: 'https://pt.scribd.com/document/619231410/Guia-de-Equinos-1a-Edicao'}
            ],
            description: 'Medicina especializada em equinos, abordando aspectos clínicos e de manejo.',
            status: 'not-started'
        },
        {
            id: 'medicina-investigativa',
            title: 'Medicina Veterinária Investigativa',
            subtopics: [
                { title: 'Patologia e Tanatologia Forense [PDF]', url: 'pdfs/tanatologia.pdf'},
                { title: 'Direito e Ética Legal [Diretrizes]', url: 'https://www.crmvac.org.br/codigo-de-etica-do-medico-veterinario/'},
                { title: 'Investigação de Maus-Tratos e Bem-Estar [PDF - Artigo]', url: 'https://repositorio.ufmg.br/server/api/core/bitstreams/6b930e02-78f7-49a6-908c-69c82189a6cc/content'},
                { title: 'Toxicologia e Entomologia Forense [Artigo - PDF]', url: 'https://www.researchgate.net/publication/272680493_Entomologia_Forense_Medico-Veterinaria/links/54ec84360cf2465f532f8af3/Entomologia-Forense-Medico-Veterinaria.pdf'}, 
                { title: 'Perícias Específicas [Curso]', url: 'https://www.sp.senac.br/extensao-universitaria/extensao-em-elaboracao-de-laudo-e-parecer'}
            ],
            description: 'Perícia veterinária e investigação forense aplicada à medicina veterinária.',
            status: 'not-started'
        },
        {
            id: 'imunologia-vacinacao',
            title: 'Imunologia e Vacinação',
            subtopics: [
                { title: 'Imunidade inata e adaptativa em cães e gatos [Vídeo]', url: 'https://www.youtube.com/watch?v=uw6YxBdjhlU'}, 
                { title: 'Tipos de vacinas [PDF - Diretrizes]', url: 'https://wsava.org/wp-content/uploads/2024/07/WSAVA-VC-Guidelines-2024-Portuguese.pdf'}, 
                { title: 'Doenças preveníveis por vacinação [PDF - Diretrizes]', url: 'https://wsava.org/wp-content/uploads/2024/07/WSAVA-VC-Guidelines-2024-Portuguese.pdf'}, 
                { title: 'Protocolos vacinais para diferentes espécies e faixas etárias [PDF - Diretrizes]', url: 'https://wsava.org/wp-content/uploads/2024/07/WSAVA-VC-Guidelines-2024-Portuguese.pdf'}
            ],
            description: 'Estudo detalhado do sistema imune dos animais, os mecanismos de defesa e a importância dos protocolos vacinais para prevenção de doenças infecciosas.',
            status: 'not-started'
        },
        {
            id: 'ortopedia-basica-fraturas',
            title: 'Ortopedia Básica e Fraturas',
            subtopics: [
                { title: 'Classificação e tipos de fraturas [Artigo]', url: 'https://www.vetprofissional.com.br/artigos/fraturas-osseas-em-caes-e-gatos-voce-sabe-classificar-uma-fratura'},
                { title: 'Imobilização de emergência e manejo da dor [Vídeo]', url: 'https://www.youtube.com/watch?v=LO6kZqLAiDs'},
                { title: 'Principais doenças articulares [Artigo]', url: 'https://www.veterinaria-atual.pt/destaques/osteoartrite-tratamento-multimodal-e-a-chave-para-controlo-da-doenca/'},
                { title: 'Princípios de redução e fixação cirúrgica de fraturas [Artigo - PDF]', url: 'https://lume.ufrgs.br/bitstream/handle/10183/148234/001000990.pdf?sequence=1'}
            ],
            description: 'Abordagem das patologias do sistema musculoesquelético, incluindo diagnóstico e manejo inicial de fraturas comuns e doenças articulares.',
            status: 'not-started'
        },
        {
            id: 'placeholder-3',
            title: 'Anestesiologia e Terapia da Dor',
            subtopics: [
                { title: 'Fases da anestesia e plano anestésico [PDF - Sebenta]', url: 'https://dspace.uevora.pt/rdpc/bitstream/10174/4903/1/Sebenta%20anestesia%20geral%20em%20pequenos%20animais.pdf'},
                { title: 'Agentes inalatórios vs. injetáveis (propofol, isoflurano) [Artigo]', url: 'https://eventos.pgsscogna.com.br/anais/trabalho/25609'}, 
                { title: 'Monitoramento da pressão arterial, oximetria e capnografia [PDF]', url: 'https://pt.scribd.com/document/854957767/Monitoracao-Anestesica-na-veterinaria'},
                { title: 'Escalas de dor e analgesia multimodal (opioides, AINEs) [Artigo]', url: 'https://animalpain.org/caes-dor/'}
            ],
            description: 'Estudo dos agentes anestésicos, monitoramento do paciente cirúrgico e as diversas abordagens para controle eficaz da dor aguda e crônica em animais.',
            status: 'not-started'
        },
        {
            id: 'teste-final',
            title: 'Teste Final',
            subtopics: [
                { title: 'Iniciar Quiz: Fundamentos Essenciais da Veterinária', url: 'medicina-quiz.html'}
            ],
            description: 'Avaliação final do módulo de Medicina Veterinária.',
            status: 'not-started'
        }
    ]
};