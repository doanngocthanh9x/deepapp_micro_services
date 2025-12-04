-- =====================================================
-- DATABASE SCHEMA: JOB PORTAL SYSTEM (MySQL)
-- =====================================================

-- Bảng Users - Quản lý tất cả người dùng trong hệ thống
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type ENUM('candidate', 'hr', 'admin') NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_user_type (user_type),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Candidates - Thông tin chi tiết ứng viên
CREATE TABLE candidates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    title VARCHAR(255), -- Frontend Developer, UI/UX Designer, etc.
    location VARCHAR(255),
    experience_years INT,
    resume_url VARCHAR(500),
    portfolio_url VARCHAR(500),
    linkedin_url VARCHAR(500),
    github_url VARCHAR(500),
    bio TEXT,
    salary_expectation_min INT, -- VND
    salary_expectation_max INT, -- VND
    preferred_job_type ENUM('full-time', 'part-time', 'remote', 'contract', 'internship'),
    available_from DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_location (location)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Candidate Skills - Kỹ năng của ứng viên
CREATE TABLE candidate_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT,
    skill_name VARCHAR(100) NOT NULL,
    proficiency_level ENUM('beginner', 'intermediate', 'advanced', 'expert'),
    years_of_experience INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Candidate Experience - Kinh nghiệm làm việc
CREATE TABLE candidate_experience (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT,
    company_name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE, -- NULL nếu đang làm việc
    description TEXT,
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Candidate Education - Học vấn
CREATE TABLE candidate_education (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT,
    institution VARCHAR(255) NOT NULL,
    degree VARCHAR(100) NOT NULL, -- Bachelor, Master, PhD, etc.
    field_of_study VARCHAR(255),
    start_date DATE,
    end_date DATE,
    gpa DECIMAL(3,2),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Employers/Companies - Thông tin công ty
CREATE TABLE employers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo_url VARCHAR(500),
    website VARCHAR(500),
    location VARCHAR(255),
    industry VARCHAR(100),
    company_size VARCHAR(50), -- "10-50 employees", "50-200 employees", etc.
    about TEXT,
    founded_year INT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng HR - Thông tin HR/Recruiter
CREATE TABLE hr_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    employer_id INT,
    position VARCHAR(255), -- HR Manager, Recruiter, etc.
    department VARCHAR(100),
    is_primary_contact BOOLEAN DEFAULT FALSE, -- HR chính của công ty
    can_post_jobs BOOLEAN DEFAULT TRUE,
    can_review_applications BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (employer_id) REFERENCES employers(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Jobs - Tin tuyển dụng
CREATE TABLE jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    employer_id INT,
    posted_by INT, -- HR đăng tin
    location VARCHAR(255),
    job_type ENUM('full-time', 'part-time', 'remote', 'contract', 'internship'),
    category VARCHAR(100), -- Engineering, Design, Product, etc.
    salary_min INT,
    salary_max INT,
    salary_currency VARCHAR(10) DEFAULT 'VND',
    excerpt TEXT,
    description TEXT,
    requirements JSON,
    benefits JSON,
    apply_url VARCHAR(500),
    status ENUM('draft', 'active', 'closed', 'paused') DEFAULT 'active',
    view_count INT DEFAULT 0,
    application_count INT DEFAULT 0,
    expires_at TIMESTAMP NULL,
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employer_id) REFERENCES employers(id) ON DELETE CASCADE,
    FOREIGN KEY (posted_by) REFERENCES hr_profiles(id) ON DELETE SET NULL,
    INDEX idx_employer (employer_id),
    INDEX idx_status (status),
    INDEX idx_category (category),
    INDEX idx_location (location),
    INDEX idx_posted_at (posted_at DESC),
    INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Job Tags - Tags cho mỗi job
CREATE TABLE job_tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT,
    tag_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    UNIQUE KEY unique_job_tag (job_id, tag_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Applications - Đơn ứng tuyển
CREATE TABLE applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT,
    candidate_id INT,
    status ENUM('submitted', 'reviewed', 'shortlisted', 'interview', 'offered', 'accepted', 'rejected', 'withdrawn') DEFAULT 'submitted',
    cover_letter TEXT,
    resume_url VARCHAR(500), -- Resume specific cho job này
    expected_salary INT,
    available_from DATE,
    current_step VARCHAR(50), -- Current interview step
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
    UNIQUE KEY unique_job_candidate (job_id, candidate_id),
    INDEX idx_job (job_id),
    INDEX idx_candidate (candidate_id),
    INDEX idx_status (status),
    INDEX idx_applied_at (applied_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Application Notes - Ghi chú của HR về ứng viên
CREATE TABLE application_notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT,
    hr_id INT,
    note TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT TRUE, -- Chỉ HR xem được
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    FOREIGN KEY (hr_id) REFERENCES hr_profiles(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Interview Schedules - Lịch phỏng vấn
CREATE TABLE interview_schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT,
    interview_type VARCHAR(50), -- phone, video, onsite, technical, etc.
    scheduled_at TIMESTAMP NOT NULL,
    duration_minutes INT DEFAULT 60,
    location VARCHAR(255), -- Địa điểm hoặc link meeting
    interviewer_ids JSON, -- Array of user_ids
    status ENUM('scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled') DEFAULT 'scheduled',
    notes TEXT,
    feedback TEXT, -- Feedback sau phỏng vấn
    rating INT CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Saved Jobs - Job mà candidate đã lưu
CREATE TABLE saved_jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT,
    job_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    UNIQUE KEY unique_saved_job (candidate_id, job_id),
    INDEX idx_candidate (candidate_id),
    INDEX idx_job (job_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Job Alerts - Thông báo job mới cho candidate
CREATE TABLE job_alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT,
    keywords JSON,
    locations JSON,
    categories JSON,
    job_types JSON,
    min_salary INT,
    is_active BOOLEAN DEFAULT TRUE,
    frequency ENUM('instant', 'daily', 'weekly') DEFAULT 'daily',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Notifications - Thông báo chung
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    type VARCHAR(50) NOT NULL, -- application_status, interview_invite, new_message, etc.
    title VARCHAR(255) NOT NULL,
    content TEXT,
    link VARCHAR(500), -- Link đến resource liên quan
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Messages - Tin nhắn giữa HR và Candidate
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT,
    sender_id INT,
    receiver_id INT,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_application (application_id),
    INDEX idx_sender (sender_id),
    INDEX idx_receiver (receiver_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Reviews - Đánh giá công ty từ ứng viên/nhân viên cũ
CREATE TABLE employer_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employer_id INT,
    user_id INT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    review_text TEXT,
    pros TEXT,
    cons TEXT,
    work_life_balance_rating INT CHECK (work_life_balance_rating >= 1 AND work_life_balance_rating <= 5),
    salary_benefit_rating INT CHECK (salary_benefit_rating >= 1 AND salary_benefit_rating <= 5),
    is_anonymous BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE, -- Đã verify là nhân viên thật
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employer_id) REFERENCES employers(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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