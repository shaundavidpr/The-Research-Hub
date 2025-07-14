#!/usr/bin/env python3
"""
Sample Data Seeder for The Research Hub
Generates realistic sample data for testing and demonstration
"""

import os
import sys
import json
import random
from datetime import datetime, timedelta
from typing import List, Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
import bcrypt

# Database connection
def get_db_connection():
    """Get database connection using environment variables"""
    try:
        conn = psycopg2.connect(
            host=os.getenv('PGHOST', 'localhost'),
            database=os.getenv('PGDATABASE', 'research_hub'),
            user=os.getenv('PGUSER', 'postgres'),
            password=os.getenv('PGPASSWORD', ''),
            port=os.getenv('PGPORT', '5432')
        )
        return conn
    except Exception as e:
        print(f"Error connecting to database: {e}")
        sys.exit(1)

# Sample data generators
class DataGenerator:
    def __init__(self):
        self.research_fields = [
            "Computer Science", "Biology", "Chemistry", "Physics", "Mathematics",
            "Psychology", "Medicine", "Engineering", "Environmental Science", "Economics"
        ]
        
        self.institutions = [
            "Stanford University", "MIT", "Harvard University", "UC Berkeley",
            "Oxford University", "Cambridge University", "ETH Zurich", "Tokyo University",
            "Max Planck Institute", "CERN", "NIH", "NASA Goddard"
        ]
        
        self.research_interests = [
            "Machine Learning", "Artificial Intelligence", "Quantum Computing", "Genomics",
            "Climate Change", "Neuroscience", "Robotics", "Biotechnology", "Nanotechnology",
            "Data Science", "Cybersecurity", "Renewable Energy", "Space Exploration",
            "Drug Discovery", "Materials Science", "Computational Biology"
        ]
        
        self.methodologies = [
            "Experimental Design", "Statistical Analysis", "Computational Modeling",
            "Machine Learning", "Qualitative Research", "Quantitative Analysis",
            "Literature Review", "Case Studies", "Surveys", "Interviews",
            "Laboratory Experiments", "Field Studies", "Meta-Analysis"
        ]
        
        self.project_titles = [
            "Novel Approaches to {field} Research",
            "Investigating {topic} in {field}",
            "Advanced {method} for {application}",
            "Computational Analysis of {phenomenon}",
            "Machine Learning Applications in {domain}",
            "Sustainable Solutions for {problem}",
            "Next-Generation {technology} Development",
            "Interdisciplinary Study of {concept}",
            "Optimization of {process} Using {technique}",
            "Predictive Modeling for {outcome}"
        ]
        
        self.note_titles = [
            "Initial Research Findings",
            "Literature Review Summary",
            "Methodology Notes",
            "Experimental Results",
            "Meeting Notes - {date}",
            "Research Ideas and Hypotheses",
            "Data Analysis Observations",
            "Conference Notes",
            "Collaboration Discussion",
            "Future Research Directions"
        ]

    def generate_users(self, count: int = 50) -> List[Dict[str, Any]]:
        """Generate sample users"""
        users = []
        for i in range(count):
            first_names = ["John", "Jane", "Michael", "Sarah", "David", "Emily", "Robert", "Lisa", "James", "Maria"]
            last_names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"]
            
            first_name = random.choice(first_names)
            last_name = random.choice(last_names)
            
            user = {
                'name': f"Dr. {first_name} {last_name}",
                'email': f"{first_name.lower()}.{last_name.lower()}{i}@{random.choice(['university.edu', 'institute.org', 'research.gov'])}",
                'provider': random.choice(['email', 'google']),
                'email_verified': random.choice([True, False]),
                'created_at': datetime.now() - timedelta(days=random.randint(1, 365))
            }
            users.append(user)
        
        return users

    def generate_user_profiles(self, user_ids: List[int]) -> List[Dict[str, Any]]:
        """Generate user profiles for given user IDs"""
        profiles = []
        titles = ["Professor", "Associate Professor", "Assistant Professor", "Research Scientist", 
                 "Postdoctoral Researcher", "Graduate Student", "Research Fellow", "Principal Investigator"]
        
        for user_id in user_ids:
            profile = {
                'user_id': user_id,
                'title': random.choice(titles),
                'institution': random.choice(self.institutions),
                'department': f"Department of {random.choice(self.research_fields)}",
                'bio': f"Passionate researcher with {random.randint(3, 20)} years of experience in {random.choice(self.research_fields).lower()}. Focused on advancing knowledge through innovative research and collaboration.",
                'research_interests': random.sample(self.research_interests, random.randint(3, 6)),
                'methodologies': random.sample(self.methodologies, random.randint(2, 5)),
                'specializations': random.sample(self.research_interests, random.randint(2, 4)),
                'location': random.choice(["Boston, MA", "San Francisco, CA", "New York, NY", "London, UK", "Berlin, Germany", "Tokyo, Japan"]),
                'collaboration_open': random.choice([True, False]),
                'profile_completed': True,
                'created_at': datetime.now() - timedelta(days=random.randint(1, 300))
            }
            profiles.append(profile)
        
        return profiles

    def generate_projects(self, user_ids: List[int]) -> List[Dict[str, Any]]:
        """Generate research projects"""
        projects = []
        statuses = ['planning', 'active', 'completed', 'on_hold']
        
        for user_id in user_ids:
            num_projects = random.randint(1, 5)
            for _ in range(num_projects):
                field = random.choice(self.research_fields)
                topic = random.choice(self.research_interests)
                
                title_template = random.choice(self.project_titles)
                title = title_template.format(
                    field=field,
                    topic=topic,
                    method=random.choice(self.methodologies),
                    application=random.choice(self.research_interests),
                    phenomenon=topic,
                    domain=field,
                    problem=f"{topic} challenges",
                    technology=topic,
                    concept=topic,
                    process=f"{topic} optimization",
                    technique=random.choice(self.methodologies),
                    outcome=f"{topic} prediction"
                )
                
                status = random.choice(statuses)
                start_date = datetime.now() - timedelta(days=random.randint(30, 365))
                
                project = {
                    'user_id': user_id,
                    'title': title,
                    'description': f"This project aims to investigate {topic.lower()} using advanced {random.choice(self.methodologies).lower()} techniques. The research will contribute to our understanding of {field.lower()} and provide practical applications for the scientific community.",
                    'status': status,
                    'progress': random.randint(0, 100) if status != 'planning' else random.randint(0, 20),
                    'start_date': start_date,
                    'end_date': start_date + timedelta(days=random.randint(180, 730)),
                    'tags': random.sample([field.lower(), topic.lower()] + [m.lower().replace(' ', '-') for m in self.methodologies], random.randint(3, 6)),
                    'is_private': random.choice([True, False]),
                    'created_at': start_date
                }
                projects.append(project)
        
        return projects

    def generate_notes(self, user_ids: List[int], project_ids: List[int]) -> List[Dict[str, Any]]:
        """Generate research notes"""
        notes = []
        note_types = ['research', 'personal', 'meeting', 'idea']
        
        for user_id in user_ids:
            num_notes = random.randint(5, 20)
            for _ in range(num_notes):
                title_template = random.choice(self.note_titles)
                title = title_template.format(date=datetime.now().strftime("%Y-%m-%d"))
                
                content_templates = [
                    "Today's research session revealed interesting patterns in the data. The correlation between variables A and B is stronger than initially hypothesized. Need to investigate further with additional samples.",
                    "Literature review findings: Recent studies by Smith et al. (2023) and Johnson (2022) support our hypothesis. However, there's a gap in the research regarding long-term effects.",
                    "Experimental setup completed successfully. Initial results show promising trends. Statistical significance achieved with p < 0.05. Planning to expand sample size for validation.",
                    "Meeting with collaborators was productive. Discussed methodology improvements and timeline adjustments. Action items: 1) Revise protocol, 2) Collect additional data, 3) Schedule follow-up.",
                    "New research idea: What if we applied machine learning techniques to this problem? Could potentially improve accuracy by 20-30%. Worth exploring in next phase."
                ]
                
                note = {
                    'user_id': user_id,
                    'title': title,
                    'content': random.choice(content_templates),
                    'type': random.choice(note_types),
                    'tags': random.sample([t.lower().replace(' ', '-') for t in self.research_interests], random.randint(2, 5)),
                    'project_id': random.choice(project_ids + [None]) if project_ids else None,
                    'is_favorite': random.choice([True, False]),
                    'is_private': random.choice([True, False]),
                    'word_count': random.randint(50, 500),
                    'reading_time': random.randint(1, 10),
                    'created_at': datetime.now() - timedelta(days=random.randint(1, 180))
                }
                notes.append(note)
        
        return notes

    def generate_citations(self, user_ids: List[int]) -> List[Dict[str, Any]]:
        """Generate sample citations"""
        citations = []
        citation_types = ['article', 'book', 'website', 'conference', 'thesis', 'report']
        journals = [
            "Nature", "Science", "Cell", "The Lancet", "PNAS", "Nature Biotechnology",
            "IEEE Transactions", "ACM Computing Surveys", "Journal of Machine Learning Research",
            "Physical Review Letters", "Chemical Reviews", "Psychological Science"
        ]
        
        author_names = [
            "Smith, J.", "Johnson, A.", "Williams, M.", "Brown, S.", "Jones, R.",
            "Garcia, L.", "Miller, K.", "Davis, P.", "Rodriguez, C.", "Martinez, E.",
            "Anderson, T.", "Taylor, N.", "Thomas, D.", "Jackson, B.", "White, H."
        ]
        
        for user_id in user_ids:
            num_citations = random.randint(10, 50)
            for _ in range(num_citations):
                citation_type = random.choice(citation_types)
                year = random.randint(2015, 2024)
                authors = random.sample(author_names, random.randint(1, 4))
                
                title_templates = [
                    "Advanced {method} in {field}: A Comprehensive Study",
                    "Novel Approaches to {problem} Using {technique}",
                    "The Impact of {factor} on {outcome} in {domain}",
                    "Computational Analysis of {phenomenon} in {field}",
                    "Machine Learning Applications for {application}",
                    "Sustainable {solution} for {challenge} in {area}",
                    "Optimization of {process} Through {approach}",
                    "Predictive Modeling of {target} Using {method}"
                ]
                
                title = random.choice(title_templates).format(
                    method=random.choice(self.methodologies),
                    field=random.choice(self.research_fields),
                    problem=f"{random.choice(self.research_interests)} challenges",
                    technique=random.choice(self.methodologies),
                    factor=random.choice(self.research_interests),
                    outcome=f"{random.choice(self.research_interests)} outcomes",
                    domain=random.choice(self.research_fields),
                    phenomenon=random.choice(self.research_interests),
                    application=f"{random.choice(self.research_fields)} applications",
                    solution=f"{random.choice(self.research_interests)} solutions",
                    challenge=f"{random.choice(self.research_fields)} challenges",
                    area=random.choice(self.research_fields),
                    process=f"{random.choice(self.research_interests)} processes",
                    approach=random.choice(self.methodologies),
                    target=random.choice(self.research_interests)
                )
                
                citation = {
                    'user_id': user_id,
                    'type': citation_type,
                    'title': title,
                    'authors': authors,
                    'journal': random.choice(journals) if citation_type == 'article' else None,
                    'year': year,
                    'doi': f"10.{random.randint(1000, 9999)}/{random.choice(['nature', 'science', 'cell'])}.{year}.{random.randint(100000, 999999)}",
                    'pages': f"{random.randint(1, 50)}-{random.randint(51, 100)}" if citation_type == 'article' else None,
                    'volume': str(random.randint(1, 100)) if citation_type == 'article' else None,
                    'issue': str(random.randint(1, 12)) if citation_type == 'article' else None,
                    'tags': random.sample([t.lower().replace(' ', '-') for t in self.research_interests], random.randint(2, 4)),
                    'is_favorite': random.choice([True, False]),
                    'created_at': datetime.now() - timedelta(days=random.randint(1, 365))
                }
                citations.append(citation)
        
        return citations

