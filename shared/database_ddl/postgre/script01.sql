-- =====================================================
-- DATABASE SCHEMA: JOB PORTAL SYSTEM
-- =====================================================

-- Bảng Users - Quản lý tất cả người dùng trong hệ thống
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('candidate', 'hr', 'admin')),
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP
);

-- Bảng Candidates - Thông tin chi tiết ứng viên
CREATE TABLE candidates (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255), -- Frontend Developer, UI/UX Designer, etc.
    location VARCHAR(255),
    experience_years INTEGER,
    resume_url VARCHAR(500),
    portfolio_url VARCHAR(500),
    linkedin_url VARCHAR(500),
    github_url VARCHAR(500),
    bio TEXT,
    salary_expectation_min INTEGER, -- VND
    salary_expectation_max INTEGER, -- VND
    preferred_job_type VARCHAR(20) CHECK (preferred_job_type IN ('full-time', 'part-time', 'remote', 'contract', 'internship')),
    available_from DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Candidate Skills - Kỹ năng của ứng viên
CREATE TABLE candidate_skills (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    proficiency_level VARCHAR(20) CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    years_of_experience INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Candidate Experience - Kinh nghiệm làm việc
CREATE TABLE candidate_experience (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE, -- NULL nếu đang làm việc
    description TEXT,
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Candidate Education - Học vấn
CREATE TABLE candidate_education (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
    institution VARCHAR(255) NOT NULL,
    degree VARCHAR(100) NOT NULL, -- Bachelor, Master, PhD, etc.
    field_of_study VARCHAR(255),
    start_date DATE,
    end_date DATE,
    gpa DECIMAL(3,2),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Employers/Companies - Thông tin công ty
CREATE TABLE employers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo_url VARCHAR(500),
    website VARCHAR(500),
    location VARCHAR(255),
    industry VARCHAR(100),
    company_size VARCHAR(50), -- "10-50 employees", "50-200 employees", etc.
    about TEXT,
    founded_year INTEGER,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng HR - Thông tin HR/Recruiter
CREATE TABLE hr_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    employer_id INTEGER REFERENCES employers(id) ON DELETE SET NULL,
    position VARCHAR(255), -- HR Manager, Recruiter, etc.
    department VARCHAR(100),
    is_primary_contact BOOLEAN DEFAULT FALSE, -- HR chính của công ty
    can_post_jobs BOOLEAN DEFAULT TRUE,
    can_review_applications BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Jobs - Tin tuyển dụng
CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    employer_id INTEGER REFERENCES employers(id) ON DELETE CASCADE,
    posted_by INTEGER REFERENCES hr_profiles(id) ON DELETE SET NULL, -- HR đăng tin
    location VARCHAR(255),
    job_type VARCHAR(20) CHECK (job_type IN ('full-time', 'part-time', 'remote', 'contract', 'internship')),
    category VARCHAR(100), -- Engineering, Design, Product, etc.
    salary_min INTEGER,
    salary_max INTEGER,
    salary_currency VARCHAR(10) DEFAULT 'VND',
    excerpt TEXT,
    description TEXT,
    requirements TEXT[],
    benefits TEXT[],
    apply_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('draft', 'active', 'closed', 'paused')),
    view_count INTEGER DEFAULT 0,
    application_count INTEGER DEFAULT 0,
    expires_at TIMESTAMP,
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Job Tags - Tags cho mỗi job
CREATE TABLE job_tags (
    id SERIAL PRIMARY KEY,
    job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
    tag_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(job_id, tag_name)
);

-- Bảng Applications - Đơn ứng tuyển
CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
    candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN 
        ('submitted', 'reviewed', 'shortlisted', 'interview', 'offered', 'accepted', 'rejected', 'withdrawn')
    ),
    cover_letter TEXT,
    resume_url VARCHAR(500), -- Resume specific cho job này
    expected_salary INTEGER,
    available_from DATE,
    current_step VARCHAR(50), -- Current interview step
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(job_id, candidate_id) -- Mỗi candidate chỉ apply 1 lần cho 1 job
);

