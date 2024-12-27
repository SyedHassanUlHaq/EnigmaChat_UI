# EnigmaChat

## PostgreSQL Setup Guide

### 1. Install PostgreSQL
Follow the steps below to install PostgreSQL based on your operating system:

- **Windows**: Download and install PostgreSQL from [PostgreSQL Downloads](https://www.postgresql.org/download/windows/).
- **macOS**: Run the following command in your terminal:
  ```bash
  brew install postgresql
  ```
- **Linux**: Use your package manager to install PostgreSQL:
  ```bash
  sudo apt install postgresql postgresql-contrib
  ```

### 2. Create the Database
Once PostgreSQL is installed, create a new database for EnigmaChat:

1. Open the terminal or command prompt.
2. Run the following command to create the database:
   ```bash
   createdb enigmachat
   ```

Alternatively, you can use the PostgreSQL interactive terminal (`psql`):
```bash
psql -U postgres
CREATE DATABASE enigmachat;
\q
```

### 3. Apply the Database Schema
If you have a database schema file (e.g., `schema.sql`), you can apply it to the database:
```bash
psql -U postgres -d enigmachat -f schema.sql
```

### 4. Connect to the Database in Your Application
Ensure your application can connect to the PostgreSQL database by configuring the connection settings. Update the `DATABASE_URL` or equivalent in your application configuration:

```env
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/enigmachat
```

Replace `<username>`, `<password>`, `<host>`, and `<port>` with your PostgreSQL credentials and server details.

### 5. Setting Up PostgreSQL in VS Code
To work with PostgreSQL in Visual Studio Code, follow these steps:

1. Install the "PostgreSQL" extension from the VS Code marketplace.
2. Open the PostgreSQL extension by clicking on its icon in the activity bar.
3. Add a new connection by providing the connection details:
   - **Host**: `localhost` (or your server address)
   - **Port**: `5432` (default PostgreSQL port)
   - **Username**: `postgres` (or your username)
   - **Password**: Your PostgreSQL password
   - **Database**: `enigmachat`
4. Once connected, you can browse tables, run queries, and manage the database directly from VS Code.

### 6. Running PostgreSQL Scripts
To execute SQL scripts such as `seed.sql`:
```bash
psql -U postgres -d enigmachat -f seed.sql
```

This will populate your database with initial data.

### 7. Backup and Restore the Database

**Backup the Database:**
```bash
pg_dump -U postgres -d enigmachat > backup.sql
```

**Restore the Database:**
```bash
psql -U postgres -d enigmachat -f backup.sql
```

### 8. Additional Resources
- [PostgreSQL Official Documentation](https://www.postgresql.org/docs/)
- [VS Code PostgreSQL Extension](https://marketplace.visualstudio.com/items?itemName=ckolkman.vscode-postgres)

With this guide, you can set up and manage the PostgreSQL database for EnigmaChat seamlessly. Let me know if further clarification is needed!

