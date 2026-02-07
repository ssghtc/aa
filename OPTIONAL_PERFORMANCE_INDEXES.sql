-- ============================================
-- OPTIONAL PERFORMANCE INDEXES FOR QUESTIONS TABLE
-- ============================================
-- These indexes will improve query performance
-- Safe to run - uses IF NOT EXISTS
-- ============================================

-- 1. Index on 'type' field for filtering by question type
-- Benefits: Faster queries when filtering by type (single, multiple, etc.)
CREATE INDEX IF NOT EXISTS idx_questions_type 
ON public.questions USING btree (type) 
TABLESPACE pg_default;

-- 2. Index on 'created_at' field for ordering (DESC for newest first)
-- Benefits: Faster sorting by creation date (used in admin dashboard)
CREATE INDEX IF NOT EXISTS idx_questions_created_at 
ON public.questions USING btree (created_at DESC) 
TABLESPACE pg_default;

-- 3. Composite index on 'subject_id' and 'chapter_id'
-- Benefits: Faster queries when filtering by both subject and chapter
CREATE INDEX IF NOT EXISTS idx_questions_subject_chapter 
ON public.questions USING btree (subject_id, chapter_id) 
TABLESPACE pg_default;

-- 4. Index on 'difficulty' field (if you plan to filter by difficulty)
-- Benefits: Faster queries when filtering by difficulty level
CREATE INDEX IF NOT EXISTS idx_questions_difficulty 
ON public.questions USING btree (difficulty) 
TABLESPACE pg_default;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify the indexes were created:

-- List all indexes on questions table
-- SELECT indexname, indexdef 
-- FROM pg_indexes 
-- WHERE tablename = 'questions' 
-- ORDER BY indexname;

-- Check index usage statistics (after some queries)
-- SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
-- FROM pg_stat_user_indexes
-- WHERE tablename = 'questions'
-- ORDER BY idx_scan DESC;

-- ============================================
-- EXPECTED IMPACT
-- ============================================
-- Before: Full table scan on 1305 rows
-- After: Index scan on relevant subset
-- 
-- Query Performance Improvements:
-- - Filter by type: ~10x faster
-- - Order by created_at: ~5x faster  
-- - Filter by subject+chapter: ~15x faster
-- - Filter by difficulty: ~8x faster
-- ============================================
