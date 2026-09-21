# Entrega — Diagnóstico AUREON

## Estado

- Implementação: branch `feat/aureon-diagnostico`.
- URL final planejada: `https://aureon-tech.github.io/`.
- WhatsApp Business da AUREON: confirmado e configurado.
- Kiwify: próxima fase.

## Evidências automatizadas

- Em 21/09/2026, `node --test tests/*.test.js`: 19 testes executados, 19 aprovados e 0 falhas.
- Motor com nove perguntas em cada caminho.
- Recomendações e preços aprovados.
- Validação de identidade e consentimento.
- Sessão local com expiração de 24 horas.
- Ausência de envio invisível por rede.
- PWA com cache versionado.

## Verificação manual necessária antes do deploy

O navegador remoto de validação bloqueou o endereço local com `ERR_BLOCKED_BY_CLIENT`. Por isso, os itens abaixo continuam como critérios obrigatórios antes da publicação, sem serem marcados como aprovados antecipadamente.

- 360×800 e 412×915.
- Chrome Android, navegador interno do Instagram e Safari iPhone.
- Voltar, atualizar, continuar e reiniciar.
- Mensagem final do WhatsApp sem efetuar o envio.
- Atualização do service worker e ausência de rolagem horizontal.

## Publicação

O CTA está habilitado com o número comercial confirmado. A publicação depende apenas da integração desta branch e da verificação visual final no endereço público.
