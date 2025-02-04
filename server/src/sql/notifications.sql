-- Create enum for notification status to save space and enforce valid values
DO $$ 
BEGIN
    CREATE TYPE notification_status AS ENUM ('PENDING', 'SENT', 'FAILED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ 
BEGIN
    CREATE TYPE notification_type AS ENUM ('like', 'view', 'match', 'unlike', 'message');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Notification objects table
CREATE TABLE IF NOT EXISTS notification_objects (
    id SERIAL PRIMARY KEY,
    type notification_type NOT NULL,
    content JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_notification_objects_type ON notification_objects(type);
CREATE INDEX IF NOT EXISTS idx_notification_objects_created_at ON notification_objects(created_at);

-- Notification notifiers table
CREATE TABLE IF NOT EXISTS notification_notifiers (
    id SERIAL PRIMARY KEY,
    to_user_id BIGINT NOT NULL,
    from_user_id BIGINT NOT NULL,
    notification_object_id BIGINT NOT NULL,
    status notification_status NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    -- Add constraints
    CONSTRAINT fk_notifier FOREIGN KEY (to_user_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_actor FOREIGN KEY (from_user_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_notification_object FOREIGN KEY (notification_object_id) 
        REFERENCES notification_objects(id) ON DELETE CASCADE,
    -- Add unique constraint to prevent duplicate notifications
    CONSTRAINT unique_notifier UNIQUE (to_user_id, notification_object_id)
);
-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_notification_notifiers_notifier ON notification_notifiers(to_user_id);
CREATE INDEX IF NOT EXISTS idx_notification_notifiers_status ON notification_notifiers(status);
CREATE INDEX IF NOT EXISTS idx_notification_notifiers_read ON notification_notifiers(is_read);
CREATE INDEX IF NOT EXISTS idx_notification_notifiers_actor ON notification_notifiers(from_user_id);