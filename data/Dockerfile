# 사용할 베이스 이미지 설정
FROM python:3.11-slim

# 작업 디렉토리 생성 및 설정
WORKDIR /app

# 별도로 필요한 추가 패키지 설치
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    gcc \
    libmariadb-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# requirements.txt 복사 및 패키지 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 전체 애플리케이션 코드 복사
COPY . .

# Django 서버 실행을 위한 환경 변수 설정
ENV PYTHONUNBUFFERED 1

# 데이터베이스 마이그레이션 실행 (필요시)
RUN python manage.py migrate

# 포트 노출
EXPOSE 8000

# 애플리케이션 실행
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
