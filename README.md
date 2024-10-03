# Dosiero

Esperanto for `file`.


[Database Layout](https://dbdiagram.io/e/66f88f6c3430cb846cf0e19e/66f8a3ac3430cb846cf1742c)


## Roles

A `Role` is essentially a permission level applied to a specific user. Each
role has a human readable `name` and an `accessLevel`, where the level is an
integer where the lower the level, the higher the level of access allowed.

Per standard Unix conversion, an access level of `0` is admin. Currently
decided upon roles are, at a minimum:

- `admin`, `accessLevel` = 0
- `superuser`, `accessLevel` = 1
- `user`, `accessLevel` = 2

The distinction between `superuser` and `user` is solely that users that have
been flagged as a `superuser` are not subject to having their accounts
potentially purged due to inactivity, whereas a regular `user` could be culled.


## Users

`User` entries are explicitly created when someone signs up. Our `userId` is
the underlying unique value provided by the external authentication system,
allowing us to cross reference our own records with that of that system.

Each `User` has a specific `role` associated with them. Only a user whose role
is `admin` can adjust the levels of other users, and by default all users are
created at a level of `user`.  This includes the initial user created during
deployment, which requires that direct DB access be used to elevate at least
one account to `admin`.

A `User` whose role is `user` is potentially subject to having their account
culled due to inactivity if no login is registered within some specific period
of time. This could entail:

- Removal of the user as well as all of their public and private content
- Removal of the user and all private content, but public content is adjusted to
  be owned by a "system" account so it remains.

The design of this aspect is not fully finalized as of yet.

Users require a validated email account so that they can be warned if their
account is going to be culled.

- Perhaps a property of a user is either the maximum number of `Dossier` they
  can create, and/or the total number of `Revision` that is allowed per
  `Dossier`, just as a limit. In such a case, `SuperUser` would either have no
  limit or a higher limit.


## Dossiers

The `Dossier` is the record of a set of files in the system. They're flagged
with metadata such as who made them and when.

Every `Dossier` has at least one revision, created at the point at which it was
created. Edits to any files cause a new revision to be created, which is then
updated directly into the `Dossier` itself.

Edits to a `Dossier` require a new `Revision`, and at this point the last
update time is also bumped to track when this happened. This will be the same
as the creation date of the `Revision` itself.


## Revisions

A `Revision` is a simple holding record that provides a unique identifier for a
set of files. It contains a reference to its parent `Dossier` as well as to its
specific `revisionNumber`, both of which are recorded (or updated in) a
`Dossier` record.


## Content

An entry in the `Content` table represents a file that is part of a `Dossier`,
which is stored in an `R2` bucket. A variety of metadata items are recorded for
each file, which includes a reference to the `Revision` and underlying
`Dossier` that they belong to. The reference to the `Dossier` is purely to
facilitate being able to more easily purge records when a `Dossier` is removed.

When a file is newly added to a `Revision`, an entry is created to track it and
its content is stored in `R2`, with the key that was used tracked in the
`Content` table entry. This also gives it a `lastUpdate` time, which is also
tracked as the `creation` time of the `Revision` and the `lastUpdate` time of
the `Dossier` itself.

It is possible for a `Revision` to leave some content untouched; when this
happens a new `Content` entry is created with information that duplicates the
previous revision, but which refers to the new parent revision. In this case,
the update time is not modified (since the file is not updated).

This allows us, at the cost of an extra row in the database, a more generic
structure that does not waste R2 space unnecessarily.


## Design Notes

All of the primary keys that are of type `TEXT` are a unique `nanoID` with a
single character prefix added on that denotes what type of identifier it is.
This allows us to use the `nanoId` in a `/view` call as a parameter and be able
to tell based on the ID if we should be looking for a `Dossier`, a `Revision`
or a specific `Content` item to display.


### Purging users

Since this will ultimately be publicly user facing, the ability to purge a user
should be added, in order to cull people that never log in, since they just
clog the system.

To this end, the current notion is that based on the `Role` assigned, an
ongoing scheduled `CRON` job can detect if the lag between when a user last
logged in and the current time has passed some initial threshold. If it has,
then we can ship a warning for that user. The same automated job can do the
actual culling as well.

When purging a user (or just deleting a `Dossier` in general) the list of R2
keys that contain the contents of any affected `Dossier` is captured and
written to a table with a future timestamp. The purge `CRON` job will delete
from R2 (or attempt to) all access keys in the purge table whose purge date has
passed.


### Viewing data

The `/view` call reacts to whether or not the caller is the owner of the
Dossier, which controls what information is returned back. This in turn allows
the client UI portion to display as appropriate.


#### As the owner

- An ID will display either a single content item, a single revision, or the
  dossier as a whole
- Each page contains full information, has controls to make edits, and has the
  ability to go "up" the hierarchy


#### As a viewer

- An ID will display only pertinent information for the specific content type;
  no indication as to who the owner is, what the revision is or how many
  revisions there might be is neither conveyed nor displayed.

This allows for a sharing system whereby even a secret item can be publicly
shared via a short URL, and allows the owner to link either to a specific file,
a specific revision, or information on the `Dossier` as a whole (which is the
same as a `Revision` but has slighly more information to convey.)

