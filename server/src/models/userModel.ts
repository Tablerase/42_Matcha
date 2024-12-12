export interface User {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
	password_hash: string;
	created_at: Date;
	updated_at: Date;
  }