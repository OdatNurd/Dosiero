/******************************************************************************/


import { nanoid } from 'nanoid';

import { dbFetchOne } from '#db/common';


/******************************************************************************/


/* This takes as input a user object that comes from an Acheron authentication
 * function and which represents an authenticated user in the system and adds
 * a record for them in the database if possible.
 *
 * The return value is the newly assigned userId for the value. An error will be
 * thrown if this user already exists in the database. */
export async function dbUserAddNew(db, user) {
  // Create a new random userId for this user.
  const userId = nanoid();

  // Do the insert of the data; we don't actually care about the return on
  // this one, since all we need is the userId and we already have it.
  await dbFetchOne(db, 'user_add_new', `
    INSERT INTO Users(userId, acheronId, acheronProvider,
                              name, emailAddress, profileImage, role)
    VALUES(?1, ?2, ?3, ?4, ?5, ?6, (SELECT roleId from Roles WHERE name = 'user'));
  `, [userId, user.id, user.provider, user.username, user.email, user.avatar]);

  return userId;
}

/******************************************************************************/


/* Given an Acheron userId and authentication provider pair, try to look up and
 * return the userId for that user, if any.
 *
 * The return value will be the userId of the user if found, or null if there
 * is no such user known to the database.*/
export async function dbUserGetUserId(db, acheronId, acheronProvider) {
  const userInfo = await dbFetchOne(db, 'get_user_id', `
      SELECT userId from Users
       WHERE acheronId = ?1 AND acheronProvider = ?2
  `, [acheronId, acheronProvider]);

  return (userInfo === null) ? null : userInfo.userId;
}


/******************************************************************************/


/* Given an Acheron userIdf and authentication provider pair, try to look up and
 * return the full user details for that user, if any.
 *
 * The return value is either an object that describes the user, or null,
 * depending on whether or not the user exists. */
export async function dbGetUserDetails(db, acheronId, acheronProvider) {
  return await dbFetchOne(db, 'get_user_details', `
      SELECT A.userId, A.name, A.emailAddress, A.profileImage,
             B.name as role, B.accessLevel,
             A.signup, A.lastLogin, A.isActive
        FROM Users A, Roles B
       WHERE A.acheronId = ?1 AND A.acheronProvider = ?2
         AND A.role = B.roleId;
    `, [acheronId, acheronProvider]);
}


/******************************************************************************/
