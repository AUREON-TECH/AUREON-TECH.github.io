# Diagnóstico AUREON — Especificação de Design

**Data:** 21/09/2026  
**Repositório:** `AUREON-TECH/AUREON-TECH.github.io`  
**URL pública:** https://aureon-tech.github.io/  
**Fase atual:** WhatsApp como destino comercial  
**Fase seguinte:** integração com produto da Kiwify

## 1. Objetivo

Transformar o site principal da AUREON em uma experiência conversacional de captação. O visitante será identificado, responderá a um diagnóstico curto e será direcionado para um dos dois serviços:

1. **Quero que a AUREON crie meu aplicativo.**
2. **Quero aprender a criar aplicativos.**

O resultado deve qualificar o visitante e abrir o WhatsApp com uma mensagem pronta contendo um resumo das respostas. A experiência utiliza como referência o padrão de questionário conversacional enviado por Raphael, mas terá textos, identidade visual, lógica e componentes originais da AUREON.

## 2. Princípios

- Prioridade total para celular e navegador interno do Instagram.
- Uma pergunta por etapa, com linguagem simples e humana.
- Sem login e sem instalação obrigatória.
- O visitante sempre sabe o progresso.
- As respostas permanecem no dispositivo até o envio voluntário ao WhatsApp.
- Nenhum dado pessoal é enviado silenciosamente.
- O site atual deve permanecer recuperável pelo histórico do GitHub.
- A Kiwify não entra nesta fase para não bloquear a publicação.

## 3. Jornada principal

### 3.1 Entrada

A página inicial apresenta:

- marca AUREON;
- promessa: **“Descubra se você precisa criar um aplicativo ou aprender a construir o seu.”**;
- explicação curta;
- botão **“Começar diagnóstico”**;
- aviso de duração aproximada;
- links para termos e privacidade.

### 3.2 Identificação

O visitante informa:

1. nome;
2. WhatsApp;
3. e-mail;
4. cidade/estado.

Antes de avançar, o site solicita consentimento claro para usar esses dados exclusivamente no contato comercial solicitado.

### 3.3 Roteamento

Pergunta central:

**“Qual resultado você busca agora?”**

- **Quero que criem meu aplicativo.**
- **Quero aprender a criar aplicativos.**

A resposta abre um questionário específico.

## 4. Caminho A — Criar meu aplicativo

Perguntas:

1. Qual é o seu segmento ou tipo de negócio?
2. Qual problema você quer resolver?
3. Quem utilizará o aplicativo?
4. Qual resultado seria mais importante?
5. Quais funções são indispensáveis?
6. Você já possui site, sistema ou aplicativo?
7. Em quanto tempo pretende começar?
8. Qual faixa de investimento considera?
9. Prefere uma solução pronta, personalizada ou ainda não sabe?

### Resultado

O diagnóstico classifica a oportunidade em uma destas recomendações:

- **Aplicativo sob medida**
- **Automação empresarial**
- **PWA/site comercial**
- **Diagnóstico estratégico com a AUREON**

O resultado explica brevemente a recomendação e apresenta o botão **“Conversar sobre meu aplicativo”**.

## 5. Caminho B — Aprender a criar aplicativos

Perguntas:

1. Qual é o seu nível atual?
2. Você já criou algum aplicativo?
3. O que deseja construir primeiro?
4. Seu objetivo é uso próprio, carreira ou renda?
5. Quanto tempo por semana pode estudar?
6. Prefere aulas, acompanhamento ou projeto prático?
7. Já utiliza ChatGPT, GitHub, Supabase ou Vercel?
8. Pretende vender aplicativos para clientes?
9. Quando deseja começar?

### Resultado

O diagnóstico classifica a oportunidade em:

- **Formação iniciante**
- **Método prático para criar o primeiro aplicativo**
- **Mentoria para transformar habilidade em renda**
- **Acompanhamento de projeto real**

O botão final será **“Quero aprender com a AUREON”**.

## 6. Integração com WhatsApp

Na primeira fase, nenhum formulário será enviado para servidor próprio. Ao tocar no botão final:

1. o navegador monta uma mensagem com nome, caminho escolhido, respostas e recomendação;
2. o visitante visualiza que será encaminhado ao WhatsApp;
3. o site abre `wa.me` com a mensagem preenchida;
4. o visitante decide se envia.

O número de destino ficará em uma configuração única do projeto e só será publicado após confirmação explícita do número comercial da AUREON.

Exemplo do caminho A:

> Olá, Raphael. Fiz o Diagnóstico AUREON e quero criar um aplicativo. Meu segmento é [segmento]. O problema principal é [problema]. Minha recomendação foi [resultado].

Exemplo do caminho B:

> Olá, Raphael. Fiz o Diagnóstico AUREON e quero aprender a criar aplicativos. Meu nível é [nível], meu objetivo é [objetivo] e minha recomendação foi [resultado].

## 7. Identidade visual

A experiência será original:

