FROM node:20
RUN addgroup --system appgroup && adduser --system appuser --ingroup appgroup
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY --chown=appuser:appgroup . .
USER appuser
EXPOSE 3000
CMD ["npm", "start"]