--------------------------------------------------------------------------------
--- C L E A N U P --------------------------------------------------------------
--------------------------------------------------------------------------------

DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Roles;


--------------------------------------------------------------------------------
-- U S E R   I N F O R M A T I O N ---------------------------------------------
--------------------------------------------------------------------------------

-- Each user that is known to the system has a role assigned to them that
-- outlines how different parts of the system act towards that user.
--
-- Each role has a numeric access level assigned to it, which is what is used to
-- actually control the role system; the lower the value, the higher the access
-- level.
CREATE TABLE IF NOT EXISTS Roles (
    roleId TEXT UNIQUE PRIMARY KEY,
    name TEXT NOT NULL,

    accessLevel INTEGER NOT NULL
);



--------------------------------------------------------------------------------


-- Each user that is known to the system is tracked by an entry in this table.
--
-- Internally, each user has a unique nanoid identifier created for them at the
-- time they are added to the table.
--
-- Externally, we use Acheron as our authentication back end. Acheron supports
-- multiple authentication back ends, so the table here tracks the unique keys
-- that are provided to us, allowing for a potential mixed authentication system
-- to be used.
--
-- Currently the disambiguating factor is the Acheron information, which means
-- that logging in via different methods can cause the same user to appear twice
-- in the list even if their other details are the same. This is because not all
-- supported back ends guarantee the email address will be set.
--
-- Runtime support could be added to merge users together if it was known they
-- were the same user logging in via multiple methods.
CREATE TABLE IF NOT EXISTS Users (
    userId TEXT UNIQUE PRIMARY KEY,
    role TEXT REFERENCES Roles(roleId) DEFAULT('rVBBPOUWqPbWBmiUQuwGs'),

    acheronId TEXT NOT NULL,
    acheronProvider TEXT TEXT NOT NULL,

    name TEXT NOT NULL,
    emailAddress TEXT NOT NULL DEFAULT(''),
    profileImage TEXT NOT NULL DEFAULT(''),

    -- Default the signup and login times to whatever the current time is when
    -- the record is created
    signup DATETIME NOT NULL DEFAULT(strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    lastLogin DATETIME NOT NULL DEFAULT(strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),

    isActive BOOLEAN NOT NULL DEFAULT(true)
);

-- We need to be able to look up a user not only by their ID, but also by the
-- external Acheron authentication method, so that we can cross associate the
-- two.
CREATE UNIQUE INDEX idx_auth_acheron on Users(acheronId, acheronProvider);


--------------------------------------------------------------------------------
