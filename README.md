 <div align=center>
<h1> The App
</div>

## Este projeto foi criado com foco no Deploy usando uma distribuição Linux. A Distro usada foi Kubuntu 20.04LTS; assim usamos a aplicação React padrão encontrada no [site oficial](https://create-react-app.dev/docs/getting-started). Este é um passo a passo de como construir uma aplicação em React com uso do Docker e NGINX.

## Primeiro vamos executar em 3 passos este repositório. Depois você poderá criar seus próprios apps e builds a partir do tópico "Construindo o APP".
 
### Para ver este repositório rodando:
- Clique no botão "Code" àcima na direita e copie a URL da opção HTTPS.

- Dentro de uma pasta no seu computador, destinada a este projeto, abra o terminal e digite:
```text
 git clone <cole aqui a URL copiada>
 ```
 
 - Agora no terminal instale o node_modules com:
```text
 npm install
```
 
 - Enfim, dê o comando no terminal:
```text
 docker-compose -f docker-compose.yml up -d --build
 ```
 
 Pronto, a imagem já foi construída e já está rodando em localhost:8080.
 
 Para parar o build, pressione Ctrl+C
 
 ## Agora você pode construir seu próprio APP
 
### Construindo o App
  Acesse seu terminal e com:
  ```text
  ctrl+Alt+t
  ```
  Execute os seguintes comendos em ordem:
  ```text
  $ mkdir myapp   // isso cria um diretório onde você criará seu app
  $ cd myapp      // com isso você entra no seu diretório myapp
  $ code .        // com isso você abre o VS Code dentro do diretório myapp
  ```  
  Acesse o site:
  ```text
  https://create-react-app.dev/docs/getting-started
  ```
  No VS Code execute um novo Terminal e os seguintes comandos que criarão o app em React:
  ```text
  $ npx create-react-app my-app
  $ cd my-app
  $ npm start
  ```
  Após o NPM terminar o app já estará rodando em localhost na porta 3000, se quiser conferir acesse no navegador:
  ```text
  localhost:3000
  ```
  Você observará uma imagem semelhante a esta:
<div align=center>
  <img src="https://miro.medium.com/max/700/1*5x6c_J1CuGYvfE-oF45nZg.png" />
</div>

Para parar o comando digite:
  ctrl+d
  
  
### Construindo a imagem Docker
  
Para construir a imagem Docker vamos precisar de um arquivo chamado Dockerfile. Para entender o que é o Dockerfile você pode imaginar isso como a receita do bolo com o passo a passo para o bolo se fazer sozinho em apenas 1 comando! Incrível, não é?

Crie o Dockerfile digitando o seguinte comando no terminal:
```text
$ touch Dockerfile
  ```
  Dentro do Dockerfile coloque o seguinte:
```text
  # Imagem de Origem
FROM node:16.13.0-alpine

  # Diretório de trabalho(é onde a aplicação ficará dentro do container).
WORKDIR /code

  # Instalando dependências da aplicação e armazenando em cache
COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install 

COPY . .

  # Inicializa a aplicação
CMD ["npm","run","start"] 
  ```
  
Agora podemos fazer o build da imagem em ambiente de desenvolvimento. 
  Os comandos que usaremos serão 
  ```text 
  $ Docker build --rm -t <nome da imagem:versão> .
  // "nome da imagem:versão" poderá ser o nome que quiser, usaremos mais tarde ao rodar o container e também no docker-compose.yml.
  // em nome da versão eu usei = react-docker:1.0.0-dev
  ```
  *Atenção: o " . " faz parte do comando!*
  
  Onde: 
  <br>
  " Docker build . " é o comando do Docker para construir uma imagem. Os parâmetros adicionais que passamos aqui foram:
  <br>  " --rm" Isto significa que estamos pedindo para remover qualquer imagem mais antiga com o mesmo nome.
  <br>  " -t" onde 't' significa "tag" e é a flag que usamos para dar um nome à nossa imagem. 
  
  Assim que o comando acima finalizar a construção da imagem, vamos criar o container a partir dela:
  ```text
$ docker run --rm -it --name web -p 3000:3000 -v "$PDW":/code react-docker:1.0.0-dev
  ```

  Se tudo foi bem até aqui, após o build a saída será parecida com esta:
  ```text
> react-docker-app@0.1.0 start /code
> react-scripts start

ℹ ｢wds｣: Project is running at http://172.17.0.2/
ℹ ｢wds｣: webpack output is served from /
ℹ ｢wds｣: Content not from webpack is served from /app/public
ℹ ｢wds｣: 404s will fallback to /index.html
Starting the development server…

Compiled successfully!

You can now view react-docker-app in the browser.

Local: http://localhost:3000/
On Your Network: http://172.17.0.2:3000/

Note that the development build is not optimized.
To create a production build, use yarn build.
```
  
 Veja que na mensagem acima, é informado que Your Network é o endereço: http://172.17.0.1:3000 , porém é importante lembrar que este é o endereço interno do container. Toda vez que um container é levantando, o Docker atribui a ele um IP, ele cria uma rede interna padrão, chamada bridge (ponte), pois é a rede que permite a comunicação interna entre os containers. A porta que foi exportada para a máquina local foi a 3001 pelo parâmentro -p. Portanto para acessar a aplicação faz-se da seguinte maneira:
  ```text
  localhost:3001
  ```
  
  
