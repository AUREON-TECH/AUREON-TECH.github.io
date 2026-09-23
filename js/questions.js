const option = (label, value) => ({ label, value });

export const BUILD_QUESTIONS = Object.freeze([
  { id: "goal", prompt: "O que você quer transformar em aplicativo?", type: "single", required: true, options: [option("Atendimento ou vendas", "sales"), option("Gestão e produtividade", "management"), option("Aplicativo para clientes", "customers"), option("Tenho outra ideia", "other")] },
  { id: "stage", prompt: "Em qual etapa você está?", type: "single", required: true, options: [option("Tenho apenas a ideia", "idea"), option("Já tenho um processo ou planilha", "process"), option("Já comecei o projeto", "started"), option("Preciso melhorar um aplicativo", "improve")] },
  { id: "solution", prompt: "Qual tipo de solução você procura?", type: "single", required: true, options: [option("Um primeiro aplicativo simples", "first-app"), option("Aplicativo com login e banco de dados", "app-database"), option("Sistema completo para minha empresa", "business-system"), option("Plataforma para vários usuários", "saas-platform"), option("Preciso de orientação", "guidance")] },
]);

export const LEARN_QUESTIONS = Object.freeze([
  { id: "builtBefore", prompt: "Você já tentou criar um aplicativo?", type: "single", required: true, options: [option("Nunca tentei", "never"), option("Tentei, mas não terminei", "unfinished"), option("Já criei algo simples", "simple")] },
  { id: "objective", prompt: "O que você quer criar?", type: "single", required: true, options: [option("Aplicativo para meu negócio", "business-app"), option("Aplicativo para vender", "product"), option("Projeto pessoal", "personal"), option("Ainda não tenho uma ideia", "no-idea")] },
  { id: "start", prompt: "Quando deseja começar?", type: "single", required: true, options: [option("Agora", "now"), option("Neste mês", "month"), option("Só estou conhecendo", "researching")] },
]);
