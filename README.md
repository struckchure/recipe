# Recipe

Welcome to the **Recipe** repository! This is a collection of various demo projects that I have created to showcase different technologies, programming languages, and techniques. Each project is designed to be a self-contained example, providing insights into how to implement certain features or solve specific problems.

## Table of Contents

- [Projects](#projects)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [License](#license)

## Projects

Here are some of the projects you'll find in this repository:

1. **Blog Microservices**

   Two microservices built in Go to demonstrate inter-service communication, scalability, and maintainability.

   - [Auth Microservice](./golang/blog-with-microservice/auth)
   - [Post Microservice](./golang/blog-with-microservice/posts)

2. **Blog Gateway Service**

   A gateway service built in Go that aggregates the responses from the microservices and exposes a unified API.

   - [Blog Gateway Service](./golang/blog-with-microservice/gateway)

3. **NestJS Gateway Service**
   The same gateway API implemented using NestJS to showcase the differences and advantages of using a Node.js framework for building APIs.
   - [NestJS Blog Gateway Service](./typescript/blog-gateway)

## Getting Started

To get started with any of the projects in this repository:

1. Clone the repository:

   ```sh
   git clone https://github.com/struckchure/recipe.git
   ```

2. Navigate to the project directory you are interested in:

   ```sh
   cd recipe/project-name
   ```

3. Follow the specific instructions in the project's README file to set up and run the project.

## Contributing

Contributions are welcome! If you have a demo project you would like to add or improvements to existing projects, feel free to fork the repository and submit a pull request.

1. Fork the repository.
2. Create a new branch:
   ```sh
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```sh
   git commit -m 'Add some feature'
   ```
4. Push to the branch:
   ```sh
   git push origin feature/your-feature-name
   ```
5. Open a pull request.

## License

This repository is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

---

Happy coding!
