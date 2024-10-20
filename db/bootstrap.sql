--------------------------------------------------------------------------------
-- D A T A   B O O T S T R A P P I N G -----------------------------------------
--------------------------------------------------------------------------------


-- Set up a distinct list of known roles in the system.
--   * "admin" has full site admin rights
--   * "superuser" is as a regular user, but with some extra privileges like
--                 having an account that does not expire.
--   * "user" is a regular user
-- Set up the distinct list of known roles in the system.
INSERT INTO Roles(roleId, name, accessLevel)
  VALUES
    ('SctYBZqwLgiuNgZgkATsZ', 'admin',     0),
    ('NJYiqxe2rkiFuAmu3DJDD', 'superuser', 1),
    ('rVBBPOUWqPbWBmiUQuwGs', 'user',      2)
  ;


-- Insert an initial user to be the administrator. Unless you're the person that
-- wrote this software, you probably want to change this if you run your own
-- version, unless you'd like OdatNurd to be an administrator on your site.
INSERT INTO Users(userId, role, acheronId, acheronProvider, name, emailAddress, profileImage )
  VALUES
    ('XHmX-SwOs-r-CVfbFpDq3', 'SctYBZqwLgiuNgZgkATsZ',
        '13212876', 'github',
        'OdatNurd', 'odatnurd@gmail.com', 'https://avatars.githubusercontent.com/u/13212876?v=4')
    ;


--------------------------------------------------------------------------------
