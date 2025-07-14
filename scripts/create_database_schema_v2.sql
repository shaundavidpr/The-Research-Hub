-- Production Database Schema for The Research Hub
-- Version 2.0 - Complete Implementation

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS contact_submissions CASCADE;
DROP TABLE IF EXISTS research_comments CASCADE;
DROP TABLE IF EXISTS paper_likes CASCADE;
DROP TABLE IF EXISTS user_follows CASCADE;
DROP TABLE IF EXISTS papers CASCADE;
DROP TABLE IF EXISTS timeline_events CASCADE;
DROP TABLE IF EXISTS citations CASCADE;
DROP TABLE IF EXISTS research_files CASCADE;
DROP TABLE IF EXISTS research_projects CASCADE;
DROP TABLE IF EXISTS research_notes CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table for authentication
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255), -- For email/password auth
    avatar TEXT,
    provider VARCHAR(50) DEFAULT 'email', -- 'email', 'google', 'github'
    provider_id VARCHAR(255), -- External provider ID
    email_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User sessions for authentication
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles table for detailed research information
CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    institution VARCHAR(255),
    department VARCHAR(255),
    bio TEXT,
    research_interests TEXT[],
    methodologies TEXT[],
    specializations TEXT[],
    avatar_url TEXT,
    website_url TEXT,
    orcid_id VARCHAR(50),
    google_scholar_url TEXT,
    linkedin_url TEXT,
    twitter_handle VARCHAR(50),
    location VARCHAR(255),
    privacy_level VARCHAR(20) DEFAULT 'public',
    collaboration_open BOOLEAN DEFAULT true,
    email_notifications BOOLEAN DEFAULT true,
    research_updates BOOLEAN DEFAULT true,
    profile_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notes table for research notes
CREATE TABLE research_notes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    content TEXT,
    type VARCHAR(50) DEFAULT 'research', -- 'research', 'personal', 'meeting', 'idea'
    tags TEXT[],
    project_id INTEGER,
    is_favorite BOOLEAN DEFAULT FALSE,
    is_private BOOLEAN DEFAULT FALSE,
    word_count INTEGER DEFAULT 0,
    reading_time INTEGER DEFAULT 0, -- in minutes
    last_edited TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table for research projects
