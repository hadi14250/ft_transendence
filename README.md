# ft_transcendence

Web
◦ Major module: Use a Framework as backend.
◦ Minor module: Use a front-end framework or toolkit.
◦ Minor module: Use a database for the backend.

User Management
◦ Major module: Standard user management, authentication, users across tournaments.
◦ Major module: Implementing a remote authentication.

Gameplay and user experience
◦ Major module: Multiplayers (more than 2 in the same game).

Accessibility
<<<<<<< HEAD
◦ Minor module: Expanding Browser Compatibility.
◦ Minor module: Multiple language supports.
◦ Minor module: Add accessibility for Visually Impaired Users.
◦ Minor module: Server-Side Rendering (SSR) Integration.


SURPRISE!
=======
- Minor module: Expanding Browser Compatibility.
- Minor module: Multiple language supports.


# API DOC

`POST` /api/loginWithIntra
## Request
```
{
  code: "I43HBU94H939H439UFH32FD2F2"
}
```
## Reponse
```
{
  status: "OK"
  access-token: "VU3RVY832RFV8238F2IFJ3WIBFU33F3F"
}
```

`GET` /api/me
## Header
```
{
  access-token: "VU3RVY832RFV8238F2IFJ3WIBFU33F3F"
}
```
## Response
```
{
  username: "fkhan",
  is2faEnabled: false,
  language: "EN"
}
```

`POST` /api/save-prefs
## Header
```
{
  access-token: "VU3RVY832RFV8238F2IFJ3WIBFU33F3F"
}
```
## Request
```
{
  is2faEnabled: true,
  language: "EN"
}
```
## Response
```
{
  status: "OK"
}
```
>>>>>>> origin
