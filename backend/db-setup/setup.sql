CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  google_id VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  picture TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  role VARCHAR(10) NOT NULL CHECK (role IN ('user', 'staff'))
);


CREATE TABLE events (
  event_id SERIAL PRIMARY KEY,
  summary VARCHAR(255) NOT NULL,
  description TEXT,
  created_by INT REFERENCES users(user_id) ON DELETE SET NULL,
  start_date_time TIMESTAMP NOT NULL,
  start_time_zone TEXT NOT NULL,
  end_date_time TIMESTAMP NOT NULL,
  end_time_zone TEXT NOT NULL,
  img TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE oauth_tokens (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expiry_date TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE user_events (
  user_event_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  event_id INT REFERENCES events(event_id) ON DELETE CASCADE,
  signed_up_at TIMESTAMP DEFAULT NOW(),
  added_to_calendar BOOLEAN DEFAULT FALSE
);


