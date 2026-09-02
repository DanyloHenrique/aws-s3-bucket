## Description

Projeto criado para testar o armazenamento de objetos no serviço S3 da AWS via Backend/AWS-SDK

Foi desenvolvido um módulo `s3-bucket` para disponibilizar as funcionalidades de upload de arquivos, a busca e o apagamento via Key. Para utilização da ferramenta **AWS-SDK**, foi adotada uma configuração via `ConfigService`, trazendo as credenciais via `env` em vez de hardcoded. Além disso, a chave de cada objeto é gerada de forma única (uuid), evitando colisão e sobrescrita de arquivos no bucket.

Para o upload de arquivos, foi usado no controller o `FileInterceptor` responsável por interceptar a requisição, extrair o arquivo e colocá-lo em `req.file`. Além disso, foi utilizado o pipe `ParseFilePipe` responsável por fazer a validação do tipo e tamanho do arquivo.

Para garantir que todas as variáveis de ambiente necessárias estejam presentes e no formato correto, foi utilizado o **Zod** na validação do `env`. Isso faz com que a aplicação falhe de forma clara e imediata na inicialização caso alguma variável esteja ausente ou mal formatada, em vez de gerar erros inesperados durante a execução.

## Stack do projeto

- NestJS
- AWS-SDK
- Vitest
- Multer
- Zod

## Endpoints disponíveis

POST   /s3-aws/       → envia um arquivo (multipart/form-data, campo "file")

GET    /s3-aws/:key  → busca um arquivo pela key

DELETE /s3-aws/:key  → remove um arquivo pela key

## Project setup

1. Clone o repositório e instale as dependências:

```bash
pnpm install
```

2. Copie o arquivo de exemplo de variáveis de ambiente:
```bash
cp .env.example .env
```

3. Crie um bucket S3 na sua conta AWS (ou use um já existente) e preencha o `.env` com suas credenciais:

   - `AWS_REGION`: região onde o bucket foi criado (ex: `us-east-1`)
   - `AWS_ACCESS_KEY_ID` e `AWS_SECRET_ACCESS_KEY`: credenciais de um usuário/role IAM com permissão de leitura/escrita no bucket (`s3:PutObject`, `s3:GetObject`, `s3:DeleteObject`)
   - `AWS_S3_BUCKET_NAME`: nome do bucket criado
   - `AWS_SESSION_TOKEN`: necessário apenas se estiver usando credenciais temporárias (ex: SSO, roles assumidas). Se estiver usando um usuário IAM comum com chaves permanentes, essa variável pode ficar vazia

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev
```

## Run tests

```bash
# e2e tests
$ pnpm run test:e2e
```
