# Note-Taking App

## Overview

The Note-Taking App is a full-stack web application built with Ruby on Rails for the backend and React for the frontend.
It provides users with a simple yet powerful platform to create, edit, and organize their notes efficiently. The
application includes features such as categorizing notes with tags, a responsive design for optimal user experience on
various devices, and a robust search functionality for quick access to specific notes.

## Features

- **Create, Edit, and Delete Notes:** Users can easily create new notes, edit existing ones, and delete notes they no
  longer need.

- **Tagging System:** Organize notes with a flexible tagging system. Add and remove tags to categorize and filter notes
  effectively.

- **Search and Filter:** A powerful search bar enables users to search notes by title, content, or tags. Additionally, a
  filter system allows users to view notes based on specific categories.

- **Responsive Design:** The application is designed to provide a seamless experience on both desktop and mobile
  devices.

## Tech Stack

- **Backend:** Ruby on Rails
- **Frontend:** React
- **Database:** PostgreSQL (configurable in `database.yml`)
- **Authentication:** Devise gem for user authentication

## Getting Started

To run the application locally, follow these steps:

1. Clone the repository: `git clone https://github.com/suvadeepghoshal/note-taking-app.git`
2. Navigate to the project directory: `cd note-taking-app`
3. Install dependencies:
    - For Rails: `bundle install`
    - For React: `cd frontend && npm install`
4. Set up the database: `rails db:create && rails db:migrate`
5. Start the Rails server: `rails s`
6. In a separate terminal, start the React development server: `cd frontend && npm start`

The application will be accessible at `http://localhost:3000`. Make sure to configure the database credentials
in `config/database.yml` according to your setup.

## License

This project is licensed under the [MIT License](LICENSE).
