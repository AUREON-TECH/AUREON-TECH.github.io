# Diagnóstico AUREON

Experiência conversacional da AUREON para qualificar dois públicos: quem deseja contratar a criação de um aplicativo e quem deseja aprender a criar aplicativos.

## Ofertas

- Aprender a criar aplicativos: R$ 59,99.
- AUREON Start: R$ 599,99.
- AUREON Pro: R$ 1.499,99.
- AUREON Business: a partir de R$ 2.999,99.
- AUREON SaaS: sob orçamento.

## Arquivos

- `js/questions.js`: perguntas e pesos.
- `js/engine.js`: recomendação.
- `js/state.js`: validação e sessão local.
- `js/site-config.js`: número comercial.
- `js/whatsapp.js`: mensagem e link.
- `js/app.js`: interface.

## Configurar WhatsApp

O WhatsApp Business da AUREON está configurado em `js/site-config.js` como `5511926868865` (+55 11 92686-8865).

## Testes

```bash
node --test tests/*.test.js
```

A suíte possui 25 testes cobrindo os dois caminhos com nove perguntas, recomendação, identidade/consentimento, sessão local, PWA, privacidade e WhatsApp.

## Publicação e rollback

O código do Diagnóstico AUREON está integrado à branch `main`, usada pelo GitHub Pages para o endereço oficial `https://aureon-tech.github.io/`. Para desfazer uma entrega, reverta o commit correspondente; o histórico anterior permanece disponível.

O resultado Método AUREON leva ao checkout validado da Kiwify; os demais resultados continuam no atendimento pelo WhatsApp.
