# Sure Multi-User & Account Sharing

## Inviting a User

Go to **Settings → Profile → Household** section. Admins can invite others by email. Invitations expire after 3 days.

## Permission Levels

When you share an account with another user, you can set one of three permission levels:

| Level          | What they can do                                                          |
| -------------- | ------------------------------------------------------------------------- |
| `read_only`    | View transactions and account data only — no edits                        |
| `read_write`   | View + annotate (category, tags, merchant, notes) — can't change amounts  |
| `full_control` | Full view and edit access                                                  |

## How Sharing Works

- Sharing is configured **per account** — go to an account's detail page and look for "Account Sharing"
- You can share different accounts with different permission levels for the same user
- When you invite a user, existing accounts can be auto-shared with them
- The invited user can toggle whether a shared account is "included in their finances" (i.e. counted in their budgets/net worth)

## User Roles

Invited users get a **family role** too:

| Role         | Description                                                      |
| ------------ | ---------------------------------------------------------------- |
| `member`     | Standard access to what's been shared                            |
| `admin`      | Can also invite/remove users and manage sharing settings         |
| `guest`      | Limited intro UI access                                          |

For a read-only viewer, invite them as a `member`, then set `read_only` permission on each account you want them to see.
