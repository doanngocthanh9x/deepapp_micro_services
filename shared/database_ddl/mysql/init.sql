-- =====================================================
-- JOB PORTAL API - Database Initialization
-- =====================================================

-- Đảm bảo database tồn tại
CREATE DATABASE IF NOT EXISTS cxldb;
USE cxldb;

-- =====================================================
-- TABLE DEFINITIONS (Sequelize sẽ tự động tạo)
-- =====================================================
-- Các bảng sẽ được tự động tạo bởi Sequelize models
-- Bạn có thể chạy các query sample dưới đây sau khi server khởi động

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Sample Users (password_hash là placeholder)
INSERT INTO users (email, password_hash, user_type, full_name, phone, is_verified, is_active) 
VALUES 
('admin@example.com', '$2b$10$abc123...', 'admin', 'Admin User', '0900000000', 1, 1),
('hr@company.com', '$2b$10$def456...', 'hr', 'HR Manager', '0901111111', 1, 1),
('candidate@example.com', '$2b$10$ghi789...', 'candidate', 'John Doe', '0902222222', 0, 1)
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- Sample Employers
INSERT INTO employers (name, website, location, industry, company_size, is_verified)
VALUES
('Tech Company Vietnam', 'https://techcompany.vn', 'Ho Chi Minh City', 'Technology', '50-200 employees', 1),
('Design Studio', 'https://designstudio.vn', 'Hanoi', 'Design', '10-50 employees', 0)
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- Sample Jobs
INSERT INTO jobs (slug, title, employer_id, location, job_type, category, salary_min, salary_max, description, status)
VALUES
('senior-nodejs-dev-2024', 'Senior Node.js Developer', 1, 'Ho Chi Minh City', 'full-time', 'Engineering', 15000000, 25000000, 'Looking for experienced Node.js developer...', 'active'),
('frontend-react-developer', 'Frontend React Developer', 1, 'Ho Chi Minh City', 'full-time', 'Engineering', 12000000, 18000000, 'React specialist needed...', 'active'),
('ui-ux-designer', 'UI/UX Designer', 2, 'Hanoi', 'full-time', 'Design', 10000000, 15000000, 'Creative designer for our team...', 'active')
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- Sample Job Tags
INSERT INTO job_tags (job_id, tag_name)
SELECT id, 'node.js' FROM jobs WHERE slug = 'senior-nodejs-dev-2024'
UNION ALL
SELECT id, 'express' FROM jobs WHERE slug = 'senior-nodejs-dev-2024'
UNION ALL
SELECT id, 'react' FROM jobs WHERE slug = 'frontend-react-developer'
UNION ALL
SELECT id, 'javascript' FROM jobs WHERE slug = 'frontend-react-developer'
UNION ALL
SELECT id, 'figma' FROM jobs WHERE slug = 'ui-ux-designer'
ON DUPLICATE KEY UPDATE created_at = NOW();

-- =====================================================
-- USEFUL QUERIES
-- =====================================================

-- Lấy tất cả active jobs với thông tin công ty
-- SELECT j.*, e.name as company_name 
-- FROM jobs j 
-- JOIN employers e ON j.employer_id = e.id 
-- WHERE j.status = 'active' 
-- ORDER BY j.created_at DESC;

-- Lấy jobs theo category
-- SELECT * FROM jobs WHERE category = 'Engineering' AND status = 'active';

-- Lấy users theo user_type
-- SELECT * FROM users WHERE user_type = 'candidate' AND is_active = 1;

-- Đếm jobs theo status
-- SELECT status, COUNT(*) as count FROM jobs GROUP BY status;

-- =====================================================
-- INDEXES (Sequelize sẽ tự động tạo từ model definitions)
-- =====================================================
-- Các index được định nghĩa trong models sẽ được tạo tự động
