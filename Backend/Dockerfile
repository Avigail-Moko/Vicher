FROM node:24-slim
RUN addgroup --system appgroup && adduser --system appuser --ingroup appgroup
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --chown=appuser:appgroup . .
USER appuser
EXPOSE 3000
CMD ["npm", "start"]