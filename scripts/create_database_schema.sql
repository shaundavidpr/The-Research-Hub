-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255), -- For email/password auth
    avatar TEXT,
    provider VARCHAR(50), -- 'email', 'google', 'github'
    provider_id VARCHAR(255), -- External provider ID
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User profiles table for detailed research information
CREATE TABLE IF NOT EXISTS user_profiles (
    id SERIAL PRIMARY KEY,
    user_id TEXT REFERENCES neon_auth.users_sync(id) ON DELETE CASCADE,
    title VARCHAR(255),
    institution VARCHAR(255),
    department VARCHAR(255),
    bio TEXT,
    research_interests TEXT[],
    methodologies TEXT[],
    avatar_url TEXT,
    website_url TEXT,
    orcid_id VARCHAR(50),
    google_scholar_url TEXT,
    linkedin_url TEXT,
    twitter_handle VARCHAR(50),
    privacy_level VARCHAR(20) DEFAULT 'public',
    collaboration_open BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notes table for research notes
CREATE TABLE IF NOT EXISTS research_notes (
    id SERIAL PRIMARY KEY,
    user_id TEXT REFERENCES neon_auth.users_sync(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    content TEXT,
    tags TEXT[],
    project_id INTEGER,
    is_private BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table for research projects
CREATE TABLE IF NOT EXISTS research_projects (
    id SERIAL PRIMARY KEY,
    user_id TEXT REFERENCES neon_auth.users_sync(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active',
    start_date DATE,
    end_date DATE,
    collaborators TEXT[],
    tags TEXT[],
    is_private BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Files table for document management
CREATE TABLE IF NOT EXISTS research_files (
    id SERIAL PRIMARY KEY,
    user_id TEXT REFERENCES neon_auth.users_sync(id) ON DELETE CASCADE,
    filename VARCHAR(500) NOT NULL,
    original_filename VARCHAR(500) NOT NULL,
    file_type VARCHAR(100),
    file_size BIGINT,
    file_url TEXT,
    project_id INTEGER,
    tags TEXT[],
    description TEXT,
    is_private BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Citations table for reference management
CREATE TABLE IF NOT EXISTS citations (
    id SERIAL PRIMARY KEY,
    user_id TEXT REFERENCES neon_auth.users_sync(id) ON DELETE CASCADE,
    title VARCHAR(1000) NOT NULL,
    authors TEXT[],
    journal VARCHAR(500),
    year INTEGER,
    doi VARCHAR(255),
    url TEXT,
    citation_style VARCHAR(50) DEFAULT 'apa',
    formatted_citation TEXT,
    tags TEXT[],
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Timeline/Calendar events
CREATE TABLE IF NOT EXISTS timeline_events (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    project_id INTEGER REFERENCES research_projects(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    type VARCHAR(50) DEFAULT 'task', -- 'milestone', 'deadline', 'meeting', 'task'
    event_date TIMESTAMP NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high'
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Research papers/publications
CREATE TABLE IF NOT EXISTS papers (
    id SERIAL PRIMARY KEY,
    user_id TEXT REFERENCES neon_auth.users_sync(id) ON DELETE CASCADE,
    title VARCHAR(1000) NOT NULL,
    abstract TEXT,
    content TEXT,
    authors JSONB DEFAULT '[]',
    keywords JSONB DEFAULT '[]',
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
CREATE TABLE IF NOT EXISTS user_follows (
    id SERIAL PRIMARY KEY,
    follower_id TEXT REFERENCES neon_auth.users_sync(id) ON DELETE CASCADE,
    following_id TEXT REFERENCES neon_auth.users_sync(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(follower_id, following_id)
);

-- Social features - likes
CREATE TABLE IF NOT EXISTS paper_likes (
    id SERIAL PRIMARY KEY,
    user_id TEXT REFERENCES neon_auth.users_sync(id) ON DELETE CASCADE,
    paper_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, paper_id)
);

-- Comments on papers
CREATE TABLE IF NOT EXISTS research_comments (
    id SERIAL PRIMARY KEY,
    user_id TEXT REFERENCES neon_auth.users_sync(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_type VARCHAR(50) NOT NULL, -- 'note', 'project', 'paper'
    parent_id INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat messages for AI assistant
CREATE TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    response TEXT,
    context JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'new'
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_research_notes_user_id ON research_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_research_projects_user_id ON research_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_citations_user_id ON citations(user_id);
CREATE INDEX IF NOT EXISTS idx_research_files_user_id ON research_files(user_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_follower ON user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_following ON user_follows(following_id);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at);

-- Insert sample data for testing
INSERT INTO users (email, name, provider, created_at) VALUES 
('demo@researchhub.com', 'Demo User', 'email', NOW())
ON CONFLICT (email) DO NOTHING;
