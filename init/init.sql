-- Register the workers
SELECT * FROM master_add_node('worker1', 5432);
SELECT * FROM master_add_node('worker2', 5432);

-- Create and distribute your table
-- CREATE TABLE IF NOT EXISTS "user" (
--   id UUID PRIMARY KEY,
--   email TEXT ,
--   password TEXT,
--   name TEXT,
--   provider TEXT,
--   providerId TEXT,
--   createdAt TIMESTAMP DEFAULT now(),
--   updatedAt TIMESTAMP DEFAULT now()
-- );

-- Shard by `id`
SELECT create_distributed_table('User', 'id');
