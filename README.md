<h3>Public Transportation System</h3>


This project is a public transportation system built using Node.js with TypeScript and Express.js to handle API requests. It also uses PostgreSQL as a database and is containerized with Docker.

Getting Started
To get started with this project, follow these steps:

- Clone the repository to your local machine.

- Install Docker on your machine if it's not already installed.

- Open a terminal and navigate to the project directory.

- Run the following command to build and start the Docker container:

- `docker-compose up --build -d`

This will build and start the container in detached mode.

Once the container is running, you can make requests to the API by sending HTTP requests to http://localhost:4000.

You can have access to pgAdmin4 for manage the database through http://localhost:8080/login

The default email and password are admin@example.com and mysecretpassword

API Endpoints
The following API endpoints are available:

- POST /train-line: Create a subway line and add to the database.

- GET /stations: Returns a list of all stations.

- GET /route?origin=[origin]&destination=[destination]: Return shortest route from origin to destination.

- POST /card: Create a subway card or reload the balance of this card.

- POST /enter-station: Enters the station for the given card number.

- POST /exit-station: Exits the station for the given card number and deducts the fare from the card balance.

Technologies Used
This project uses the following technologies:

- Node.js

- TypeScript

- Express.js

- pgAdmin4

- PostgreSQL

- Redis

- Docker
