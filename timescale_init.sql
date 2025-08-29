CREATE EXTENSION IF NOT EXISTS timescaledb;

SELECT create_hypertable('"Trade"', 'timestamp', if_not_exists => TRUE);
------------------------------------------------------
-- 1m candles
------------------------------------------------------
DROP MATERIALIZED VIEW IF EXISTS candle_1m CASCADE;

CREATE MATERIALIZED VIEW candle_1m
WITH (timescaledb.continuous) AS
SELECT
  time_bucket('1 minute', timestamp) AS bucket,
  symbol,
  first(price, timestamp) AS open,
  max(price) AS high,
  min(price) AS low,
  last(price, timestamp) AS close,
  count(*) AS trades
FROM "Trade"
GROUP BY bucket, symbol
WITH NO DATA;

SELECT add_continuous_aggregate_policy('candle_1m',
    start_offset => INTERVAL '7 days',
    end_offset   => INTERVAL '1 minute',
    schedule_interval => INTERVAL '1 minute');

------------------------------------------------------
-- 5m candles
------------------------------------------------------
DROP MATERIALIZED VIEW IF EXISTS candle_5m CASCADE;

CREATE MATERIALIZED VIEW candle_5m
WITH (timescaledb.continuous) AS
SELECT
  time_bucket('5 minutes', timestamp) AS bucket,
  symbol,
  first(price, timestamp) AS open,
  max(price) AS high,
  min(price) AS low,
  last(price, timestamp) AS close,
  count(*) AS trades
FROM "Trade"
GROUP BY bucket, symbol
WITH NO DATA;

SELECT add_continuous_aggregate_policy('candle_5m',
    start_offset => INTERVAL '7 days',
    end_offset   => INTERVAL '5 minutes',
    schedule_interval => INTERVAL '5 minutes');

------------------------------------------------------
-- 15m candles
------------------------------------------------------
DROP MATERIALIZED VIEW IF EXISTS candle_15m CASCADE;

CREATE MATERIALIZED VIEW candle_15m
WITH (timescaledb.continuous) AS
SELECT
  time_bucket('15 minutes', timestamp) AS bucket,
  symbol,
  first(price, timestamp) AS open,
  max(price) AS high,
  min(price) AS low,
  last(price, timestamp) AS close,
  count(*) AS trades
FROM "Trade"
GROUP BY bucket, symbol
WITH NO DATA;

SELECT add_continuous_aggregate_policy('candle_15m',
    start_offset => INTERVAL '14 days',
    end_offset   => INTERVAL '15 minutes',
    schedule_interval => INTERVAL '15 minutes');

------------------------------------------------------
-- 1h candles
------------------------------------------------------
DROP MATERIALIZED VIEW IF EXISTS candle_1h CASCADE;

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

SELECT add_continuous_aggregate_policy('candle_1h',
    start_offset => INTERVAL '30 days',
    end_offset   => INTERVAL '1 hour',
    schedule_interval => INTERVAL '1 hour');

------------------------------------------------------
-- 4h candles
------------------------------------------------------
DROP MATERIALIZED VIEW IF EXISTS candle_4h CASCADE;

CREATE MATERIALIZED VIEW candle_4h
WITH (timescaledb.continuous) AS
SELECT
  time_bucket('4 hours', timestamp) AS bucket,
  symbol,
  first(price, timestamp) AS open,
  max(price) AS high,
  min(price) AS low,
  last(price, timestamp) AS close,
  count(*) AS trades
FROM "Trade"
GROUP BY bucket, symbol
WITH NO DATA;

SELECT add_continuous_aggregate_policy('candle_4h',
    start_offset => INTERVAL '90 days',
    end_offset   => INTERVAL '4 hours',
    schedule_interval => INTERVAL '4 hours');

------------------------------------------------------
-- 1d candles
------------------------------------------------------
DROP MATERIALIZED VIEW IF EXISTS candle_1d CASCADE;

CREATE MATERIALIZED VIEW candle_1d
WITH (timescaledb.continuous) AS
SELECT
  time_bucket('1 day', timestamp) AS bucket,
  symbol,
  first(price, timestamp) AS open,
  max(price) AS high,
  min(price) AS low,
  last(price, timestamp) AS close,
  count(*) AS trades
FROM "Trade"
GROUP BY bucket, symbol
WITH NO DATA;

SELECT add_continuous_aggregate_policy('candle_1d',
    start_offset => INTERVAL '365 days',
    end_offset   => INTERVAL '1 day',
    schedule_interval => INTERVAL '1 day');
