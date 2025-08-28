

//Inside Postgres container following commands should be executed to create hypertable

CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Convert the Trade table to a hypertable
SELECT create_hypertable(
    '"Trade"',          -- table name
    'timestamp',      -- time column
    chunk_time_interval => INTERVAL '1 day'  -- optional: chunk by day
);