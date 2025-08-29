import type { Project, BlogPost } from "./types"

export const mockProjects: Project[] = [
  {
    id: "1",
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce solution with React, Node.js, and PostgreSQL",
    longDescription:
      "A comprehensive e-commerce platform built with modern web technologies. Features include user authentication, product catalog, shopping cart, payment processing with Stripe, order management, and admin dashboard. The frontend is built with React and TypeScript, while the backend uses Node.js with Express and PostgreSQL database.",
    image: "/placeholder.svg?height=300&width=500",
    technologies: ["React", "Node.js", "PostgreSQL", "Stripe", "TypeScript"],
    demoUrl: "https://demo.example.com",
    githubUrl: "https://github.com/username/ecommerce",
    featured: true,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "2",
    title: "Task Management App",
    description: "A collaborative task management application with real-time updates",
    longDescription:
      "A modern task management application that enables teams to collaborate effectively. Built with Next.js and Socket.io for real-time updates, featuring drag-and-drop task boards, user assignments, due dates, file attachments, and team chat functionality.",
    image: "/placeholder.svg?height=300&width=500",
    technologies: ["Next.js", "Socket.io", "MongoDB", "Tailwind CSS"],
    demoUrl: "https://tasks.example.com",
    githubUrl: "https://github.com/username/taskapp",
    featured: true,
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-02-01T00:00:00Z",
  },
  {
    id: "3",
    title: "Weather Dashboard",
    description: "Real-time weather monitoring with interactive maps and forecasts",
    longDescription:
      "A comprehensive weather dashboard that provides real-time weather data, interactive maps, and detailed forecasts. Built with React and integrated with multiple weather APIs for accurate data visualization.",
    image: "/placeholder.svg?height=300&width=500",
    technologies: ["React", "D3.js", "Weather API", "Mapbox"],
    demoUrl: "https://weather.example.com",
    githubUrl: "https://github.com/username/weather",
    featured: false,
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2024-03-01T00:00:00Z",
  },
]

export const mockBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Building Scalable React Applications",
    excerpt: "Learn the best practices for building large-scale React applications that can grow with your team.",
    content: `# Building Scalable React Applications

Building scalable React applications requires careful planning and adherence to best practices. In this comprehensive guide, we'll explore the key principles and patterns that will help you create maintainable and performant React applications.

## Component Architecture

The foundation of any scalable React application is a well-thought-out component architecture. Here are the key principles:

### 1. Single Responsibility Principle
Each component should have a single, well-defined responsibility. This makes components easier to test, debug, and reuse.

### 2. Composition over Inheritance
React favors composition over inheritance. Build complex UIs by composing smaller, focused components.

### 3. Container and Presentational Components
Separate your components into containers (logic) and presentational (UI) components for better separation of concerns.

## State Management

As your application grows, managing state becomes increasingly important:

- **Local State**: Use useState for component-specific state
- **Global State**: Consider Redux, Zustand, or Context API for shared state
- **Server State**: Use libraries like React Query or SWR for server data

## Performance Optimization

- Use React.memo for expensive components
- Implement code splitting with React.lazy
- Optimize bundle size with tree shaking
- Use proper key props in lists

## Testing Strategy

A comprehensive testing strategy includes:
- Unit tests for individual components
- Integration tests for component interactions
- End-to-end tests for critical user flows

## Conclusion

Building scalable React applications is an ongoing process that requires continuous learning and adaptation. By following these principles and staying updated with the latest React patterns, you'll be well-equipped to build applications that can grow with your needs.`,
    image: "/placeholder.svg?height=300&width=500",
    tags: ["React", "JavaScript", "Architecture", "Best Practices"],
    slug: "building-scalable-react-applications",
    featured: true,
    publishedAt: "2024-01-10T00:00:00Z",
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-01-10T00:00:00Z",
    readTime: 8,
  },
  {
    id: "2",
    title: "The Future of Web Development",
    excerpt: "Exploring emerging trends and technologies that will shape the future of web development.",
    content: `# The Future of Web Development

The web development landscape is constantly evolving, with new technologies and paradigms emerging regularly. Let's explore the trends that are shaping the future of web development.

## Server-Side Rendering Renaissance

Server-side rendering (SSR) is making a comeback with frameworks like Next.js, Nuxt.js, and SvelteKit leading the charge. The benefits include:

- Improved SEO and social media sharing
- Faster initial page loads
- Better performance on slower devices
- Enhanced user experience

## Edge Computing

Edge computing is revolutionizing how we think about web applications:

- **Reduced Latency**: Processing closer to users
- **Better Performance**: Faster response times
- **Global Scale**: Distributed computing resources
- **Cost Efficiency**: Optimized resource usage

## WebAssembly (WASM)

WebAssembly is opening new possibilities for web applications:

- High-performance applications in the browser
- Language diversity beyond JavaScript
- Complex computations and graphics
- Gaming and multimedia applications

## AI Integration

Artificial Intelligence is becoming integral to web development:

- **Automated Testing**: AI-powered test generation
- **Code Assistance**: Intelligent code completion
- **User Experience**: Personalized content and interfaces
- **Performance Optimization**: Automated optimization suggestions

## Progressive Web Apps (PWAs)

PWAs continue to bridge the gap between web and native applications:

- Offline functionality
- Push notifications
- App-like experience
- Cross-platform compatibility

## Conclusion

The future of web development is exciting, with technologies that promise to make web applications more powerful, efficient, and user-friendly. Staying updated with these trends will be crucial for developers looking to build the next generation of web applications.`,
    image: "/placeholder.svg?height=300&width=500",
    tags: ["Web Development", "Technology", "Future", "Trends"],
    slug: "future-of-web-development",
    featured: true,
    publishedAt: "2024-02-15T00:00:00Z",
    createdAt: "2024-02-15T00:00:00Z",
    updatedAt: "2024-02-15T00:00:00Z",
    readTime: 6,
  },
  {
    id: "3",
    title: "Mastering TypeScript in 2024",
    excerpt: "A comprehensive guide to advanced TypeScript features and best practices.",
    content: `# Mastering TypeScript in 2024

TypeScript has become an essential tool for modern web development. This guide covers advanced features and best practices for TypeScript in 2024.

## Advanced Type System

TypeScript's type system is incredibly powerful. Let's explore some advanced features:

### Conditional Types
\`\`\`typescript
type ApiResponse<T> = T extends string ? string : T extends number ? number : never;
\`\`\`

### Mapped Types
\`\`\`typescript
type Partial<T> = {
  [P in keyof T]?: T[P];
};
\`\`\`

### Template Literal Types
\`\`\`typescript
type EventName<T extends string> = \`on\${Capitalize<T>}\`;
\`\`\`

## Best Practices

1. **Use strict mode**: Enable all strict type checking options
2. **Prefer interfaces over types**: For object shapes, use interfaces
3. **Use utility types**: Leverage built-in utility types like Partial, Pick, Omit
4. **Type guards**: Implement proper type guards for runtime type checking

## Performance Tips

- Use type assertions sparingly
- Prefer const assertions for immutable data
- Use module augmentation for extending third-party types
- Implement proper error handling with Result types

## Conclusion

TypeScript continues to evolve, offering developers powerful tools for building robust applications. By mastering these advanced features, you'll be able to write more maintainable and type-safe code.`,
    image: "/placeholder.svg?height=300&width=500",
    tags: ["TypeScript", "Programming", "JavaScript", "Development"],
    slug: "mastering-typescript-2024",
    featured: false,
    publishedAt: "2024-03-01T00:00:00Z",
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2024-03-01T00:00:00Z",
    readTime: 10,
  },
]
