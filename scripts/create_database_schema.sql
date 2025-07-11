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
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    title VARCHAR(100),
    institution VARCHAR(255),
    department VARCHAR(255),
    bio TEXT,
    avatar TEXT,
    
    -- Academic Information
    degree VARCHAR(100),
    field VARCHAR(255),
    advisor VARCHAR(255),
    year_started INTEGER,
    orcid VARCHAR(50),
    google_scholar TEXT,
    
    -- Research Interests (stored as JSON arrays)
    research_topics JSONB DEFAULT '[]',
    methodologies JSONB DEFAULT '[]',
    specializations JSONB DEFAULT '[]',
    
    -- Privacy & Preferences
    profile_visibility VARCHAR(50) DEFAULT 'public',
    allow_messages BOOLEAN DEFAULT TRUE,
    allow_collaboration BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT TRUE,
    research_updates BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Notes table for research notes
CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    content TEXT,
    type VARCHAR(50) DEFAULT 'research', -- 'research', 'personal'
    tags JSONB DEFAULT '[]',
    project_id INTEGER,
    is_favorite BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Projects table for research projects
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'planning', -- 'planning', 'active', 'completed', 'archived'
    progress INTEGER DEFAULT 0,
    start_date DATE,
    end_date DATE,
    collaborators JSONB DEFAULT '[]',
    tags JSONB DEFAULT '[]',
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Files table for document management
CREATE TABLE IF NOT EXISTS files (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(500) NOT NULL,
    type VARCHAR(100),
    size BIGINT,
    url TEXT NOT NULL,
    project_id INTEGER REFERENCES projects(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}', -- title, authors, abstract, keywords, doi
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Citations table for reference management
CREATE TABLE IF NOT EXISTS citations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'article', 'book', 'website', 'conference'
    title VARCHAR(1000) NOT NULL,
    authors JSONB DEFAULT '[]',
    journal VARCHAR(500),
    year INTEGER,
    doi VARCHAR(255),
    url TEXT,
    pages VARCHAR(50),
    volume VARCHAR(50),
    issue VARCHAR(50),
    publisher VARCHAR(500),
    tags JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Timeline/Calendar events
CREATE TABLE IF NOT EXISTS timeline_events (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
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
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
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
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Social features - follows
CREATE TABLE IF NOT EXISTS follows (
    id SERIAL PRIMARY KEY,
    follower_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    following_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(follower_id, following_id)
);

-- Social features - likes
CREATE TABLE IF NOT EXISTS likes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    paper_id INTEGER REFERENCES papers(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, paper_id)
);

-- Comments on papers
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    paper_id INTEGER REFERENCES papers(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_id INTEGER REFERENCES comments(id) ON DELETE CASCADE, -- For replies
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Chat messages for AI assistant
CREATE TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    response TEXT,
    context JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_files_user_id ON files(user_id);
CREATE INDEX IF NOT EXISTS idx_citations_user_id ON citations(user_id);
CREATE INDEX IF NOT EXISTS idx_timeline_events_user_id ON timeline_events(user_id);
CREATE INDEX IF NOT EXISTS idx_papers_user_id ON papers(user_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_paper_id ON likes(paper_id);
CREATE INDEX IF NOT EXISTS idx_comments_paper_id ON comments(paper_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);

-- Insert sample data for testing
INSERT INTO users (email, name, provider, created_at) VALUES 
('demo@researchhub.com', 'Demo User', 'email', NOW())
ON CONFLICT (email) DO NOTHING;
