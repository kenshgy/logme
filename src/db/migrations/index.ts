const initialSQL = `
CREATE TABLE \`categories\` (
  \`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  \`name\` text NOT NULL,
  \`icon\` text NOT NULL,
  \`color\` text NOT NULL,
  \`input_type\` text NOT NULL,
  \`unit\` text,
  \`sort_order\` integer DEFAULT 0 NOT NULL,
  \`is_system\` integer DEFAULT false NOT NULL,
  \`is_active\` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE \`log_entries\` (
  \`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  \`category_id\` integer NOT NULL,
  \`date\` text NOT NULL,
  \`started_at\` text,
  \`ended_at\` text,
  \`duration_min\` integer,
  \`numeric_value\` real,
  \`text_value\` text,
  \`rating\` integer,
  \`note\` text,
  \`created_at\` text NOT NULL,
  \`updated_at\` text NOT NULL,
  FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE \`daily_notes\` (
  \`date\` text PRIMARY KEY NOT NULL,
  \`note\` text,
  \`mood\` integer
);
--> statement-breakpoint
CREATE TABLE \`app_settings\` (
  \`key\` text PRIMARY KEY NOT NULL,
  \`value\` text NOT NULL
);
`;

export default {
  journal: {
    entries: [
      {
        idx: 0,
        when: 1740000000000,
        tag: '0000_initial',
        breakpoints: true,
      },
    ],
  },
  migrations: {
    '0000_initial': initialSQL,
  },
};