def insert_sample_data():
    """Main function to insert all sample data"""
    print("🚀 Starting sample data generation...")
    
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        generator = DataGenerator()
        
        # Generate and insert users
        print("👥 Generating users...")
        users = generator.generate_users(50)
        user_ids = []
        
        for user in users:
            # Hash password for email users
            password_hash = None
            if user['provider'] == 'email':
                password_hash = bcrypt.hashpw("password123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            
            cursor.execute("""
                INSERT INTO users (name, email, password_hash, provider, email_verified, created_at)
                VALUES (%(name)s, %(email)s, %(password_hash)s, %(provider)s, %(email_verified)s, %(created_at)s)
                ON CONFLICT (email) DO NOTHING
                RETURNING id
            """, {**user, 'password_hash': password_hash})
            
            result = cursor.fetchone()
            if result:
                user_ids.append(result['id'])
        
        conn.commit()
        print(f"✅ Created {len(user_ids)} users")
        
        # Generate and insert user profiles
        print("📋 Generating user profiles...")
        profiles = generator.generate_user_profiles(user_ids)
        
        for profile in profiles:
            cursor.execute("""
                INSERT INTO user_profiles (
                    user_id, title, institution, department, bio, research_interests,
                    methodologies, specializations, location, collaboration_open,
                    profile_completed, created_at
                ) VALUES (
                    %(user_id)s, %(title)s, %(institution)s, %(department)s, %(bio)s,
                    %(research_interests)s, %(methodologies)s, %(specializations)s,
                    %(location)s, %(collaboration_open)s, %(profile_completed)s, %(created_at)s
                )
            """, profile)
        
        conn.commit()
        print(f"✅ Created {len(profiles)} user profiles")
        
        # Generate and insert projects
        print("📊 Generating research projects...")
        projects = generator.generate_projects(user_ids)
        project_ids = []
        
        for project in projects:
            cursor.execute("""
                INSERT INTO research_projects (
                    user_id, title, description, status, progress, start_date,
                    end_date, tags, is_private, created_at
                ) VALUES (
                    %(user_id)s, %(title)s, %(description)s, %(status)s, %(progress)s,
                    %(start_date)s, %(end_date)s, %(tags)s, %(is_private)s, %(created_at)s
                ) RETURNING id
            """, project)
            
            result = cursor.fetchone()
            if result:
                project_ids.append(result['id'])
        
        conn.commit()
        print(f"✅ Created {len(project_ids)} research projects")
        
        # Generate and insert notes
        print("📝 Generating research notes...")
        notes = generator.generate_notes(user_ids, project_ids)
        
        for note in notes:
            cursor.execute("""
                INSERT INTO research_notes (
                    user_id, title, content, type, tags, project_id, is_favorite,
                    is_private, word_count, reading_time, created_at
                ) VALUES (
                    %(user_id)s, %(title)s, %(content)s, %(type)s, %(tags)s,
                    %(project_id)s, %(is_favorite)s, %(is_private)s, %(word_count)s,
                    %(reading_time)s, %(created_at)s
                )
            """, note)
        
        conn.commit()
        print(f"✅ Created {len(notes)} research notes")
        
        # Generate and insert citations
        print("📚 Generating citations...")
        citations = generator.generate_citations(user_ids)
        
        for citation in citations:
            cursor.execute("""
                INSERT INTO citations (
                    user_id, type, title, authors, journal, year, doi, pages,
                    volume, issue, tags, is_favorite, created_at
                ) VALUES (
                    %(user_id)s, %(type)s, %(title)s, %(authors)s, %(journal)s,
                    %(year)s, %(doi)s, %(pages)s, %(volume)s, %(issue)s,
                    %(tags)s, %(is_favorite)s, %(created_at)s
                )
            """, citation)
        
        conn.commit()
        print(f"✅ Created {len(citations)} citations")
        
        # Generate some timeline events
        print("📅 Generating timeline events...")
        for project_id in project_ids[:20]:  # Only for first 20 projects
            cursor.execute("SELECT user_id FROM research_projects WHERE id = %s", (project_id,))
            user_id = cursor.fetchone()['user_id']
            
            event_types = ['milestone', 'deadline', 'meeting', 'presentation']
            priorities = ['low', 'medium', 'high']
            
            for _ in range(random.randint(1, 3)):
                cursor.execute("""
                    INSERT INTO timeline_events (
                        user_id, project_id, title, description, type, event_date,
                        priority, created_at
                    ) VALUES (
                        %s, %s, %s, %s, %s, %s, %s, %s
                    )
                """, (
                    user_id,
                    project_id,
                    f"Project {random.choice(event_types).title()}",
                    f"Important {random.choice(event_types)} for the research project.",
                    random.choice(event_types),
                    datetime.now() + timedelta(days=random.randint(1, 90)),
                    random.choice(priorities),
                    datetime.now()
                ))
        
        conn.commit()
        print("✅ Created timeline events")
        
        # Generate some social interactions
        print("👥 Generating social interactions...")
        for _ in range(100):  # 100 random follows
            follower_id = random.choice(user_ids)
            following_id = random.choice(user_ids)
            
            if follower_id != following_id:
                cursor.execute("""
                    INSERT INTO user_follows (follower_id, following_id, created_at)
                    VALUES (%s, %s, %s)
                    ON CONFLICT (follower_id, following_id) DO NOTHING
                """, (follower_id, following_id, datetime.now()))
        
        conn.commit()
        print("✅ Created social interactions")
        
        print("\n🎉 Sample data generation completed successfully!")
        print(f"📊 Summary:")
        print(f"   • {len(user_ids)} users created")
        print(f"   • {len(profiles)} user profiles created")
        print(f"   • {len(project_ids)} research projects created")
        print(f"   • {len(notes)} research notes created")
        print(f"   • {len(citations)} citations created")
        print(f"   • Timeline events and social interactions added")
        
    except Exception as e:
        print(f"❌ Error inserting sample data: {e}")
        conn.rollback()
        raise
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    insert_sample_data()