-- Bảng Application Notes - Ghi chú của HR về ứng viên
CREATE TABLE application_notes (
    id SERIAL PRIMARY KEY,
    application_id INTEGER REFERENCES applications(id) ON DELETE CASCADE,
    hr_id INTEGER REFERENCES hr_profiles(id) ON DELETE SET NULL,
    note TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT TRUE, -- Chỉ HR xem được
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Interview Schedules - Lịch phỏng vấn
CREATE TABLE interview_schedules (
    id SERIAL PRIMARY KEY,
    application_id INTEGER REFERENCES applications(id) ON DELETE CASCADE,
    interview_type VARCHAR(50), -- phone, video, onsite, technical, etc.
    scheduled_at TIMESTAMP NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    location VARCHAR(255), -- Địa điểm hoặc link meeting
    interviewer_ids INTEGER[], -- Array of user_ids
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN 
        ('scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled')
    ),
    notes TEXT,
    feedback TEXT, -- Feedback sau phỏng vấn
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Saved Jobs - Job mà candidate đã lưu
CREATE TABLE saved_jobs (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
    job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(candidate_id, job_id)
);

-- Bảng Job Alerts - Thông báo job mới cho candidate
CREATE TABLE job_alerts (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
    keywords TEXT[],
    locations TEXT[],
    categories TEXT[],
    job_types TEXT[],
    min_salary INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    frequency VARCHAR(20) DEFAULT 'daily' CHECK (frequency IN ('instant', 'daily', 'weekly')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Notifications - Thông báo chung
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- application_status, interview_invite, new_message, etc.
    title VARCHAR(255) NOT NULL,
    content TEXT,
    link VARCHAR(500), -- Link đến resource liên quan
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Messages - Tin nhắn giữa HR và Candidate
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    application_id INTEGER REFERENCES applications(id) ON DELETE CASCADE,
    sender_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    receiver_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Reviews - Đánh giá công ty từ ứng viên/nhân viên cũ
CREATE TABLE employer_reviews (
    id SERIAL PRIMARY KEY,
    employer_id INTEGER REFERENCES employers(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    review_text TEXT,
    pros TEXT,
    cons TEXT,
    work_life_balance_rating INTEGER CHECK (work_life_balance_rating >= 1 AND work_life_balance_rating <= 5),
    salary_benefit_rating INTEGER CHECK (salary_benefit_rating >= 1 AND salary_benefit_rating <= 5),
    is_anonymous BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE, -- Đã verify là nhân viên thật
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES for Performance
-- =====================================================

-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_type ON users(user_type);
CREATE INDEX idx_users_active ON users(is_active);

-- Candidates
CREATE INDEX idx_candidates_user ON candidates(user_id);
CREATE INDEX idx_candidates_location ON candidates(location);

-- Jobs
CREATE INDEX idx_jobs_employer ON jobs(employer_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_category ON jobs(category);
CREATE INDEX idx_jobs_location ON jobs(location);
CREATE INDEX idx_jobs_posted_at ON jobs(posted_at DESC);
CREATE INDEX idx_jobs_slug ON jobs(slug);

-- Applications
CREATE INDEX idx_applications_job ON applications(job_id);
CREATE INDEX idx_applications_candidate ON applications(candidate_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_applied_at ON applications(applied_at DESC);

-- Saved Jobs
CREATE INDEX idx_saved_jobs_candidate ON saved_jobs(candidate_id);
CREATE INDEX idx_saved_jobs_job ON saved_jobs(job_id);

-- Notifications
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);

-- Messages
CREATE INDEX idx_messages_application ON messages(application_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);

-- =====================================================
-- SAMPLE QUERIES
-- =====================================================

-- Lấy tất cả jobs active với thông tin công ty
-- SELECT j.*, e.name as company_name, e.logo_url 
-- FROM jobs j 
-- JOIN employers e ON j.employer_id = e.id 
-- WHERE j.status = 'active' 
-- ORDER BY j.posted_at DESC;

-- Lấy applications của một candidate với status
-- SELECT a.*, j.title, j.location, e.name as company_name 
-- FROM applications a 
-- JOIN jobs j ON a.job_id = j.id 
-- JOIN employers e ON j.employer_id = e.id 
-- WHERE a.candidate_id = ? 
-- ORDER BY a.applied_at DESC;

-- Thống kê applications theo status cho một job
-- SELECT status, COUNT(*) as count 
-- FROM applications 
-- WHERE job_id = ? 
-- GROUP BY status;