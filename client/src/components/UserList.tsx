import { UserListProps } from "@/app/interfaces";

export const UserList = ({users}: UserListProps) => {
    return (
        <div>
            {users && users.map((user) => (
                <div key={user.id}>
                    <p>{user.username}</p>      
                </div>
            ))}
        </div>
    );
};