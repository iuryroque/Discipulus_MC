FROM eclipse-temurin:21-jdk-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar o arquivo JAR do projeto
COPY target/*.war app.war

# Expor a porta 8080
EXPOSE 8080

# Comando para executar a aplicação
ENTRYPOINT ["java", "-jar", "app.war"] 