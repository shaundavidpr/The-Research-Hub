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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User sessions for authentication
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notes table for research notes
CREATE TABLE research_notes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    content TEXT,
    type VARCHAR(50) DEFAULT 'research', -- 'research', 'personal'
    tags TEXT[],
    project_id INTEGER,
    is_favorite BOOLEAN DEFAULT FALSE,
    is_private BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table for research projects
CREATE TABLE research_projects (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active', -- 'planning', 'active', 'completed', 'archived'
    progress INTEGER DEFAULT 0,
    start_date DATE,
    end_date DATE,
    collaborators TEXT[],
    tags TEXT[],
    is_private BOOLEAN DEFAULT FALSE,
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Citations table for reference management
CREATE TABLE citations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'article', 'book', 'website', 'conference'
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
    type VARCHAR(50) DEFAULT 'task', -- 'milestone', 'deadline', 'meeting', 'task'
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high'
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
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'published', 'under_review'
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
    UNIQUE(follower_id, following_id)
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
    parent_type VARCHAR(50) NOT NULL, -- 'note', 'project', 'paper'
    parent_id INTEGER NOT NULL,
    parent_comment_id INTEGER REFERENCES research_comments(id) ON DELETE CASCADE, -- For replies
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_provider ON users(provider);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_expires ON user_sessions(expires_at);
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_research_notes_user_id ON research_notes(user_id);
CREATE INDEX idx_research_notes_project_id ON research_notes(project_id);
CREATE INDEX idx_research_projects_user_id ON research_projects(user_id);
CREATE INDEX idx_research_files_user_id ON research_files(user_id);
CREATE INDEX idx_research_files_project_id ON research_files(project_id);
CREATE INDEX idx_citations_user_id ON citations(user_id);
CREATE INDEX idx_timeline_events_user_id ON timeline_events(user_id);
CREATE INDEX idx_timeline_events_project_id ON timeline_events(project_id);
CREATE INDEX idx_papers_user_id ON papers(user_id);
CREATE INDEX idx_papers_visibility ON papers(visibility);
CREATE INDEX idx_user_follows_follower ON user_follows(follower_id);
CREATE INDEX idx_user_follows_following ON user_follows(following_id);
CREATE INDEX idx_paper_likes_user_id ON paper_likes(user_id);
CREATE INDEX idx_paper_likes_paper_id ON paper_likes(paper_id);
CREATE INDEX idx_research_comments_parent ON research_comments(parent_type, parent_id);
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX idx_contact_submissions_created_at ON contact_submissions(created_at);

-- Insert sample data for testing
INSERT INTO users (email, name, provider, email_verified, created_at) VALUES 
('demo@researchhub.com', 'Demo User', 'email', true, NOW()),
('admin@researchhub.com', 'Admin User', 'email', true, NOW())
ON CONFLICT (email) DO NOTHING;

-- Insert sample user profiles
INSERT INTO user_profiles (user_id, title, institution, bio, research_interests, created_at)
SELECT 
    u.id,
    'Research Scientist',
    'Demo University',
    'Passionate researcher exploring the frontiers of knowledge.',
    ARRAY['Machine Learning', 'Data Science', 'Research Methods'],
    NOW()
FROM users u 
WHERE u.email = 'demo@researchhub.com'
ON CONFLICT DO NOTHING;

-- Insert sample research projects
INSERT INTO research_projects (user_id, title, description, status, tags, created_at)
SELECT 
    u.id,
    'Sample Research Project',
    'This is a demonstration project to showcase the platform capabilities.',
    'active',
    ARRAY['demo', 'research', 'sample'],
    NOW()
FROM users u 
WHERE u.email = 'demo@researchhub.com';

-- Insert sample notes
INSERT INTO research_notes (user_id, title, content, type, tags, created_at)
SELECT 
    u.id,
    'Welcome to The Research Hub',
    'This is your first note! You can create, edit, and organize your research notes here. Use tags to categorize your notes and make them easily searchable.',
    'research',
    ARRAY['welcome', 'getting-started'],
    NOW()
FROM users u 
WHERE u.email = 'demo@researchhub.com';
