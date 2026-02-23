<div align="center">
  <div align="center">
      <!-- Mockup Image -->
  </div>

  <h1 align="center">Ledgerly Legacy (v1)</h1>

  <p align="center">
   <b>This branch contains Ledgerly v1, the original implementation of a personal finance tracker.
It is preserved for reference and historical purposes. All new development should happen on the main branch (Ledgerly V2).</b>
  </p>

<h6>⚠️ LEGACY CODE! ⚠️</h6>
</div>


## 🔹 About
**Ledgerly** is a full-stack personal finance tracker. I built it to get my hands dirty with the entire lifecycle of a web application. While finance trackers are a classic project, my goal wasn't to disrupt an industry, it was to master the stack. I wanted a system where I owned every line of code, from the database schema to the security protocols.

### 🧰 The Techstack
- **The Backend (Spring Boot):** I chose Spring Boot to understand how enterprise-grade APIs are structured. I implemented JWT-based authentication to handle security properly and followed a strict service-oriented architecture to keep the business logic separated from the API endpoints.
  
- **The Frontend (React):** _Not yet implemented_

- **Data Reliability (PostgreSQL):** I didn't want to just "store" data; I wanted to enforce it. I used a relational model to handle the complex links between wallets and transactions, ensuring that if a category changes or a wallet is closed, the math still adds up.

## 💻 Development Setup
<details>

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

## 🏦 License

Distributed under the Apache-2.0 license. See [`LICENSE.txt`](https://github.com/thrddqno/ledgerly-app/?tab=Apache-2.0-1-ov-file) for more information.

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



