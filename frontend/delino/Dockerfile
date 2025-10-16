FROM node:20-alpine

WORKDIR /app

# نصب پکیج‌ها
COPY package*.json ./
RUN npm install

# کپی کل پروژه
COPY . .

# برای React dev server داخل کانتینر
ENV HOST=0.0.0.0
EXPOSE 3000

# اجرای react-scripts با host صحیح
CMD ["npm", "start", "--", "--host", "0.0.0.0"]
