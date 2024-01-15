# Contributing to CampusBuddy

Welcome to CampusBuddy! We're thrilled that you're interested in contributing to our project. Please follow these comprehensive guidelines to set up your local development environment and contribute effectively.

## Setting Up Locally

### 1. Fork and then clone the Repository

```bash
git clone https://github.com/your-username/campusbuddy.git
cd campusBuddy
```

### 2. Install Dependencies

Ensure you have Node.js and yarn installed consider using yarn as to avoid lockfile conflicts:

````bash
, then install project dependencies:

```bash
yarn
````

### 3. Environment Variables

Create a local environment file and copy all the variables from `.env.example` to `.env` and fill in the necessary variables. Below is an example with guidance for each variable:

```env
DATABASE_URL=your_database_url  # Use PlanetScale or MySQL
NEXTAUTH_SECRET=your_nextauth_secret # Generate a secret using `openssl rand -base64 32`

GOOGLE_CLIENT_ID=your_google_client_id # Obtain from Google Cloud Console for OAuth
GOOGLE_CLIENT_SECRET=your_google_client_secret  # Obtain from Google Cloud Console for OAuth

GITHUB_CLIENT_ID=your_github_client_id  # Obtain from GitHub Developer Settings for OAuth
GITHUB_CLIENT_SECRET=your_github_client_secret # Obtain from GitHub Developer Settings for OAuth

UPLOADTHING_SECRET=your_uploadthing_secret #
UPLOADTHING_APP_ID=your_uploadthing_app_id # Obtain from UploadThing dashboard for image uploads (https://uploadthing.com/) or visit github repo (https://github.com/pingdotgg/uploadthing)
REDIS_URL=your_redis_url  # Use Upstash or other Redis provider or directly setup redis locally (https://redis.io/topics/quickstart)
REDIS_SECRET=your_redis_secret # Obtain from upstash dashboard
```

#### Database Setup:

- **PlanetScale:**

  - Sign up for PlanetScale (https://planetscale.com/).
  - Create a database and obtain the connection URL.
  - Set `DATABASE_URL` to the obtained URL.

- **MySQL:**
  - Set up a MySQL database and obtain the connection URL.
  - Set `DATABASE_URL` to the obtained URL.

#### Redis Setup:

- **Upstash:**
  - Sign up for Upstash (https://upstash.com/).
  - Create a Redis database and obtain the connection URL.
  - Set `REDIS_URL` to the obtained URL.

### 4. Prisma Setup

Ensure you have the Prisma CLI installed:

```bash
npm install -g prisma
```

Run the following commands to set up your database:

```bash
npx prisma db push
```

Make any necessary schema changes on the `dev` branch:

```bash
npx prisma db push
```

### 5. Local Development

Start the development server:

```bash
yarn run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Contributing Guidelines

### Making Changes

1. Create a new branch for your feature or bug fix:

   ```bash
   git checkout -b feature/my-feature
   ```

2. Make your changes and ensure they adhere to the project's coding standards.

3. Commit your changes:

   ```bash
   git commit -m "feat: description of my feature"
   ```

4. Push your branch:

   ```bash
   git push origin feature/my-feature
   ```

### Pull Requests

1. Open a pull request (PR) against the `main` branch.

2. Provide a clear title and description of your changes in the PR.

3. Ensure that your changes have been tested locally and include relevant test cases.

4. Mention any related issues or PRs in your description.

## Additional Information

### PlanetScale CLI

If using PlanetScale, you can install the PlanetScale CLI locally:

```bash
npm install -g pscale
```

Connect to the `dev` branch of your database:

```bash
pscale connect dbname dev
```

This allows you to interact with your PlanetScale database directly.

### Upstash Redis Setup

If using Upstash, ensure your `REDIS_URL` is correctly configured. You can obtain the URL from the Upstash dashboard.

Thank you for contributing to CampusBuddy ! 🚀🔗
