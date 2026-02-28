<div align="center">
  <div align="center">
      <!-- Mockup Image -->
  </div>
  <h1 align="center">Ledgerly: Personal Finance Tracker</h1>

  <p align="center">
   <b>A full-stack personal finance tracker as part of my learner's project series.</b>
  </p>

  <p align="center">
  <a href="https://spring.io/projects/spring-boot">
    <img src="https://img.shields.io/badge/backend-springboot-brightgreen?logo=springboot"
         alt="springboot">
  </a>
  <a href="https://spring.io/projects/spring-boot">
    <img src="https://img.shields.io/badge/frontend-react_with_vite-purple?logo=vite"
         alt="springboot">
  </a>
  <a href="https://www.linkedin.com/in/thrddqno/">
    <img src="https://img.shields.io/badge/connect-LinkedIn-blue">
  </a>
</p>
  <h4>
    <a href="#-about">About</a>
    •
    <a href="#-live-demo">Demo</a>
    •
    <a href="#️-roadmap">Roadmap</a>
    •
    <a href="#-license">License</a>
</h4>

<h6>🚧 Work in Progress (WIP)</h6>
</div>

## 🔹 About

**Ledgerly** is a full-stack personal finance tracker. I built it to get my hands dirty with the entire lifecycle of a
web application. While finance trackers are a classic project, my goal wasn't to disrupt an industry, it was to master
the stack. I wanted a system where I owned every line of code, from the database schema to the security protocols.

### 🧰 The Techstack

- **The Backend (Spring Boot):** I chose Spring Boot to understand how enterprise-grade APIs are structured. I
  implemented JWT-based authentication to handle security properly and followed a strict service-oriented architecture
  to keep the business logic separated from the API endpoints.

- **The Frontend (React):** _Not yet implemented_

- **Data Reliability (PostgreSQL):** I didn't want to just "store" data; I wanted to enforce it. I used a relational
  model to handle the complex links between wallets and transactions, ensuring that if a category changes or a wallet is
  closed, the math still adds up.

## 🔴 Live Demo

Check out the live demo on this site: _🚧 Work in Progress (WIP)_

## 💻 Development Setup

<details>

<details>
<summary>Running using <code>docker-compose.yml</code></summary>

### Prerequisites
- Install [Docker](https://www.docker.com/get-started) (Engine + Compose)
- Install Git

#### 1. Clone the repository


```bash
git clone https://github.com/thrddqno/ledgerly-app.git

cd ledgerly-app
```

#### 2. Configure `docker-compose.yml`

Here is what you should change in the `docker-compose.yml`

**2.1 DB Service**

```yaml
  db:
    image: postgres:latest
    container_name: ledgerly-db
    environment:
      POSTGRES_USER: #SET USERNAME HERE
      POSTGRES_PASSWORD: #SET PASSWORD HERE
      POSTGRES_DB: ledgerly
    ports:
      - "5432:5432"
    volumes:
      - db-data:/var/lib/postgresql/
```

**2.2 Backend Service**

```YAML
  backend:
    build:
      context: ./ledgerly-api
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/ledgerly
      - SPRING_DATASOURCE_USERNAME= # POSTGRES USERNAME
      - SPRING_DATASOURCE_PASSWORD= # POSTGRES PASSWORD
      - JWT_SECRET_KEY="" # INSERT A BASE64 256-BIT RANDOM GENERATED KEY HERE
```

_front-end services not yet implemented, test using postman and find endpoints using swagger_

### 3. Start services

```bash
docker compose up -d
```

### 4. Verify containers
Should list 'backend' and 'db' containers running
```bash
docker ps
```

### 5. View logs

```bash
docker compose logs -f backend

docker compose logs -f db
```

### 6. Stop services
Stops and removes containers, networks, but volumes remain

```json
docker compose down
```
___

</details>


<details>
<summary>Running using <code>mvnw</code></summary>

### Prerequisites

Before running the code, ensure the machine has these global dependencies installed:

- **Java Development Kit (JDK) 21+:** Required to run the Spring Boot backend.
- **Node.js & npm:** Required to build and run the React frontend.
- **PostgreSQL:** The database engine. Ensure it's running and you have a database named ledgerly created.

### Backend Setup

**1. Clone the Repository:**

```bash
git clone https://github.com/thrddqno/ledgerly-app.git

cd ledgerly-app
```

**2. Configure Environment Variables:**
application-dev.yaml

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/ledgerly
    username: your_username
    password: your_password
```

**3. Run the Application:** Use the Maven wrapper included in your project (no need to install Maven globally)

Windows:

```bash
.\mvnw.cmd spring-boot:run
```

Unix and Linux

```bash
./mvnw spring-boot:run
```

### Frontend Setup (React)

**1. Navigate to the Frontend Directory:**

```bash
cd legerly-web
```

**2. Install Dependencies:**

```bash
npm install
```

**3. Launch the App:**

```bash
npm start
```
</details>
</details>

## 🗺️ Roadmap

_Roadmap may change according to alignment_
<!-- Add Roadmap -->

### Phase 1 - Core Stability

- [x] User authentication and JWT-based authorization
- [x] Wallet, transaction, category domains
- [x] Merge and delete for categories
- [x] Wallet-to-wallet transactions
- [x] Consistent API error responses and validation messages
- [x] Keyset Pagination and filtering for transaction queries
- [x] Refresh Tokens
- [x] Set HttpOnly cookie for JWT readying for front-end impl

### Phase 2 - UI & UX
- [ ] Design UI using [Figma](https://www.figma.com/proto/wp8dR6lr0DHMHQpFpndSlr/Ledgerly-App?node-id=2-2&t=YqoDwgmjpVDJX7No-1)
- **Front-end implementation**
  - [ ] Build the React frontend to fully consume the backend APIs.
  - [ ] Responsive UI for desktop and mobile.
  - [ ] Form validations and user-friendly error handling.
  - [ ] Theme selection (light/dark mode).
- **Reporting & Analytics**
  - [ ] Dashboard for transaction summaries, charts, and trends. 
  - [ ] Monthly/weekly summaries by category or wallet. 
  - [ ] Export reports as CSV or PDF.
- **User Settings & Personalization**
  - [ ] Profile management (name, email, password change) _means i will have token invalidation thingy idk_

## 🏦 License

Distributed under the Apache-2.0 license. See [
`LICENSE.txt`](https://github.com/thrddqno/ledgerly-app/?tab=Apache-2.0-1-ov-file) for more information.

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[forks-shield]: https://img.shields.io/github/forks/thrddqno/ledgerly-app.svg?style=for-the-badge

[forks-url]: https://github.com/thrddqno/ledgerly-app/network/members

[stars-shield]: https://img.shields.io/github/stars/thrddqno/ledgerly-app.svg?style=for-the-badge

[stars-url]: https://github.com/thrddqno/ledgerly-app/stargazers

[issues-shield]: https://img.shields.io/github/issues/thrddqno/ledgerly-app.svg?style=for-the-badge

[issues-url]: https://github.com/thrddqno/ledgerly-app/issues

[license-shield]: https://img.shields.io/github/license/thrddqno/ledgerly-app.svg?style=for-the-badge

[license-url]: https://github.com/thrddqno/ledgerly-app/blob/main/LICENSE.txt

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555

[linkedin-url]: https://linkedin.com/in/thrddqno


