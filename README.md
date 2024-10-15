# <img width="30" align="center" src="https://github.com/user-attachments/assets/fce752fa-362f-43a6-8cec-440dcf5b3528"> SongPicker

<p align="center">
  <img width="80%" src="https://github.com/user-attachments/assets/4707aad7-e073-49dd-8502-cc7c4c6d8ff8" alt="Description">
</p>


## 🌈 프로젝트 소개

### 🎈 서비스 개요
**[컨텐츠 기반 필터링 알고리즘을 활용한 노래방 선곡 추천 서비스]**

SongPicker는 노래방 이용 데이터를 바탕으로 사용자의 취향에 맞는 선곡을 추천해 주는 서비스입니다.  
개별 선곡 추천뿐만 아니라 팀을 만들어 팀의 분위기에 맞는 노래를 추천받을 수 있고, 장르별로 노래를 추천받을 수 있습니다.  
또한 QR 기능을 이용해 노래방 기기에 연동하여 쉽게 예약할 수 있고, 추천 차트 또한 노래방 기기 화면으로 볼 수 있습니다.

<br>

### 📆 진행 기간 
2024.08 - 2024.10 ( 8주 )

<br>
  
### 👨🏻‍💻 개발 인원

|         <img src="https://github.com/hyeon8571.png" width="150">          |   <img src="https://github.com/eunji04.png" width="150">   |    <img src="https://github.com/suwhan2.png" width="150">     | <img src="https://github.com/jjuy00.png" width="150">  |   <img src="https://github.com/codemj99.png" width="150">    |       <img src="https://github.com/Roh-Jinseo.png" width="150">       |
| :----------------------------------------------------------------------: | :---------------------------------------------------------: | :---------------------------------------------------------------: | :---------------------------------------------------: | :-----------------------------------------------------------: | :-----------------------------------------------------------------: |
| [원승현<br>@hyeon8571](https://github.com/hyeon8571)<br/>`BE`<br/>`Leader` | [박은지<br>@eunji04](https://github.com/eunji04)<br/>`BE` | [최수환<br>@suwhan2](https://github.com/suwhan2)<br/>`BE` | [박주영<br>@jjuy00](https://github.com/jjuy00)<br/>`FE` | [김민진<br>@codemj99](https://github.com/codemj99)<br/>`FE` | [노진서<br>@Roh-Jinseo](https://github.com/Roh-Jinseo)<br/>`FE` |

<br>

### 📌 주요기능 소개

#### 💡 고객 측면(리뷰)
- 미용, 네일, 에스테틱 등 뷰티 관련 매장 리뷰를 SNS 형식으로 직관적으로 제공
- 위치 기반 주변 매장 리뷰 검색
- 프로필 검색을 통한 매장 리뷰 및 게시글 모아보기

<details>
<summary>서비스 이미지</summary>
<div markdown="1">
  <img src="https://github.com/user-attachments/assets/2495d97e-5aef-46e7-95fa-d0efb6f2cce1" width="26%" />
  <img src="https://github.com/user-attachments/assets/ca769ee1-c9a7-4e5f-b48b-e429408b2d92" width="23.7%" />
</div>
</details>

<hr>

#### 💡 고객 측면(예약)
- 리뷰를 보고 실시간 예약 가능
- 팔로우, 즐겨찾기 기능을 통해 관심 매장 등록 후 예약 가능
- 편리한 예약 정보 관리

<details>
<summary>서비스 이미지</summary>
<div markdown="1">  
  <img src="https://github.com/user-attachments/assets/9a76a7fe-2883-472f-9b25-d33c1552e051" width="27%" />
  <img src="https://github.com/user-attachments/assets/cfc83f04-0e2a-4bb7-976f-1fa3ac2db367" width="34.3%" />
  <img src="https://github.com/user-attachments/assets/3d4a4d08-6402-49de-9523-9ccbe1070736" width="24.7%" />
</div>
</details>

<hr>

#### 💡 매장/디자이너 측면
- 디자이너 관리 및 시술 정보 관리
- 예약 시간 단위 커스텀 및 시술 시간에 따른 일정 관리
- SNS 형식의 매장 홍보글 작성 가능

<details>
<summary>서비스 이미지</summary>
<div markdown="1">  
  <img src="https://github.com/user-attachments/assets/8d4650bc-a734-40f1-b4f5-feb4526d3384" width="24.5%" />
  <img src="https://github.com/user-attachments/assets/dcfcb29a-b985-40d9-ab1d-350b3eb738cc" width="30%" />
  <img src="https://github.com/user-attachments/assets/33610f86-d02b-44dc-924c-3c69d92ad18a" width="35%" />
</div>
</details>

<hr>

#### 💡 기타
- 전화번호, 이메일 인증을 통한 고객 인증
- 사업자 등록번호 검증을 통한 매장 등록
- 프로필 전환을 통한 다양한 프로필 이용 가능

<details>
<summary>서비스 이미지</summary>
<div markdown="1">  
  <img src="https://github.com/user-attachments/assets/9e3dadbb-9ef4-4cc4-b53b-0508712f6c73" width="30%" />
  <img src="https://github.com/user-attachments/assets/294f5bf7-f038-4312-be88-2767c07fda1d" width="30%" />
</div>
</details>


<br>


## <img align="center" width="50" src="https://github.com/user-attachments/assets/471435b6-e345-414d-b6eb-2fb11de1eb8f"> 시스템 아키텍처
<p align="center">
  <img width="80%" src="https://github.com/user-attachments/assets/123c0ae6-44ea-4abe-aa29-078e3b1e2e84"> 
</p>

- **Jenkins**: CI/CD 구축
- **Nginx**: Reverse Proxy를 이용하여 클라이언트의 요청 분배
- **Redis**: 리프레시 토큰 저장 및 인증 세션 저장소

### 개발 환경

#### 🟡 Frontend
- **개발 언어**: TypeScript 5.4.2
- **빌드 툴**: Vite 5.4.5
- **프레임워크**: React 18.3.1

#### 🟢 Backend
- **개발 언어**: Java 17
- **빌드 툴**: Gradle 8.10.1
- **프레임워크**: SpringBoot 3.3.3

#### 🟣 Data
- **개발 언어**: Python 3.11.10
- **프레임워크**: Django 4.2.16

### ⚒️ 기술 스택

**프레임워크 및 라이브러리**
<div>
  <span><img src="https://img.shields.io/badge/Spring Boot-6DB33F?style=flat-square&logo=springboot&logoColor=white"/></span>
  <span><img src="https://img.shields.io/badge/Spring Security-6DB33F?style=flat-square&logo=springsecurity&logoColor=white"/></span>
  <span><img src="https://img.shields.io/badge/JWT-B041FF?style=flat-square&logo=jsonwebtokens&logoColor=white"/></span>
  <span><img src="https://img.shields.io/badge/JPA-007396?style=flat-square&logo=hibernate&logoColor=white"/></span>
  <span><img src="https://img.shields.io/badge/QueryDSL-007396?style=flat-square&logo=java&logoColor=white"/></span>
  <span><img src="https://img.shields.io/badge/Jsoup-008000?style=flat-square&logo=java&logoColor=white"/></span>
</div>
<div>
  <span><img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black"/></span>
  <span><img src="https://img.shields.io/badge/Styled--Component-DB7093?style=flat-square&logo=styled-components&logoColor=white"/></span>
</div>

<br>

**데이터베이스**
<div>
  <span><img src="https://img.shields.io/badge/mysql-4479A1.svg?style=flat-square&logo=mysql&logoColor=white"/></span>
  <span><img src="https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white"/></span>
</div>

<br>

**인프라 및 배포**
<div>
  <span><img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white"/></span>
  <span><img src="https://img.shields.io/badge/jenkins-%232C5263.svg?style=flat-square&logo=jenkins&logoColor=white"/></span>
  <span><img src="https://img.shields.io/badge/AWS EC2-FF9900?style=flat-square&logo=amazonec2&logoColor=white"/></span>
  <span><img src="https://img.shields.io/badge/Nginx-009639?style=flat-square&logo=nginx&logoColor=white"/></span>
</div>

<br>

## 🖨️ ERD
<details>
<summary>ERD 이미지</summary>
<div markdown="1">

<br>

<p align="center"><img src="https://github.com/user-attachments/assets/c951a70f-c8ea-496f-9b25-4d6ebfd74628" width="100%" /></p>

</div>
</details>

## 📊 API 명세서
<details>
<summary>API 명세서 보기</summary>
<div markdown="1">

<br>

<p align="center"><img src="https://github.com/user-attachments/assets/48bb8b2a-4486-4082-9508-c9cdedc67084" width="100%" /></p>

</div>
</details>

#### [명세서 자세히 보기](https://www.notion.so/REST-API-eb150679fab942c7a17a89bb4d4fc936)

## 📂 디렉토리 구조
<details>
<summary>디렉토리 구조 보기</summary>
<div markdown="1">
  
```
  .
├── java
│   └── com
│       └── rebu
│           ├── RebuApplication.java
│           ├── absence
│           │   ├── controller
│           │   ├── dto
│           │   ├── entity
│           │   ├── exception
│           │   ├── repository
│           │   └── service
│           ├── alarm
│           │   ├── controller
│           │   ├── dto
│           │   ├── entity
│           │   ├── enums
│           │   ├── exception
│           │   ├── repository
│           │   └── service
│           ├── auth
│           │   ├── config
│           │   ├── controller
│           │   ├── dto
│           │   ├── enums
│           │   ├── exception
│           │   ├── sevice
│           │   └── validation
│           ├── comment
│           │   ├── controller
│           │   ├── dto
│           │   ├── entity
│           │   ├── exception
│           │   ├── repository
│           │   ├── service
│           │   └── validation
│           ├── common
│           │   ├── aop
│           │   ├── config
│           │   ├── controller
│           │   ├── exception
│           │   ├── service
│           │   ├── util
│           │   └── validation
│           ├── feed
│           │   ├── config
│           │   ├── controller
│           │   ├── dto
│           │   ├── entity
│           │   ├── exception
│           │   ├── repository
│           │   ├── review
│           │   ├── service
│           │   └── validation
│           ├── follow
│           │   ├── controller
│           │   ├── dto
│           │   ├── entity
│           │   ├── exception
│           │   ├── repository
│           │   └── service
│           ├── like
│           │   ├── controller
│           │   ├── dto
│           │   ├── entity
│           │   ├── exception
│           │   ├── repository
│           │   └── service
│           ├── member
│           │   ├── controller
│           │   ├── dto
│           │   ├── entity
│           │   ├── enums
│           │   ├── exception
│           │   ├── repository
│           │   ├── service
│           │   └── validation
│           ├── menu
│           │   ├── controller
│           │   ├── dto
│           │   ├── entity
│           │   ├── exception
│           │   ├── repositoy
│           │   ├── service
│           │   └── validation
│           ├── profile
│           │   ├── controller
│           │   ├── dto
│           │   ├── employee
│           │   ├── entity
│           │   ├── enums
│           │   ├── exception
│           │   ├── repository
│           │   ├── service
│           │   ├── shop
│           │   └── validation
│           ├── reservation
│           │   ├── controller
│           │   ├── dto
│           │   ├── entity
│           │   ├── exception
│           │   ├── repository
│           │   ├── service
│           │   └── validation
│           ├── reviewkeyword
│           │   ├── controller
│           │   ├── dto
│           │   ├── entity
│           │   ├── exception
│           │   ├── repository
│           │   └── service
│           ├── scrap
│           │   ├── controller
│           │   ├── dto
│           │   ├── entity
│           │   ├── exception
│           │   ├── repository
│           │   └── service
│           ├── security
│           │   ├── config
│           │   ├── controller
│           │   ├── dto
│           │   ├── entity
│           │   ├── exception
│           │   ├── filter
│           │   ├── service
│           │   └── util
│           ├── shop_favorite
│           │   ├── controller
│           │   ├── dto
│           │   ├── entity
│           │   ├── exception
│           │   ├── repository
│           │   └── service
│           ├── storage
│           │   ├── exception
│           │   └── service
│           └── workingInfo
│               ├── controller
│               ├── dto
│               ├── entity
│               ├── enums
│               ├── exception
│               ├── repository
│               ├── service
│               └── validation
└── resources
    ├── application-secret.yml
    ├── application.yml
    ├── data.sql
    └── email
        └── form
            ├── changePassword.html
            └── signup.html
```

</div>
</details>

