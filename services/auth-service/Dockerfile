# services/auth-service/Dockerfile

FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm install
# Only generate Prisma client here
RUN npx prisma generate

# Do NOT do migrate deploy here ❌
# RUN npx prisma migrate deploy

# Make entrypoint executable
RUN chmod +x ./entrypoint.sh

EXPOSE 4001

CMD ["sh", "./entrypoint.sh"]
