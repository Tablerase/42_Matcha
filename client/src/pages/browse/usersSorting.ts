import { SortUser, User, Tag, Order } from "@/app/interfaces";

export const sortUsersByCommonTags = (
  users: User[],
  commonTagsOrder: Order,
  tags: Tag[]
): User[] => {
  let sortedUsers: SortUser[] = users;
  // Make a score for each user based on common tags
  sortedUsers.forEach((user) => {
    let tagsScore = 0;
    tags.forEach((tag) => {
      if (user.tags.find((userTag) => userTag.tag === tag.tag)) {
        tagsScore++;
      }
    });
    user.commonTags = tagsScore;
  });
  // Sort users by score
  if (commonTagsOrder === Order.asc) {
    sortedUsers.sort((a, b) => a.commonTags! - b.commonTags!);
  } else {
    sortedUsers.sort((a, b) => b.commonTags! - a.commonTags!);
  }
  return sortedUsers;
};
