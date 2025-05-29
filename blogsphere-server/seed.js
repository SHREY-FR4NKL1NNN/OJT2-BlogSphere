const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Blog = require("./models/blog");
const User = require("./models/user");

dotenv.config();

const sampleBlogs = [
  {
    title: "Introduction to MERN Stack",
    content: "Master the MERN stack! MongoDB for databases, Express for backend, React for frontend, and Node.js for server-side logic. Together, they create a powerful framework for building modern web applications. Start with the basics and unlock endless possibilities for full-stack development.",
    tags: ["MERN", "Introduction", "Fullstack"],
    coverImage: "https://media.geeksforgeeks.org/wp-content/uploads/20231110115359/Roadmap-to-Mern-stack-developer-copy-(3).webp",
  },
  {
    title: "Setting Up MongoDB for MERN",
    content: "Set up MongoDB for your MERN project with ease. Learn how to install, configure, and connect MongoDB to your application. From local setup to cloud-based solutions, this guide ensures your database is ready to handle your app's data efficiently.",
    tags: ["MongoDB", "Database", "Setup"],
    coverImage: "https://sp-ao.shortpixel.ai/client/to_webp,q_lossy,ret_img,w_943,h_518/https://www.bocasay.com/wp-content/uploads/2020/03/MERN-stack-1.png",
  },
  {
    title: "Express.js Routing Deep Dive",
    content: "Routing is key in Express.js! Learn how to define routes, handle requests, and structure your backend for scalability. This guide simplifies routing concepts, helping you build a clean and maintainable server-side architecture.",
    tags: ["Express", "Backend", "Routing"],
    coverImage: "https://miro.medium.com/v2/resize:fit:1400/1*4KiclLCF0wgoLW4-0wIhJg.png",
  },
  {
    title: "React State Management",
    content: "State management is crucial in React. Discover various approaches like useState, Context API, and Redux. Learn when to use each method to keep your app organized and responsive, ensuring seamless user experiences.",
    tags: ["React", "State", "Frontend"],
    coverImage: "https://miro.medium.com/v2/resize:fit:1400/1*HeJahz1pxt_x0E14yF7QfQ.png",
  },
  {
    title: "Node.js Asynchronous Programming",
    content: "Simplify asynchronous programming in Node.js! Understand callbacks, promises, and async/await to handle operations like API calls and file handling. This guide demystifies these concepts, making your code cleaner and more efficient.",
    tags: ["Node.js", "Async", "JavaScript"],
    coverImage: "https://miro.medium.com/v2/resize:fit:654/1*ONf10JRNcp6aVQk6wDWjOg.png",
  },
  {
    title: "Building REST APIs with Express",
    content: "Build robust RESTful APIs with Express.js! Follow this step-by-step guide to design endpoints, handle HTTP methods, and connect to databases. Create scalable APIs that power your applications effortlessly.",
    tags: ["Express", "API", "REST"],
    coverImage: "https://miro.medium.com/v2/resize:fit:1024/0*xitKF1usDUcVTpPw.png",
  },
  {
    title: "Connecting React with Express",
    content: "Bridge the gap between frontend and backend! Learn how to connect your React app to an Express server using APIs. This guide covers fetching data, handling responses, and ensuring smooth communication.",
    tags: ["React", "Express", "Integration"],
    coverImage: "https://www.scaler.com/topics/images/project-structures.webp",
  },
  {
    title: "Authentication in MERN Apps",
    content: "Secure your app with JWT and bcrypt! Learn how to implement user authentication, encrypt passwords, and manage tokens. Protect sensitive data and ensure only authorized users access your application.",
    tags: ["Authentication", "JWT", "Security"],
    coverImage: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fmedium.com%2F%40ansari028amaan%2Fa-guide-to-mern-authentication-with-jwt-26b2f4077567&psig=AOvVaw2DaITtit9rqkjrbpPJEI8T&ust=1748609293979000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJi18LTbyI0DFQAAAAAdAAAAABAE",
  },
  {
    title: "Deploying MERN Apps",
    content: "Deploy your MERN app like a pro! Explore best practices for hosting, environment configuration, and scaling. Learn about platforms like Heroku, AWS, and Netlify to make your app production-ready.",
    tags: ["Deployment", "MERN", "Production"],
    coverImage: "https://genezio.com/deployment-platform/posts/merndeploy.webp",
  },
  {
    title: "Using Redux with React",
    content: "Tame complex state with Redux! Learn how to integrate Redux into your React app, manage global state, and simplify data flow. This guide makes Redux easy to understand and implement.",
    tags: ["Redux", "React", "State"],
    coverImage: "https://miro.medium.com/v2/resize:fit:1400/0*95tBOgxEPQAVq9YO.png",
  },
  {
    title: "File Uploads in MERN",
    content: "Enable file uploads in your MERN app! Learn how to upload files from React, process them in Express, and store them in MongoDB. This guide ensures seamless file handling for your application.",
    tags: ["File Upload", "MERN", "Express"],
    coverImage: "https://reactjsexample.com/content/images/2021/11/image-uploader.jpg",
  },
  {
    title: "Error Handling in Express",
    content: "Error handling is vital! Learn how to catch and manage errors in Express.js using middleware. This guide ensures your app remains stable and user-friendly, even when issues arise.",
    tags: ["Express", "Error Handling", "Backend"],
    coverImage: "https://miro.medium.com/v2/resize:fit:702/1*6IB_IFTLFtYPqarWIEV_3g.png",
  },
  {
    title: "React Hooks Overview",
    content: "React Hooks simplify state and lifecycle management. Learn about useState, useEffect, and custom hooks to write cleaner, functional components. This guide is perfect for modern React development.",
    tags: ["React", "Hooks", "Frontend"],
    coverImage: "https://lh7-us.googleusercontent.com/waKzZsshW4iXcfmg_jSjJi9FYWMufvpO-T2sT0inP79tSyJioooprXAYJzulCGF6fE13plSlnx_EY_gDKYz-in0kG43XxbuYHaH9aAQwcZ8zHyJNVn1KWDh2UUavYTM-Bh50SHCHTqb6CsfD6l-fdq4",
  },
  {
    title: "Securing Node.js Applications",
    content: "Protect your Node.js backend! Learn techniques like input validation, rate limiting, and secure headers. This guide ensures your server is resilient against common vulnerabilities.",
    tags: ["Node.js", "Security", "Backend"],
    coverImage: "https://www.simform.com/wp-content/uploads/2021/05/Preview-Nodejs-Security-1.png",
  },
  {
    title: "Testing MERN Applications",
    content: "Testing ensures reliability! Explore tools like Jest, Mocha, and Postman to test your MERN stack apps. Learn strategies for unit, integration, and end-to-end testing to deliver bug-free applications.",
    tags: ["Testing", "MERN", "Jest"],
    coverImage: "https://miro.medium.com/v2/resize:fit:1400/0*JMufV6ECkB_mOCDW.jpeg",
  },
  {
    title: "Pagination in MongoDB",
    content: "Handle large datasets with pagination! Learn how to implement efficient pagination in MongoDB using skip and limit. This guide ensures smooth data retrieval without overloading your app.",
    tags: ["MongoDB", "Pagination", "Database"],
    coverImage: "https://miro.medium.com/v2/resize:fit:1400/0*tdnpyjeaaq36eZGf.png",
  },
  {
    title: "Optimizing React Performance",
    content: "Boost your React app's performance! Learn tips like code splitting, memoization, and lazy loading. This guide helps you optimize rendering and improve user experience.",
    tags: ["React", "Performance", "Optimization"],
    coverImage: "https://www.neosofttech.com/wp-content/uploads/2023/11/Optimize-Performance-For-ReactJS-Applications.jpg",
  },
  {
    title: "Environment Variables in Node.js",
    content: "Keep your app secure and flexible! Learn how to use environment variables for managing sensitive data like API keys and database URLs. This guide ensures better configuration management.",
    tags: ["Node.js", "Environment", "Config"],
    coverImage: "https://deadsimplechat.com/blog/content/images/2024/09/image-11.png",
  },
  {
    title: "Building a Blog with MERN",
    content: "Build a blog platform with MERN! Learn how to create posts, manage users, and implement CRUD operations. This guide takes you through the entire process step-by-step.",
    tags: ["MERN", "Blog", "Project"],
    coverImage: "https://user-images.githubusercontent.com/67452985/172217368-76264e6e-8373-484d-9cd0-3af5920754b1.png",
  },
  {
    title: "Integrating Third-Party APIs",
    content: "Integrate third-party APIs seamlessly! Learn how to fetch data, handle authentication, and display results in your MERN app. This guide opens up endless possibilities for your projects.",
    tags: ["API", "Integration", "MERN"],
    coverImage: "https://multisite.talent500.co/talent500-blog/wp-content/uploads/sites/42/2023/09/images-2-2023-09-07T164631.898-1.jpeg",
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    let user = await User.findOne();
    if (!user) {
      user = await User.create({
        username: "seeduser",
        email: "seeduser@example.com",
        password: "password123",
      });
    }

    await Blog.deleteMany({});
    for (const blog of sampleBlogs) {
      await Blog.create({
        ...blog,
        author: user._id,
      });
    }

    console.log("Seed data inserted successfully!");
    process.exit();
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seed();