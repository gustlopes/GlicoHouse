# Microservices_java
Visão geral do projeto (resumo)

Stack: Java + Spring Boot (microservices) com Config Server, Service Discovery (Eureka) e API Gateway.
Módulos (pastas principais):

config-service: centraliza configurações dos serviços (application.yml externos, perfis). 
GitHub

discovery-service: registro/descoberta de serviços (Eureka). 
GitHub

gateway-service / gateway_service: roteamento/edge (Spring Cloud Gateway). 
GitHub

currency-service: conversão de moedas; endpoint típico: /currency/{value}/{source}/{target} (vimos você usar isso nas mensagens).

product-service: catálogo/produto; integra com currency-service (ex.: /product/{idProduct}/{targetCurrency}).

greeting-service / saudacao-service: exemplos de “hello/saudação”.

auth-service, order-service: auth e pedidos (esqueleto/integração). 
GitHub

Como tudo conversa (fluxo típico):

discovery-service (Eureka) sobe primeiro.

config-service fornece configs compartilhadas.

Serviços de domínio (currency, product, greeting, etc.) registram no Eureka e consomem configs.

gateway-service expõe uma única porta pública, roteando para os serviços por nome lógico (descoberto via Eureka).

Como rodar (sequência sugerida)

Java 21+ (ou a versão que você estiver usando).

Em cada módulo: mvn clean install.

Subir na ordem: discovery-service → config-service → demais serviços → gateway-service.

Testar rotas via Gateway (ex.: /product/..., /currency/...).