CREATE TABLE research_projects (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active', -- 'planning', 'active', 'completed', 'archived', 'on_hold'
    progress INTEGER DEFAULT 0,
    start_date DATE,
    end_date DATE,
    collaborators TEXT[],
    tags TEXT[],
    is_private BOOLEAN DEFAULT FALSE,
    budget DECIMAL(10,2),
    funding_source VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Files table for document management
CREATE TABLE research_files (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    filename VARCHAR(500) NOT NULL,
    original_filename VARCHAR(500) NOT NULL,
    file_type VARCHAR(100),
    file_size BIGINT,
    file_url TEXT,
    project_id INTEGER REFERENCES research_projects(id) ON DELETE SET NULL,
    tags TEXT[],
    description TEXT,
    metadata JSONB DEFAULT '{}', -- title, authors, abstract, keywords, doi
    is_private BOOLEAN DEFAULT FALSE,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Citations table for reference management
CREATE TABLE citations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'article', 'book', 'website', 'conference', 'thesis', 'report'
    title VARCHAR(1000) NOT NULL,
    authors TEXT[],
    journal VARCHAR(500),
    year INTEGER,
    doi VARCHAR(255),
    url TEXT,
    pages VARCHAR(50),
    volume VARCHAR(50),
    issue VARCHAR(50),
    publisher VARCHAR(500),
    citation_style VARCHAR(50) DEFAULT 'apa',
    formatted_citation TEXT,
    tags TEXT[],
    notes TEXT,
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Timeline/Calendar events
CREATE TABLE timeline_events (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    project_id INTEGER REFERENCES research_projects(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    type VARCHAR(50) DEFAULT 'task', -- 'milestone', 'deadline', 'meeting', 'task', 'conference', 'presentation'
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    completed BOOLEAN DEFAULT FALSE,
    priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
    location VARCHAR(255),
    attendees TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Research papers/publications
CREATE TABLE papers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(1000) NOT NULL,
    abstract TEXT,
    content TEXT,
    authors TEXT[],
    keywords TEXT[],
    field VARCHAR(255),
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'published', 'under_review', 'rejected', 'accepted'
    visibility VARCHAR(50) DEFAULT 'private', -- 'public', 'private', 'institutional'
    file_url TEXT,
    doi VARCHAR(255),
    journal VARCHAR(500),
    publication_date DATE,
    views INTEGER DEFAULT 0,
    downloads INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social features - follows
CREATE TABLE user_follows (
    id SERIAL PRIMARY KEY,
    follower_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    following_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(follower_id, following_id),
    CHECK (follower_id != following_id)
);

-- Social features - likes
CREATE TABLE paper_likes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    paper_id INTEGER REFERENCES papers(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, paper_id)
);

-- Comments on papers and other content
CREATE TABLE research_comments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_type VARCHAR(50) NOT NULL, -- 'note', 'project', 'paper', 'file'
    parent_id INTEGER NOT NULL,
    parent_comment_id INTEGER REFERENCES research_comments(id) ON DELETE CASCADE, -- For replies
    is_edited BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat messages for AI assistant
CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    response TEXT,
    context JSONB DEFAULT '{}',
    tokens_used INTEGER DEFAULT 0,
    response_time INTEGER DEFAULT 0, -- in milliseconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact submissions table
CREATE TABLE contact_submissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'general', -- 'general', 'support', 'enterprise', 'partnership', 'feedback', 'media'
    status VARCHAR(20) DEFAULT 'new', -- 'new', 'in_progress', 'resolved', 'closed'
    assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
    priority VARCHAR(20) DEFAULT 'medium',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'follow', 'like', 'comment', 'mention', 'project_invite', 'deadline'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_provider ON users(provider);
CREATE INDEX idx_users_active ON users(is_active);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_expires ON user_sessions(expires_at);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_institution ON user_profiles(institution);
CREATE INDEX idx_research_notes_user_id ON research_notes(user_id);
CREATE INDEX idx_research_notes_project_id ON research_notes(project_id);
CREATE INDEX idx_research_notes_type ON research_notes(type);
CREATE INDEX idx_research_notes_tags ON research_notes USING GIN(tags);
CREATE INDEX idx_research_notes_search ON research_notes USING GIN(to_tsvector('english', title || ' ' || COALESCE(content, '')));
CREATE INDEX idx_research_projects_user_id ON research_projects(user_id);
CREATE INDEX idx_research_projects_status ON research_projects(status);
CREATE INDEX idx_research_projects_tags ON research_projects USING GIN(tags);
CREATE INDEX idx_research_files_user_id ON research_files(user_id);
CREATE INDEX idx_research_files_project_id ON research_files(project_id);
CREATE INDEX idx_research_files_type ON research_files(file_type);
CREATE INDEX idx_research_files_tags ON research_files USING GIN(tags);
CREATE INDEX idx_citations_user_id ON citations(user_id);
CREATE INDEX idx_citations_type ON citations(type);
CREATE INDEX idx_citations_year ON citations(year);
CREATE INDEX idx_citations_tags ON citations USING GIN(tags);
CREATE INDEX idx_timeline_events_user_id ON timeline_events(user_id);
CREATE INDEX idx_timeline_events_project_id ON timeline_events(project_id);
CREATE INDEX idx_timeline_events_date ON timeline_events(event_date);
CREATE INDEX idx_timeline_events_type ON timeline_events(type);
CREATE INDEX idx_papers_user_id ON papers(user_id);
CREATE INDEX idx_papers_visibility ON papers(visibility);
CREATE INDEX idx_papers_status ON papers(status);
CREATE INDEX idx_papers_field ON papers(field);
CREATE INDEX idx_papers_search ON papers USING GIN(to_tsvector('english', title || ' ' || COALESCE(abstract, '')));
CREATE INDEX idx_user_follows_follower ON user_follows(follower_id);
CREATE INDEX idx_user_follows_following ON user_follows(following_id);
CREATE INDEX idx_paper_likes_user_id ON paper_likes(user_id);
CREATE INDEX idx_paper_likes_paper_id ON paper_likes(paper_id);
CREATE INDEX idx_research_comments_parent ON research_comments(parent_type, parent_id);
CREATE INDEX idx_research_comments_user_id ON research_comments(user_id);
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX idx_contact_submissions_type ON contact_submissions(type);
CREATE INDEX idx_contact_submissions_created_at ON contact_submissions(created_at);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_type ON notifications(type);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_research_notes_updated_at BEFORE UPDATE ON research_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_research_projects_updated_at BEFORE UPDATE ON research_projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_research_files_updated_at BEFORE UPDATE ON research_files FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_citations_updated_at BEFORE UPDATE ON citations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_timeline_events_updated_at BEFORE UPDATE ON timeline_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_papers_updated_at BEFORE UPDATE ON papers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_research_comments_updated_at BEFORE UPDATE ON research_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_submissions_updated_at BEFORE UPDATE ON contact_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing and demonstration
INSERT INTO users (email, name, provider, email_verified, created_at) VALUES 
('researcher1@university.edu', 'Dr. Sarah Johnson', 'email', true, NOW()),
('researcher2@institute.org', 'Prof. Michael Chen', 'email', true, NOW()),
('researcher3@college.edu', 'Dr. Emily Rodriguez', 'google', true, NOW()),
('researcher4@lab.gov', 'Dr. James Wilson', 'email', true, NOW())
ON CONFLICT (email) DO NOTHING;

-- Insert sample user profiles
INSERT INTO user_profiles (user_id, title, institution, bio, research_interests, methodologies, specializations, profile_completed, created_at)
SELECT 
    u.id,
    CASE 
        WHEN u.email = 'researcher1@university.edu' THEN 'Associate Professor'
        WHEN u.email = 'researcher2@institute.org' THEN 'Senior Research Fellow'
        WHEN u.email = 'researcher3@college.edu' THEN 'Assistant Professor'
        WHEN u.email = 'researcher4@lab.gov' THEN 'Principal Investigator'
    END,
    CASE 
        WHEN u.email = 'researcher1@university.edu' THEN 'Stanford University'
        WHEN u.email = 'researcher2@institute.org' THEN 'MIT Research Institute'
        WHEN u.email = 'researcher3@college.edu' THEN 'Harvard University'
        WHEN u.email = 'researcher4@lab.gov' THEN 'National Research Laboratory'
    END,
    CASE 
        WHEN u.email = 'researcher1@university.edu' THEN 'Computational biologist specializing in machine learning applications in genomics.'
        WHEN u.email = 'researcher2@institute.org' THEN 'Quantum computing researcher working on next-generation algorithms.'
        WHEN u.email = 'researcher3@college.edu' THEN 'Environmental scientist focused on climate change research and sustainability.'
        WHEN u.email = 'researcher4@lab.gov' THEN 'Materials scientist developing advanced nanomaterials for energy applications.'
    END,
    CASE 
        WHEN u.email = 'researcher1@university.edu' THEN ARRAY['Computational Biology', 'Genomics', 'Machine Learning']
        WHEN u.email = 'researcher2@institute.org' THEN ARRAY['Quantum Computing', 'Algorithms', 'Theoretical Physics']
        WHEN u.email = 'researcher3@college.edu' THEN ARRAY['Climate Science', 'Environmental Policy', 'Sustainability']
        WHEN u.email = 'researcher4@lab.gov' THEN ARRAY['Materials Science', 'Nanotechnology', 'Energy Storage']
    END,
    ARRAY['Quantitative Analysis', 'Statistical Modeling', 'Experimental Design'],
    CASE 
        WHEN u.email = 'researcher1@university.edu' THEN ARRAY['Bioinformatics', 'Deep Learning']
        WHEN u.email = 'researcher2@institute.org' THEN ARRAY['Quantum Algorithms', 'Complexity Theory']
        WHEN u.email = 'researcher3@college.edu' THEN ARRAY['Climate Modeling', 'Policy Analysis']
        WHEN u.email = 'researcher4@lab.gov' THEN ARRAY['Nanofabrication', 'Battery Technology']
    END,
    true,
    NOW()
FROM users u 
WHERE u.email IN ('researcher1@university.edu', 'researcher2@institute.org', 'researcher3@college.edu', 'researcher4@lab.gov')
ON CONFLICT DO NOTHING;

-- Insert sample research projects
INSERT INTO research_projects (user_id, title, description, status, tags, progress, start_date, end_date, created_at)
SELECT 
    u.id,
    CASE 
        WHEN u.email = 'researcher1@university.edu' THEN '🧬 Genomic Analysis Pipeline Development'
        WHEN u.email = 'researcher2@institute.org' THEN '⚛️ Quantum Algorithm Optimization'
        WHEN u.email = 'researcher3@college.edu' THEN '🌍 Climate Impact Assessment Study'
        WHEN u.email = 'researcher4@lab.gov' THEN '🔋 Next-Gen Battery Materials Research'
    END,
    CASE 
        WHEN u.email = 'researcher1@university.edu' THEN 'Developing automated pipelines for large-scale genomic data analysis using machine learning techniques.'
        WHEN u.email = 'researcher2@institute.org' THEN 'Optimizing quantum algorithms for practical applications in cryptography and optimization.'
        WHEN u.email = 'researcher3@college.edu' THEN 'Comprehensive study on climate change impacts on coastal ecosystems and adaptation strategies.'
        WHEN u.email = 'researcher4@lab.gov' THEN 'Research and development of advanced nanomaterials for high-capacity energy storage systems.'
    END,
    'active',
    CASE 
        WHEN u.email = 'researcher1@university.edu' THEN ARRAY['genomics', 'machine-learning', 'bioinformatics']
        WHEN u.email = 'researcher2@institute.org' THEN ARRAY['quantum-computing', 'algorithms', 'optimization']
        WHEN u.email = 'researcher3@college.edu' THEN ARRAY['climate-science', 'ecology', 'policy']
        WHEN u.email = 'researcher4@lab.gov' THEN ARRAY['materials-science', 'nanotechnology', 'energy']
    END,
    CASE 
        WHEN u.email = 'researcher1@university.edu' THEN 75
        WHEN u.email = 'researcher2@institute.org' THEN 60
        WHEN u.email = 'researcher3@college.edu' THEN 45
        WHEN u.email = 'researcher4@lab.gov' THEN 80
    END,
    CURRENT_DATE - INTERVAL '6 months',
    CURRENT_DATE + INTERVAL '1 year',
    NOW()
FROM users u 
WHERE u.email IN ('researcher1@university.edu', 'researcher2@institute.org', 'researcher3@college.edu', 'researcher4@lab.gov');

-- Insert sample research notes
INSERT INTO research_notes (user_id, title, content, type, tags, word_count, created_at)
SELECT 
    u.id,
    CASE 
        WHEN u.email = 'researcher1@university.edu' THEN 'Machine Learning Model Performance Analysis'
        WHEN u.email = 'researcher2@institute.org' THEN 'Quantum Error Correction Strategies'
        WHEN u.email = 'researcher3@college.edu' THEN 'Climate Data Visualization Techniques'
        WHEN u.email = 'researcher4@lab.gov' THEN 'Nanomaterial Synthesis Optimization'
    END,
    CASE 
        WHEN u.email = 'researcher1@university.edu' THEN 'Detailed analysis of various ML models applied to genomic data. Random Forest shows 92% accuracy, while deep neural networks achieve 94% but with higher computational cost. Need to balance accuracy vs efficiency for production deployment.'
        WHEN u.email = 'researcher2@institute.org' THEN 'Exploring different quantum error correction codes. Surface codes show promise for near-term applications. Need to investigate trade-offs between error threshold and resource requirements.'
        WHEN u.email = 'researcher3@college.edu' THEN 'Effective visualization techniques for complex climate datasets. Interactive dashboards using D3.js and Python matplotlib. Consider accessibility and color-blind friendly palettes.'
        WHEN u.email = 'researcher4@lab.gov' THEN 'Optimization of synthesis parameters for graphene-based nanomaterials. Temperature and pressure conditions significantly affect material properties. Document all experimental conditions.'
    END,
    'research',
    CASE 
        WHEN u.email = 'researcher1@university.edu' THEN ARRAY['machine-learning', 'performance', 'genomics']
        WHEN u.email = 'researcher2@institute.org' THEN ARRAY['quantum', 'error-correction', 'algorithms']
        WHEN u.email = 'researcher3@college.edu' THEN ARRAY['visualization', 'climate-data', 'analysis']
        WHEN u.email = 'researcher4@lab.gov' THEN ARRAY['synthesis', 'nanomaterials', 'optimization']
    END,
    250,
    NOW() - INTERVAL '2 days'
FROM users u 
WHERE u.email IN ('researcher1@university.edu', 'researcher2@institute.org', 'researcher3@college.edu', 'researcher4@lab.gov');

-- Insert sample citations
INSERT INTO citations (user_id, type, title, authors, journal, year, doi, formatted_citation, tags, created_at)
SELECT 
    u.id,
    'article',
    CASE 
        WHEN u.email = 'researcher1@university.edu' THEN 'Deep Learning Applications in Genomic Medicine'
        WHEN u.email = 'researcher2@institute.org' THEN 'Quantum Computing: Progress and Prospects'
        WHEN u.email = 'researcher3@college.edu' THEN 'Climate Change and Ecosystem Dynamics'
        WHEN u.email = 'researcher4@lab.gov' THEN 'Advanced Materials for Energy Storage'
    END,
    CASE 
        WHEN u.email = 'researcher1@university.edu' THEN ARRAY['Smith, J.', 'Johnson, A.', 'Brown, K.']
        WHEN u.email = 'researcher2@institute.org' THEN ARRAY['Chen, L.', 'Wang, M.', 'Liu, X.']
        WHEN u.email = 'researcher3@college.edu' THEN ARRAY['Rodriguez, E.', 'Martinez, C.', 'Garcia, R.']
        WHEN u.email = 'researcher4@lab.gov' THEN ARRAY['Wilson, J.', 'Davis, S.', 'Miller, T.']
    END,
    CASE 
        WHEN u.email = 'researcher1@university.edu' THEN 'Nature Biotechnology'
        WHEN u.email = 'researcher2@institute.org' THEN 'Science'
        WHEN u.email = 'researcher3@college.edu' THEN 'Nature Climate Change'
        WHEN u.email = 'researcher4@lab.gov' THEN 'Advanced Materials'
    END,
    2023,
    CASE 
        WHEN u.email = 'researcher1@university.edu' THEN '10.1038/nbt.2023.001'
        WHEN u.email = 'researcher2@institute.org' THEN '10.1126/science.2023.002'
        WHEN u.email = 'researcher3@college.edu' THEN '10.1038/nclimate.2023.003'
        WHEN u.email = 'researcher4@lab.gov' THEN '10.1002/adma.2023.004'
    END,
    CASE 
        WHEN u.email = 'researcher1@university.edu' THEN 'Smith, J., Johnson, A., & Brown, K. (2023). Deep Learning Applications in Genomic Medicine. Nature Biotechnology, 41(3), 123-135.'
        WHEN u.email = 'researcher2@institute.org' THEN 'Chen, L., Wang, M., & Liu, X. (2023). Quantum Computing: Progress and Prospects. Science, 380(6642), 456-467.'
        WHEN u.email = 'researcher3@college.edu' THEN 'Rodriguez, E., Martinez, C., & Garcia, R. (2023). Climate Change and Ecosystem Dynamics. Nature Climate Change, 13(4), 234-245.'
        WHEN u.email = 'researcher4@lab.gov' THEN 'Wilson, J., Davis, S., & Miller, T. (2023). Advanced Materials for Energy Storage. Advanced Materials, 35(12), 789-801.'
    END,
    CASE 
        WHEN u.email = 'researcher1@university.edu' THEN ARRAY['genomics', 'deep-learning', 'medicine']
        WHEN u.email = 'researcher2@institute.org' THEN ARRAY['quantum-computing', 'algorithms', 'physics']
        WHEN u.email = 'researcher3@college.edu' THEN ARRAY['climate-change', 'ecology', 'environment']
        WHEN u.email = 'researcher4@lab.gov' THEN ARRAY['materials', 'energy', 'nanotechnology']
    END,
    NOW() - INTERVAL '1 week'
FROM users u 
WHERE u.email IN ('researcher1@university.edu', 'researcher2@institute.org', 'researcher3@college.edu', 'researcher4@lab.gov');

-- Insert sample timeline events
INSERT INTO timeline_events (user_id, project_id, title, description, type, event_date, priority, created_at)
SELECT 
    u.id,
    p.id,
    CASE 
        WHEN u.email = 'researcher1@university.edu' THEN '📊 Data Analysis Milestone'
        WHEN u.email = 'researcher2@institute.org' THEN '🔬 Algorithm Testing Phase'
        WHEN u.email = 'researcher3@college.edu' THEN '📝 Research Paper Submission'
        WHEN u.email = 'researcher4@lab.gov' THEN '🧪 Experimental Validation'
    END,
    CASE 
        WHEN u.email = 'researcher1@university.edu' THEN 'Complete statistical analysis of genomic datasets and prepare preliminary results.'
        WHEN u.email = 'researcher2@institute.org' THEN 'Test quantum algorithms on different hardware platforms and benchmark performance.'
        WHEN u.email = 'researcher3@college.edu' THEN 'Submit climate impact assessment paper to peer-reviewed journal.'
        WHEN u.email = 'researcher4@lab.gov' THEN 'Validate nanomaterial properties through comprehensive experimental testing.'
    END,
    'milestone',
    NOW() + INTERVAL '2 weeks',
    'high',
    NOW()
FROM users u 
JOIN research_projects p ON p.user_id = u.id
WHERE u.email IN ('researcher1@university.edu', 'researcher2@institute.org', 'researcher3@college.edu', 'researcher4@lab.gov');

-- Insert sample papers
INSERT INTO papers (user_id, title, abstract, authors, keywords, field, status, visibility, views, downloads, likes, created_at)
SELECT 
    u.id,
    CASE 
        WHEN u.email = 'researcher1@university.edu' THEN 'Machine Learning Approaches for Genomic Data Analysis: A Comprehensive Review'
        WHEN u.email = 'researcher2@institute.org' THEN 'Quantum Algorithm Optimization for Near-Term Quantum Devices'
        WHEN u.email = 'researcher3@college.edu' THEN 'Climate Change Impacts on Coastal Ecosystems: A Multi-Scale Analysis'
        WHEN u.email = 'researcher4@lab.gov' THEN 'Novel Nanomaterials for High-Performance Energy Storage Applications'
    END,
    CASE 
        WHEN u.email = 'researcher1@university.edu' THEN 'This comprehensive review examines the current state of machine learning applications in genomic data analysis. We discuss various ML techniques including deep learning, ensemble methods, and dimensionality reduction approaches. Our analysis covers both supervised and unsupervised learning paradigms, highlighting their strengths and limitations in genomic contexts. We also address challenges related to data quality, interpretability, and computational scalability.'
        WHEN u.email = 'researcher2@institute.org' THEN 'We present novel optimization strategies for quantum algorithms designed to run on near-term quantum devices. Our approach focuses on reducing circuit depth while maintaining algorithmic accuracy. We demonstrate significant improvements in quantum approximate optimization algorithms (QAOA) and variational quantum eigensolvers (VQE). Experimental results on IBM quantum hardware show up to 40% improvement in solution quality.'
        WHEN u.email = 'researcher3@college.edu' THEN 'This study presents a comprehensive multi-scale analysis of climate change impacts on coastal ecosystems. Using a combination of satellite data, field observations, and climate models, we assess changes in biodiversity, habitat distribution, and ecosystem services. Our findings reveal significant correlations between temperature rise, sea-level change, and species migration patterns across different coastal regions.'
        WHEN u.email = 'researcher4@lab.gov' THEN 'We report the development of novel graphene-based nanomaterials with enhanced properties for energy storage applications. Through controlled synthesis and surface modification techniques, we achieved materials with exceptional conductivity and capacity. Our nanomaterials demonstrate superior performance in lithium-ion batteries, showing 25% higher energy density and improved cycle stability compared to conventional materials.'
    END,
    CASE 
        WHEN u.email = 'researcher1@university.edu' THEN ARRAY['Dr. Sarah Johnson', 'Dr. Michael Chen', 'Prof. Emily Davis']
        WHEN u.email = 'researcher2@institute.org' THEN ARRAY['Prof. Michael Chen', 'Dr. Lisa Wang', 'Dr. James Liu']
        WHEN u.email = 'researcher3@college.edu' THEN ARRAY['Dr. Emily Rodriguez', 'Prof. Carlos Martinez', 'Dr. Ana Garcia']
        WHEN u.email = 'researcher4@lab.gov' THEN ARRAY['Dr. James Wilson', 'Dr. Sarah Davis', 'Prof. Thomas Miller']
    END,
    CASE 
        WHEN u.email = 'researcher1@university.edu' THEN ARRAY['machine learning', 'genomics', 'bioinformatics', 'deep learning', 'data analysis']
        WHEN u.email = 'researcher2@institute.org' THEN ARRAY['quantum computing', 'optimization', 'QAOA', 'VQE', 'quantum algorithms']
        WHEN u.email = 'researcher3@college.edu' THEN ARRAY['climate change', 'coastal ecosystems', 'biodiversity', 'environmental science', 'ecology']
        WHEN u.email = 'researcher4@lab.gov' THEN ARRAY['nanomaterials', 'energy storage', 'graphene', 'batteries', 'materials science']
    END,
    CASE 
        WHEN u.email = 'researcher1@university.edu' THEN 'computer-science'
        WHEN u.email = 'researcher2@institute.org' THEN 'physics'
        WHEN u.email = 'researcher3@college.edu' THEN 'environmental-science'
        WHEN u.email = 'researcher4@lab.gov' THEN 'materials-science'
    END,
    'published',
    'public',
    CASE 
        WHEN u.email = 'researcher1@university.edu' THEN 1247
        WHEN u.email = 'researcher2@institute.org' THEN 892
        WHEN u.email = 'researcher3@college.edu' THEN 1156
        WHEN u.email = 'researcher4@lab.gov' THEN 734
    END,
    CASE 
        WHEN u.email = 'researcher1@university.edu' THEN 234
        WHEN u.email = 'researcher2@institute.org' THEN 167
        WHEN u.email = 'researcher3@college.edu' THEN 198
        WHEN u.email = 'researcher4@lab.gov' THEN 145
    END,
    CASE 
        WHEN u.email = 'researcher1@university.edu' THEN 89
        WHEN u.email = 'researcher2@institute.org' THEN 67
        WHEN u.email = 'researcher3@college.edu' THEN 78
        WHEN u.email = 'researcher4@lab.gov' THEN 56
    END,
    NOW() - INTERVAL '3 months'
FROM users u 
WHERE u.email IN ('researcher1@university.edu', 'researcher2@institute.org', 'researcher3@college.edu', 'researcher4@lab.gov');

-- Insert some follow relationships
INSERT INTO user_follows (follower_id, following_id, created_at)
SELECT 
    u1.id as follower_id,
    u2.id as following_id,
    NOW() - INTERVAL '1 month'
FROM users u1
CROSS JOIN users u2
WHERE u1.id != u2.id 
AND u1.email = 'researcher1@university.edu'
AND u2.email IN ('researcher2@institute.org', 'researcher3@college.edu')
UNION ALL
SELECT 
    u1.id as follower_id,
    u2.id as following_id,
    NOW() - INTERVAL '2 weeks'
FROM users u1
CROSS JOIN users u2
WHERE u1.id != u2.id 
AND u1.email = 'researcher2@institute.org'
AND u2.email IN ('researcher1@university.edu', 'researcher4@lab.gov')
ON CONFLICT (follower_id, following_id) DO NOTHING;

-- Insert some paper likes
INSERT INTO paper_likes (user_id, paper_id, created_at)
SELECT 
    u.id,
    p.id,
    NOW() - INTERVAL '1 week'
FROM users u
CROSS JOIN papers p
WHERE u.id != p.user_id
AND RANDOM() < 0.3 -- 30% chance of liking a paper
ON CONFLICT (user_id, paper_id) DO NOTHING;

-- Create views for common queries
CREATE OR REPLACE VIEW user_stats AS
SELECT 
    u.id,
    u.name,
    u.email,
    COUNT(DISTINCT p.id) as paper_count,
    COUNT(DISTINCT n.id) as note_count,
    COUNT(DISTINCT pr.id) as project_count,
    COUNT(DISTINCT f1.id) as follower_count,
    COUNT(DISTINCT f2.id) as following_count,
    COALESCE(SUM(p.views), 0) as total_views,
    COALESCE(SUM(p.downloads), 0) as total_downloads,
    COALESCE(SUM(p.likes), 0) as total_likes
FROM users u
LEFT JOIN papers p ON u.id = p.user_id
LEFT JOIN research_notes n ON u.id = n.user_id
LEFT JOIN research_projects pr ON u.id = pr.user_id
LEFT JOIN user_follows f1 ON u.id = f1.following_id
LEFT JOIN user_follows f2 ON u.id = f2.follower_id
GROUP BY u.id, u.name, u.email;

-- Create a function to search across all content
CREATE OR REPLACE FUNCTION search_content(search_query TEXT)
RETURNS TABLE (
    content_type TEXT,
    id INTEGER,
    title TEXT,
    snippet TEXT,
    author_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    relevance REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        'paper'::TEXT as content_type,
        p.id,
        p.title,
        LEFT(p.abstract, 200) as snippet,
        u.name as author_name,
        p.created_at,
        ts_rank(to_tsvector('english', p.title || ' ' || COALESCE(p.abstract, '')), plainto_tsquery('english', search_query)) as relevance
    FROM papers p
    JOIN users u ON p.user_id = u.id
    WHERE to_tsvector('english', p.title || ' ' || COALESCE(p.abstract, '')) @@ plainto_tsquery('english', search_query)
    AND p.visibility = 'public'
    
    UNION ALL
    
    SELECT 
        'note'::TEXT as content_type,
        n.id,
        n.title,
        LEFT(n.content, 200) as snippet,
        u.name as author_name,
        n.created_at,
        ts_rank(to_tsvector('english', n.title || ' ' || COALESCE(n.content, '')), plainto_tsquery('english', search_query)) as relevance
    FROM research_notes n
    JOIN users u ON n.user_id = u.id
    WHERE to_tsvector('english', n.title || ' ' || COALESCE(n.content, '')) @@ plainto_tsquery('english', search_query)
    AND n.is_private = FALSE
    
    ORDER BY relevance DESC;
END;
$$ LANGUAGE plpgsql;

-- Grant appropriate permissions (adjust as needed for your setup)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO your_app_user;

COMMIT;
