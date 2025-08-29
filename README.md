

//Inside Postgres container following commands should be executed to create hypertable

CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Convert the Trade table to a hypertable
SELECT create_hypertable(
    '"Trade"',          -- table name
    'timestamp',      -- time column
    chunk_time_interval => INTERVAL '1 day'  -- optional: chunk by day
);

Run in DB

CREATE MATERIALIZED VIEW candle_1h
WITH (timescaledb.continuous) AS
SELECT
  time_bucket('1 hour', timestamp) AS bucket,
  symbol,
  first(price, timestamp) AS open,
  max(price) AS high,
  min(price) AS low,
  last(price, timestamp) AS close,
  count(*) AS trades
FROM "Trade"
GROUP BY bucket, symbol
WITH NO DATA;

-- add auto-refresh policy
SELECT add_continuous_aggregate_policy('candle_1h',
    start_offset => INTERVAL '1 day',
    end_offset   => INTERVAL '1 hour',
    schedule_interval => INTERVAL '1 hour');

Repeat for candle_5m, candle_15m, candle_1h, etc.



//command to run to apply sql -> docker exec -i <container_name> psql -U postgres -d <db_name> < ./timescale_init.sql
