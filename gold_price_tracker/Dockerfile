FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY gold_tracker.py config.json ./

CMD ["python", "gold_tracker.py"] 