## O que está acontecendo até aqui?
1 - O comando docker run criou a instância de um novo container a partir de uma imagem que foi criada através de um arquivo Dockerfile.

2 - -v $"PWD":/code monta/leva/move o código para dentro do container no diretório “/code”.
OBS: "PWD", pode não funcionar no windows.

3 - O objetivo é utilizar o diretório node_modules/ de dentro do container, por isso foi criado um segundo volume: -v /app/node_modules . Agora é possível remover o diretório local node_modules/ do diretório do seu projeto local.

4 - -p 3001:3000 expõe a porta 3000 a outros containers do docker na mesma rede(para comunicação entre containers) e porta 3001 ao host.
Para mais informações veja esta tread no Stackoverflow.

5 - Por fim, --rm remove o container e os volumes, depois que o container for finalizado.
 
 
# Docker-compose
  
## Vamos realizar a execução do container, mas agora usando um arquivo de receita do Docker, o docker-compose.yml. Crie e adicione este arquivo na raíz do projeto.
  ```text
version: '3.7'
services:
  app-prod:
    container_name: react-docker
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - '8080:80'
  ```
  
Crie a imagem e ative o container:
  ```text
  docker-compose up -d --build
  ```
Para parar pressione Ctrl+d
  
  
## Produção com Docker-compose + React Router e NGINX
  
Antes de alterarmos o Dockerfile para receber os parâmetros de produção, precisamos configurar o Nginx-conf. Para isso, crie a seguinte estrutura no diretório raiz myapp:
  ```md
  └── nginx
    └── nginx.conf
  ```
  No arquivo nginx.conf escreva:
  ```text
server {
listen 80;
location / {
    root   /usr/share/nginx/html;
    index  index.html index.htm;
    try_files $uri $uri/ /index.html;
  }
error_page   500 502 503 504  /50x.html;

location = /50x.html {
    root   /usr/share/nginx/html;
  }
  
}
  ```  
  
Agora que as imagens e o docker-compose de desenvolvimento estão funcionando, é hora de criar as mesmas estruturas, preparadas para a produção.
Você editará o arquivo Dockerfile e ele se tornará Multi-Stage-Builds.
O Dockerfile deve ser:
  ```text
FROM node:16.13.0-alpine as build

WORKDIR /code

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm ci --production 

COPY . .

RUN npm run build

FROM nginx:1.20.2-alpine as prod

COPY --from=build /code/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx","-g","daemon off;"]
  ```
Acima, foi usado o padrão de construção em multi-estágios ou multistage build, para criar uma imagem temporária usada para armazenar um artefato — os arquivos estáticos do React, prontos para a produção — este são copiados para a imagem de produção. Em seguinda a Imagem de construção temporária é descartada junto com os arquivos e pastas originais, associados a ela. Isso produz uma imagem enxuta, pronta para a produção.

No docker-compose Expusemos a porta 8080 para o conteiner, assim não usamos a porta padrão do React. Do Dockerfile Expusemos a porta 80 para o NGINX, agora vamos rodar nosso App no conteiner em produção:
  ```text
    docker-compose -f docker-compose.yml up -d --build
  ```
Para ver se o conteiner subiu, abra um terminal e digite:
  ```text
  $ docker ps
  ```
Para acessar o conteiner pela URL digite:
  ```text
  localhost:8080
  ```
 </div>
 
 ### Dúvidas? Me encontre pelos canais: 
 <div align=center> 
  <a href="https://instagram.com/dadososfatos/" target="_blank"><img src="https://img.shields.io/badge/-Instagram-%23E4405F?style=for-the-badge&logo=instagram&logoColor=white" target="_blank"></a>
  <a href = "mailto: sara27082011@gmail.com"><img src="https://img.shields.io/badge/-Gmail-%23333?style=for-the-badge&logo=gmail&logoColor=white" target="_blank"></a>
  <a href="https://www.linkedin.com/in/saractavares" target="_blank"><img src="https://img.shields.io/badge/-LinkedIn-%230077B5?style=for-the-badge&logo=linkedin&logoColor=white" target="_blank"></a>
  <a href="https://portifolio.sara2708.repl.co/" target="_blank"><img src="https://img.shields.io/badge/-Portifolio-%d31717?style=for-the-badge&logo=portifolio&logoColor=<d31717>" target="_blank"></a>
</div>
  
