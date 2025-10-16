FROM python:3.10.2

WORKDIR /app

ADD r.txt .

RUN pip install --upgrade pip && pip install -r r.txt


# Install netcat
RUN apt-get update && apt-get install -y netcat && rm -rf /var/lib/apt/lists/*

# Copy wait-for-it script
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

EXPOSE 8008

# Wait for DB and run Django
CMD ["/wait-for-it.sh", "db:3306", "--", "python", "manage.py", "runserver", "0.0.0.0:8008"]
