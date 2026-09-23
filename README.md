# Diagnóstico AUREON

Experiência conversacional curta da AUREON para separar dois públicos: quem quer aprender a criar aplicativos e quem quer contratar a criação de um aplicativo.

## Fluxo adaptativo

- Escolha inicial: aprender ou contratar.
- Três perguntas específicas para cada caminho.
- Nome solicitado apenas antes do resultado.
- Sem telefone, e-mail ou cidade obrigatórios.
- Método AUREON encaminhado para o checkout da Kiwify.
- Projetos personalizados encaminhados para o WhatsApp com resumo automático.

## Ofertas

- Método AUREON: R$ 59,99.
- AUREON Start: R$ 599,99.
- AUREON Pro: R$ 1.499,99.
- AUREON Business: a partir de R$ 2.999,99.
- AUREON SaaS: sob orçamento.

## WhatsApp

O WhatsApp Business da AUREON está configurado em `js/site-config.js` como `5511926868865` (+55 11 92686-8865).

## Testes

```bash
node --test tests/*.test.js
```

Os testes cobrem quantidade de perguntas, progresso, recomendação por investimento, checkout, identidade mínima e resumo do WhatsApp.
