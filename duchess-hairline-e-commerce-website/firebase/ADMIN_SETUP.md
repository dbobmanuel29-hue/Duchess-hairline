# Duchess Hairline Admin Setup

After creating the admin Firebase Authentication user, create this Firestore document:

Collection: `admins`
Document ID: the Firebase Authentication User UID.

For the current admin user:

`URf5i9Hrdid790mXZYQlijkiZSI2`

Fields:

```json
{
  "role": "admin",
  "active": true
}
```

Do not store passwords or service-account credentials in Firestore or this repository.