- azul profundo como fundo principal;
- azul elétrico para progresso e ações;
- branco para leitura;
- dourado discreto para destaques premium;
- cartões com profundidade suave;
- avatar/símbolo da AUREON, sem reutilizar fotografias ou marcas da referência;
- animações curtas, sem prejudicar celulares mais simples;
- tipografia grande e legível.

## 8. Componentes

- tela inicial;
- cabeçalho de progresso;
- bolha de mensagem AUREON;
- resposta do visitante;
- campo de texto;
- seletor de alternativas;
- validação de telefone e e-mail;
- navegação voltar/avançar;
- motor de perguntas condicionais;
- cálculo do resultado;
- tela de recomendação;
- gerador da mensagem do WhatsApp;
- termos e privacidade;
- captura dos parâmetros UTM da URL.

## 9. Dados e privacidade

- Respostas mantidas localmente durante o diagnóstico.
- Nenhuma captura de câmera, localização ou dados do aparelho.
- Nenhum envio invisível.
- Consentimento obrigatório antes do contato.
- Parâmetros UTM usados somente para identificar origem da campanha.
- O visitante pode reiniciar e limpar as respostas.
- A futura persistência em banco exigirá uma nova revisão de privacidade e segurança.

## 10. Compatibilidade

A implementação deve funcionar em:

- navegador interno do Instagram;
- Chrome no Android;
- Safari no iPhone;
- desktop;
- telas pequenas como Galaxy A14;
- conexão lenta, com carregamento leve.

## 11. Acessibilidade

- contraste adequado;
- botões grandes;
- campos com rótulos;
- navegação por teclado;
- mensagens de erro claras;
- suporte a redução de movimento;
- foco visível;
- nenhuma informação transmitida apenas por cor.

## 12. Rastreamento

A primeira fase registra apenas no próprio navegador:

- origem UTM;
- caminho escolhido;
- conclusão ou abandono;
- clique no WhatsApp.

Analytics externo só será ativado após definir a ferramenta e a política de privacidade. A URL atual com parâmetros do Instagram continuará compatível.

## 13. Publicação segura

- O site atual será preservado no histórico Git.
- A mudança será feita em arquivos versionados.
- O HTML, CSS e JavaScript serão separados quando isso melhorar manutenção e testes.
- O service worker terá versão atualizada para não manter página antiga em cache.
- A publicação ocorrerá no GitHub Pages do repositório atual.
- O mesmo endereço público será mantido.

## 14. Testes obrigatórios

Antes de declarar a entrega concluída:

- validar os dois caminhos completos;
- validar as nove perguntas de cada caminho;
- testar voltar e avançar;
- testar campos inválidos;
- verificar o cálculo de cada resultado;
- confirmar a mensagem do WhatsApp sem enviar;
- testar parâmetros UTM;
- testar reinício do diagnóstico;
- testar no tamanho do Galaxy A14;
- verificar ausência de erros no console;
- testar cache e atualização do service worker;
- confirmar que nenhuma resposta é transmitida sem ação do visitante;
- testar o link público depois do deploy.

## 15. Critérios de aceite

A fase é considerada pronta apenas quando:

- o mesmo link público abrir a nova experiência;
- os dois segmentos funcionarem de ponta a ponta;
- o resultado mudar conforme as respostas;
- o WhatsApp abrir com resumo correto;
- não houver coleta invisível de dados;
- o site funcionar dentro do Instagram e em celular;
- a identidade for claramente AUREON;
- o site anterior continuar recuperável pelo GitHub;
- os testes obrigatórios tiverem evidências.

## 16. Ofertas e preços aprovados

| Oferta | Entrega | Valor |
|---|---|---:|
| Aprender a criar aplicativos | Produto digital de entrada | **R$ 59,99** |
| AUREON Start | Primeiro aplicativo adaptado ao nicho | **R$ 599,99** |
| AUREON Pro | Login, banco de dados e painel administrativo | **R$ 1.499,99** |
| AUREON Business | Sistema personalizado completo | **a partir de R$ 2.999,99** |
| AUREON SaaS | Plataforma com usuários, assinaturas e gestão | **a partir de R$ 4.999,99** |

O AUREON SaaS pode incluir suporte e manutenção a partir de **R$ 199,99 por mês**. O diagnóstico apresenta a oferta compatível com as respostas sem prometer que todo projeto cabe no menor pacote. O pacote Start não inclui marketplace, sistema financeiro, inteligência artificial avançada, painel complexo, pagamentos recorrentes ou integrações externas complexas.

## 17. Próxima fase — Kiwify

Depois que Raphael cadastrar o produto e fornecer o link correto:

- o caminho **Aprender a criar aplicativos** ganhará um botão de compra;
- o WhatsApp continuará disponível para dúvidas;
- os links da Kiwify terão rastreamento UTM;
- preço, garantia e entrega serão exibidos sem promessas enganosas;
- a compra não será implementada antes de o produto estar configurado.
