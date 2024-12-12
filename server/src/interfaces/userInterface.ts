export interface User {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
	username: string;
	password_hash: string;
	gender?: string;
	preferences?: string;
	date_of_birth?: Date;
  }