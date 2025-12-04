# Node.js API Gateway - Job Portal System

REST API Gateway viết bằng Node.js sử dụng Sequelize ORM kết nối với MySQL cho hệ thống Job Portal.

## 📋 Cấu trúc dự án

```
node-api-gateway/
├── config/
│   └── database.js                  # Cấu hình kết nối MySQL
├── models/
│   ├── index.js                     # Models index và associations
│   ├── User.js                      # Model User
│   ├── Candidate.js                 # Model Candidate
│   ├── Employer.js                  # Model Employer
│   ├── HRProfile.js                 # Model HR Profile
│   ├── Job.js                       # Model Job
│   ├── Application.js               # Model Application
│   ├── JobTag.js                    # Model Job Tag
│   ├── CandidateSkill.js            # Model Candidate Skill
│   ├── CandidateExperience.js       # Model Candidate Experience
│   ├── CandidateEducation.js        # Model Candidate Education
│   ├── InterviewSchedule.js         # Model Interview Schedule
│   ├── SavedJob.js                  # Model Saved Job
│   ├── JobAlert.js                  # Model Job Alert
│   ├── Notification.js              # Model Notification
│   ├── Message.js                   # Model Message
│   ├── ApplicationNote.js           # Model Application Note
│   └── EmployerReview.js            # Model Employer Review
├── routes/
│   ├── users.js                     # API routes cho User
│   └── jobs.js                      # API routes cho Job
├── server.js                        # File chính
├── package.json                     # Dependencies
├── .env                             # Biến môi trường
├── .gitignore                       # Git ignore
├── Dockerfile                       # Docker configuration
├── start.sh                         # Script khởi động
└── README.md                        # Tài liệu này
```

## 🚀 Cài đặt nhanh

### 1. Cài đặt dependencies

```bash
cd /workspaces/deepapp_micro_services/services/node-api-gateway
npm install
```

### 2. Khởi động MySQL với Docker (tùy chọn)

Từ thư mục `/workspaces/deepapp_micro_services/docker/php_admin_mysql/`:

```bash
docker-compose up -d
```

**MySQL Connection Details:**
- Host: localhost (hoặc mysql từ Docker)
- Port: 3306
- Database: cxldb
- User: cxluser
- Password: dbpassword

### 3. Chạy Server

**Development mode (với nodemon):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

**Hoặc dùng script:**
```bash
bash start.sh
```

## 🌐 API Endpoints

### Base URL
```
http://localhost:3000
```

### Health Check
- **GET** `/health` - Kiểm tra trạng thái API

### Users API

#### Get all users
```
GET /api/users
```

Response:
```json
{
  "success": true,
  "data": [...],
  "count": 5
}
```

#### Get user by ID
```
GET /api/users/:id
```

#### Create user
```
POST /api/users
Content-Type: application/json

{
  "email": "user@example.com",
  "password_hash": "hashed_password",
  "user_type": "candidate",
  "full_name": "John Doe",
  "phone": "0123456789",
  "avatar_url": "https://..."
}
```

#### Update user
```
PUT /api/users/:id
Content-Type: application/json

{
  "full_name": "Jane Doe",
  "phone": "0987654321",
  "is_verified": true
}
```

#### Delete user
```
DELETE /api/users/:id
```

### Jobs API

#### Get all jobs (với filter)
```
GET /api/jobs?status=active&category=Engineering&location=Ho Chi Minh City
```

#### Get job by ID
```
GET /api/jobs/:id
```

#### Create job
```
POST /api/jobs
Content-Type: application/json

{
  "slug": "senior-developer-2024",
  "title": "Senior Developer",
  "employer_id": 1,
  "location": "Ho Chi Minh City",
  "job_type": "full-time",
  "category": "Engineering",
  "salary_min": 15000000,
  "salary_max": 25000000,
  "excerpt": "Looking for experienced developer",
  "description": "...",
  "requirements": ["JavaScript", "React", "Node.js"],
  "benefits": ["Health Insurance", "Bonus"],
  "tags": ["remote-friendly", "fast-growing"]
}
```

#### Update job
```
PUT /api/jobs/:id
Content-Type: application/json

{
  "title": "Senior Developer (Updated)",
  "status": "active"
}
```

#### Delete job
```
DELETE /api/jobs/:id
```

