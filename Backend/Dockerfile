FROM node:24-slim

# התקנת כלי פונט
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        fontconfig \
        fonts-dejavu \
        && rm -rf /var/lib/apt/lists/*

# יצירת משתמש אפליקציה
RUN addgroup --system appgroup && adduser --system appuser --ingroup appgroup

WORKDIR /app

# התקנת תלויות
COPY package*.json ./
RUN npm ci --omit=dev

# העתקת קבצים כולל הפונט
COPY --chown=appuser:appgroup . .

# התקנת הפונט Tinos
COPY ./font/Tinos-Regular.ttf /usr/share/fonts/truetype/
RUN fc-cache -f -v

USER appuser
EXPOSE 3000
CMD ["npm", "start"]
