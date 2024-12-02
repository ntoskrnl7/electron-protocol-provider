# electron-protocol-provider

`electron-protocol-provider` is a library for managing custom protocol routing in Electron. It allows you to register custom protocols and define routes with various HTTP methods like `GET`, `POST`, `DELETE`, etc. The library also supports privilege-based authentication and can easily integrate with a custom context.

- [electron-protocol-provider](#electron-protocol-provider)
  - [Installation](#installation)
  - [Basic Usage](#basic-usage)
    - [Example 1: Simple Routing](#example-1-simple-routing)
    - [Example 2: Routing with Privileges](#example-2-routing-with-privileges)
      - [Explanation](#explanation)

## Installation

To install the `electron-protocol-provider` package, use npm or yarn:

```bash
npm install electron-protocol-provider
# or
yarn add electron-protocol-provider
```

## Basic Usage

Below is an example of how to use the ProtocolProvider to register custom protocols and handle routing with basic parameters.

### Example 1: Simple Routing

```ts
import { ProtocolProvider, ProtocolRouter } from 'electron-protocol-provider';

ProtocolProvider
  .register({ scheme: 'hello' },
    () => new ProtocolRouter()
      .get('/:name/:message', ({ params: { name, message } }) => {
        return new Response(`hello ${name} - ${message} :)`);
      })
  )
  .apply();
```

In this example:

- The hello scheme is registered.
- A route is defined for GET requests with two path parameters: name and message.
- A response is sent back with a simple message including the parameters.

### Example 2: Routing with Privileges

In this example, routing is defined with user authentication and privileges. Each route can check if the user has the necessary privileges before allowing access.

```ts
interface User {
  id: number;
  name: string;
  level: 'public' | 'private' | 'admin'
};
type Privilege<T> = {
  method: 'get';
  filter: (v: T) => boolean;
} | {
  method: 'post';
  filter: (v: T) => void;
};
interface Privileges { user: Privilege<User>[] }

const authenticate = (request: Request): { privileges: Privileges } => {
  const authorization = request.headers.get('Authorization');
  if (authorization === null) {
    throw new Error('Authorization header missing. Passing control to the next handler.');
  }
  return {
    privileges: {
      user: [
        { method: 'get', filter: (user: User) => user.level !== 'admin' },
        { method: 'post', filter: (user: User) => { user.level = 'public'; } }
      ]
    }
  };
}

const users: User[] = [
  { id: 0, name: 'JK.LEE', level: 'admin' },
  { id: 0, name: 'Alice', level: 'private' },
  { id: 1, name: 'Bob', level: 'public' },
  { id: 2, name: 'Carol', level: 'private' },
  { id: 3, name: 'Dave', level: 'public' },
  { id: 4, name: 'Eve', level: 'public' }
];

ProtocolProvider
  .register(
    { scheme: 'my-app', privileges: { supportFetchAPI: true } },
    () => new ProtocolRouter(req => ({ authContext: authenticate(req) }))
      .get('/user/:id', ({ params: { id } }, { authContext }) => {
        if (authContext.privileges.user?.find(v => v.method === 'get') === undefined) {
          return Response.json({ message: 'invalid request' }, { status: 401 })
        }
        return Response.json(users.find(user => user.id === Number(id)));
      })
      .get('/user/:id', ({ params: { id } }) => {
        const found = users.filter(user => user.level === 'public').find(user => user.id === Number(id));
        if (found === undefined) {
          return Response.json({ message: `${id} not found` }, { status: 404 });
        }
        return Response.json(found)
      })
      .get('/user', (_, { authContext }) => {
        const priv = authContext.privileges.user?.find(v => v.method === 'get');
        if (priv === undefined) {
          return Response.json({ message: 'invalid request' }, { status: 401 })
        }
        return Response.json(priv.filter ? users.filter(priv.filter) : users);
      })
      .get('/user', () => Response.json(users.filter(user => user.level === 'public')))
      .delete('/user/:id', ({ params: { id } }) => {
        const foundIndex = users.findIndex(user => user.id === Number(id));
        if (foundIndex == -1) {
          return Response.json({ message: `${id} not found` }, { status: 404 });
        }
        const user = users[foundIndex];
        users.splice(foundIndex, 1);
        return Response.json({ message: `${user.name} deleted`, user });
      })
      .post('/user', async ({ request }, { authContext }) => {
        const priv = authContext.privileges.user?.find(v => v.method === 'post');
        if (priv === undefined) {
          return Response.json({ message: 'invalid request' }, { status: 401 })
        }
        const user = await request.json();
        if (priv.filter) {
          priv.filter(user);
        }
        user.id = Math.max(...users.map(user => user.id)) + 1;
        users.push(user);
        return Response.json({ message: `${user.name} added`, user });
      })
  )
  .apply();
```

#### Explanation

- Authentication & Privileges: The authenticate function checks the Authorization header and applies privileges based on the user's level.
- CRUD Operations: Various routes (GET, POST, DELETE) are defined to manage user data, respecting the user's privileges.
- Custom Schemes: This example uses the my-app protocol scheme, with custom routing logic for user management.
