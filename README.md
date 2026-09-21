# Diagnóstico AUREON

Experiência conversacional da AUREON para qualificar dois públicos: quem deseja contratar a criação de um aplicativo e quem deseja aprender a criar aplicativos.

## Ofertas

- Aprender a criar aplicativos: R$ 59,99.
- AUREON Start: R$ 599,99.
- AUREON Pro: R$ 1.499,99.
- AUREON Business: a partir de R$ 2.999,99.
- AUREON SaaS: a partir de R$ 4.999,99; suporte a partir de R$ 199,99/mês.

## Arquivos

- `js/questions.js`: perguntas e pesos.
- `js/engine.js`: recomendação.
- `js/state.js`: validação e sessão local.
- `js/site-config.js`: número comercial.
- `js/whatsapp.js`: mensagem e link.
- `js/app.js`: interface.

## Configurar WhatsApp

Insira o número comercial confirmado em `js/site-config.js`, usando país, DDD e número, somente dígitos. Exemplo de formato: `5511999999999`. Não publique enquanto o teste `production number is publishable` não estiver verde.

## Testes

```bash
node --test tests/*.test.js
```

## Publicação e rollback

O GitHub Pages publica a branch principal. Para desfazer uma entrega, reverta o commit de merge; o site anterior permanece no histórico. A Kiwify ainda não está ativa porque o produto e o checkout precisam ser cadastrados e verificados primeiro.
