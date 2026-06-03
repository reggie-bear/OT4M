-- OT4M YouTube Search Schema
-- Run this once in the Supabase SQL editor

create extension if not exists vector;

create table ot4m_videos (
  id               text primary key,
  title            text not null,
  published_at     timestamptz,
  thumbnail_url    text,
  duration_seconds int,
  synced_at        timestamptz default now()
);

create table ot4m_chunks (
  id              uuid primary key default gen_random_uuid(),
  video_id        text references ot4m_videos(id) on delete cascade,
  chunk_index     int not null,
  timestamp_start int not null,
  timestamp_end   int not null,
  text            text not null,
  embedding       vector(3072),
  created_at      timestamptz default now()
);

create index on ot4m_chunks using hnsw (embedding vector_cosine_ops);

-- Search function called by the API route
create or replace function search_ot4m(query_embedding vector(3072), match_count int default 8)
returns table (
  video_id        text,
  title           text,
  thumbnail_url   text,
  timestamp_start int,
  text            text,
  similarity      float
)
language sql stable
as $$
  select
    c.video_id,
    v.title,
    v.thumbnail_url,
    c.timestamp_start,
    c.text,
    1 - (c.embedding <=> query_embedding) as similarity
  from ot4m_chunks c
  join ot4m_videos v on v.id = c.video_id
  where 1 - (c.embedding <=> query_embedding) > 0.6
  order by c.embedding <=> query_embedding
  limit match_count;
$$;
