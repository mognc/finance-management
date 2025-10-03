# Database Indexing Strategy

## Professional Index Management

### ❌ **What NOT to do:**
- Create all possible indexes upfront
- Index every column "just in case"
- Ignore index maintenance costs

### ✅ **Professional Approach:**

#### 1. **Start Minimal**
```sql
-- Only essential indexes for core functionality
CREATE INDEX idx_notes_user_id ON notes(user_id);        -- User queries
CREATE INDEX idx_notes_created_at ON notes(created_at);   -- Ordering
```

#### 2. **Monitor & Analyze**
```sql
-- Use PostgreSQL's query analysis
EXPLAIN ANALYZE SELECT * FROM notes WHERE user_id = '...' AND is_archived = false;

-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch 
FROM pg_stat_user_indexes 
WHERE tablename = 'notes';
```

#### 3. **Add Indexes Based on Evidence**
Only add indexes when you have:
- **Query performance issues**
- **Frequent filtering patterns**
- **Measurable performance gains**

#### 4. **Index Types by Use Case**

| Query Pattern | Index Type | Example |
|---------------|------------|---------|
| `WHERE user_id = ?` | B-tree | `CREATE INDEX idx_notes_user_id ON notes(user_id)` |
| `WHERE tags @> ?` | GIN | `CREATE INDEX idx_notes_tags ON notes USING GIN(tags)` |
| `WHERE user_id = ? AND is_archived = ?` | Composite | `CREATE INDEX idx_notes_user_archived ON notes(user_id, is_archived)` |
| `ORDER BY created_at DESC` | B-tree | `CREATE INDEX idx_notes_created_at ON notes(created_at)` |

#### 5. **Index Maintenance Costs**

| Index Type | Read Performance | Write Performance | Storage |
|------------|------------------|-------------------|---------|
| B-tree | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| GIN | ⭐⭐⭐ | ⭐ | ⭐⭐⭐ |
| Composite | ⭐⭐⭐ | ⭐ | ⭐⭐ |

### **Recommended Index Strategy for Notes Table:**

#### **Phase 1: Essential (Start Here)**
```sql
-- User queries (most common)
CREATE INDEX idx_notes_user_id ON notes(user_id);

-- Ordering (for pagination)
CREATE INDEX idx_notes_created_at ON notes(created_at);
```

#### **Phase 2: Add Based on Usage**
```sql
-- Only if tag searching becomes frequent
CREATE INDEX idx_notes_tags ON notes USING GIN(tags);

-- Only if category filtering is common
CREATE INDEX idx_notes_category ON notes(category);
```

#### **Phase 3: Composite Indexes (Advanced)**
```sql
-- Only if you frequently query user + status combinations
CREATE INDEX idx_notes_user_archived ON notes(user_id, is_archived);
CREATE INDEX idx_notes_user_favorite ON notes(user_id, is_favorite);
```

### **Monitoring Commands:**

```sql
-- Check which indexes are actually used
SELECT 
    schemaname, 
    tablename, 
    indexname, 
    idx_scan as "Times Used",
    idx_tup_read as "Tuples Read"
FROM pg_stat_user_indexes 
WHERE tablename = 'notes'
ORDER BY idx_scan DESC;

-- Find unused indexes
SELECT 
    schemaname, 
    tablename, 
    indexname
FROM pg_stat_user_indexes 
WHERE tablename = 'notes' 
AND idx_scan = 0;

-- Analyze query performance
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM notes 
WHERE user_id = '00000000-0000-0000-0000-000000000000' 
AND is_archived = false 
ORDER BY created_at DESC;
```

### **Migration Strategy:**

1. **Use database migrations** (not init.sql)
2. **Test indexes in staging** before production
3. **Monitor performance impact** after adding indexes
4. **Remove unused indexes** regularly

### **Production Checklist:**

- [ ] Start with minimal indexes
- [ ] Monitor query patterns for 1-2 weeks
- [ ] Add indexes only when performance issues arise
- [ ] Test index impact on write performance
- [ ] Set up monitoring for index usage
- [ ] Regular cleanup of unused indexes