## 📊 Database Schema (Auto-created by Sequelize)

### Users Table
```sql
- id (PK)
- email (UNIQUE)
- password_hash
- user_type (candidate, hr, admin)
- full_name
- phone
- avatar_url
- is_verified
- is_active
- last_login_at
- created_at, updated_at
```

### Jobs Table
```sql
- id (PK)
- slug (UNIQUE)
- title
- employer_id (FK)
- location
- job_type
- category
- salary_min, salary_max
- description
- requirements (JSON)
- benefits (JSON)
- status (draft, active, closed, paused)
- view_count
- application_count
- created_at, updated_at
```

### Candidates Table
```sql
- id (PK)
- user_id (FK, UNIQUE)
- title
- location
- experience_years
- resume_url, portfolio_url
- linkedin_url, github_url
- bio
- salary_expectation_min, salary_expectation_max
- preferred_job_type
- available_from
- created_at, updated_at
```

### Applications Table
```sql
- id (PK)
- job_id (FK)
- candidate_id (FK)
- status
- cover_letter
- resume_url
- expected_salary
- available_from
- current_step
- applied_at, updated_at
```

*Và nhiều bảng khác cho Skills, Experience, Education, Interviews, Messages, etc.*

## 🔧 Cấu hình Environment

File `.env`:
```
NODE_ENV=development
PORT=3000
DB_HOST=localhost      # hoặc "mysql" khi dùng Docker
DB_PORT=3306
DB_NAME=cxldb
DB_USER=cxluser
DB_PASSWORD=dbpassword
DB_DIALECT=mysql
```

## 🧪 Testing API

### Với curl:

```bash
# Health check
curl http://localhost:3000/health

# Get all users
curl http://localhost:3000/api/users

# Create user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email":"user@example.com",
    "password_hash":"pass",
    "user_type":"candidate",
    "full_name":"John"
  }'

# Get all jobs
curl http://localhost:3000/api/jobs

# Get active jobs in specific location
curl "http://localhost:3000/api/jobs?status=active&location=Ho%20Chi%20Minh%20City"
```

### Với Postman:
1. Import API endpoints từ documentation
2. Set variables cho host và port
3. Test các endpoints

## 🐳 Docker Support

### Build Docker image:
```bash
docker build -t node-api-gateway .
```

### Run với docker-compose:
```bash
cd docker/php_admin_mysql
docker-compose up -d
```

Điều này sẽ khởi động:
- MySQL: `localhost:3306`
- PhpMyAdmin: `http://localhost:8080`
- Node API Gateway: `http://localhost:3000`

## 📦 Dependencies

- **express** - Web framework
- **mysql2** - MySQL driver
- **sequelize** - ORM
- **dotenv** - Environment variables
- **cors** - Cross-Origin Resource Sharing
- **body-parser** - Request body parsing
- **nodemon** (dev) - Auto-restart

## ⚠️ Troubleshooting

### Error: "getaddrinfo ENOTFOUND mysql"
**Nguyên nhân:** MySQL không chạy
**Giải pháp:**
```bash
# Kiểm tra MySQL
mysql -h localhost -u cxluser -p

# Hoặc dùng Docker
cd docker/php_admin_mysql
docker-compose up -d
```

### Error: "EADDRINUSE: address already in use :::3000"
**Nguyên nhân:** Port 3000 đã bị sử dụng
**Giải pháp:**
```bash
# Kill process trên port 3000
lsof -i :3000 | grep -i node | awk '{print $2}' | xargs kill -9

# Hoặc thay đổi port trong .env
PORT=3001
```

### Database tables không được tạo
**Giải pháp:**
- Chắc chắn database `cxldb` tồn tại
- Kiểm tra user `cxluser` có quyền create table
- Chạy: `sequelize.sync({ alter: true })` trong server.js (development only)

## 📝 Notes

- API tự động khởi động ngay cả khi MySQL không chạy (warning mode)
- Database schema được tự động sync khi server khởi động
- Tất cả responses đều có format JSON với structure `{ success, data, error }`
- Các timestamps tự động được quản lý (created_at, updated_at)

## 📞 Support

Nếu gặp vấn đề, kiểm tra:
1. Terminal logs cho error messages
2. MySQL connection status
3. File .env configuration
4. Network connectivity

---

**Ready to use!** 🎉

