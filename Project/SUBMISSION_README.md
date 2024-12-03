## Multi-Container Docker Application with CI/CD: Calculator App Project

#### Complete Project Instructions: [DevOps Foundations Course/Project](https://github.com/shiftkey-labs/DevOps-Foundations-Course/tree/master/Project)

#### Submission by - **<Ye> <Wang>**

### Project Overview

- **Brief project description:** What is the purpose of your application?

This application is a multi-container calculator app designed to demonstrate the integration of Docker and CI/CD pipelines. It consists of a React-based frontend for user interaction and a Python Flask API backend for performing mathematical operations. The application allows users to perform basic and advanced calculations, such as addition, subtraction, multiplication, division, logarithms, and square roots.

- **Which files are you implmenting? and why?:**

Backend Dockerfile: To containerize the Python Flask backend and ensure consistent API functionality across environments.
Frontend Dockerfile: To containerize the React frontend, enabling the deployment of the web interface.
docker-compose.yml: To orchestrate the multi-container setup, manage dependencies, and establish communication between the frontend and backend.
CI/CD YAML files: To automate building, testing, and deploying the application, ensuring reliability and efficiency.

- _**Any other explanations for personal note taking.**_

This project emphasizes hands-on experience with Docker, Docker Compose, and CI/CD, focusing on creating a scalable, automated workflow.

### Docker Implementation

**Explain your Dockerfiles:**

- **Backend Dockerfile** (Python API):
  - Here please explain the `Dockerfile` created for the Python Backend API.
  - This can be a simple explanation which serves as a reference guide, or revision to you when read back the readme in future.

Base Image: Uses python:3.9-slim for a lightweight Python environment.
Working Directory: Sets /app as the working directory.
Dependencies: Installs required Python packages from requirements.txt.

- **Frontend Dockerfile** (React App):
  - Similar to the above section, please explain the Dockerfile created for the React Frontend Web Application.

Base Image: Uses node:14-alpine for lightweight Node.js support.
Working Directory: Sets /app as the working directory.
Dependencies: Installs frontend dependencies from package.json.
Development Server: Starts the React development server using npm start.
Port Exposure: Exposes port 3000 for the React application.

**Use this section to document your choices and steps for building the Docker images.**

### Docker Compose YAML Configuration

**Break down your `docker-compose.yml` file:**

- **Services:** List the services defined. What do they represent?
- **Networking:** How do the services communicate with each other?
- **Volumes:** Did you use any volume mounts for persistent data?
- **Environment Variables:** Did you define any environment variables for configuration?

**Use this section to explain how your services interact and are configured within `docker-compose.yml`.**

Services:
Frontend: Serves the React application.
Backend: Hosts the Flask API.
Networking:
Docker Compose establishes an internal network that allows the frontend and backend to communicate without exposing internal ports.
Environment Variables:
Used for service-specific configurations, such as API endpoints.
Volumes:
Not used in this project but could be added for persistent data or live code reloading in development.

### CI/CD Pipeline (YAML Configuration)

**Explain your CI/CD pipeline:**

- What triggers the pipeline (e.g., push to main branch)?
- What are the different stages (build, test, deploy)?
- How are Docker images built and pushed to a registry (if applicable)?

**Use this section to document your automated build and deployment process.**

Triggers:
The pipeline triggers on pushes to the main branch or pull requests.
Stages:
Build: Builds Docker images for the frontend and backend.
Test: Runs tests to verify code functionality.
Deploy (optional): Deploys the images to Docker Hub or a cloud provider.
Docker Image Push:
Builds and pushes images to Docker Hub on successful completion of the pipeline.

### Assumptions

- List any assumptions you made while creating the Dockerfiles, `docker-compose.yml`, or CI/CD pipeline.

The backend runs on port 5000 and the frontend on port 3000 within the container.
Both frontend and backend images are built locally before deploying.
Docker Hub credentials are securely stored for CI/CD access.
The API endpoint is hardcoded as http://localhost:5000 for simplicity.

### Lessons Learned

- What challenges did you encounter while working with Docker and CI/CD?
- What did you learn about containerization and automation?

**Use this section to reflect on your experience and learnings when implementing this project.**

Challenges:
Debugging Docker networking issues between containers.
Resolving React warnings about deprecated dependencies.
Ensuring CI/CD YAML syntax correctness.
Ensuring CI/CD YAML syntax correctness.
Learnings:
Improved understanding of multi-container orchestration with Docker Compose.
Gained hands-on experience with setting up automated pipelines using GitLab CI/CD and GitHub Actions.
Learned how to optimize Dockerfiles for smaller image sizes.

### Future Improvements

- How could you improve your Dockerfiles, `docker-compose.yml`, or CI/CD pipeline?
- (Optional-Just for personal reflection) Are there any additional functionalities you would like to consider for the calculator application to crate more stages in the CI/CD pipeline or add additional configuration in the Dockerfiles?

**Use this section to brainstorm ways to enhance your project.**

Docker:
Implement volume mounting for dynamic code reloading in development.
CI/CD:
Add automated deployment to a cloud platform like AWS or Azure.
Include end-to-end testing as a pipeline stage.
Frontend:
Enhance error handling for API calls.
Add caching mechanisms to improve performance.
Backend:
Introduce logging and monitoring for better debugging.
Implement additional advanced mathematical operations.
