export interface User {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	username: string;
	password: string;
	gender?: string;
	preferences?: string;
	dateOfBirth?: Date;
  }
