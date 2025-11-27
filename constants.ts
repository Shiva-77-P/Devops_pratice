import { CourseModule, ModuleCategory } from './types';

export const COURSES: CourseModule[] = [
  {
    id: 'k8s-101',
    category: ModuleCategory.KUBERNETES,
    title: 'Kubernetes for Beginners',
    description: 'Master the basics of orchestration, pods, and deployments.',
    icon: 'ship',
    labs: [
      {
        id: 'k8s-lab-1',
        title: 'Your First Pod',
        difficulty: 'Beginner',
        description: 'Learn how to create and run a simple Nginx pod using kubectl imperative commands.',
        tasks: [
          'Check the version of kubectl',
          'Run an nginx pod named "my-web-server"',
          'Verify the pod is running'
        ],
        initialSystemPrompt: `You are a simulated Linux terminal with a Kubernetes cluster configured (minikube).
        The user is a student. 
        - If they run 'kubectl get pods', show an empty list initially unless they created something.
        - Support 'kubectl run', 'kubectl create', 'kubectl get', 'kubectl describe', 'kubectl delete'.
        - Behave exactly like a terminal. Do not explain your output unless it is an error message standard to the tool.
        - Current state: Empty default namespace.`,
        verificationPrompt: `Analyze the user's terminal history. Did they successfully run a pod named 'my-web-server' using the image 'nginx'? 
        If yes, return JSON { "success": true, "message": "Great job! Pod is running." }.
        If no, return JSON { "success": false, "message": "Missing pod or incorrect name/image." }`
      },
      {
        id: 'k8s-lab-2',
        title: 'Scaling Deployments',
        difficulty: 'Intermediate',
        description: 'Create a deployment and scale it up to handle more traffic.',
        tasks: [
          'Create a deployment named "webapp" using image "httpd"',
          'Scale the deployment to 3 replicas',
          'Verify all 3 replicas are running'
        ],
        initialSystemPrompt: `You are a simulated K8s terminal.
        - Allow 'kubectl create deployment'.
        - Allow 'kubectl scale'.
        - maintain state of deployments and replicasets.`,
        verificationPrompt: `Did the user create a deployment 'webapp' and scale it to 3 replicas? Return JSON result.`
      }
    ]
  },
  {
    id: 'docker-101',
    category: ModuleCategory.DOCKER,
    title: 'Docker Essentials',
    description: 'Learn to build, ship, and run containers.',
    icon: 'box',
    labs: [
      {
        id: 'docker-lab-1',
        title: 'Running Containers',
        difficulty: 'Beginner',
        description: 'Pull an image and run a container in detached mode.',
        tasks: [
          'Run a redis container named "cache" in background (detached) mode',
          'List running containers to verify'
        ],
        initialSystemPrompt: `You are a simulated Linux terminal with Docker installed.
        - Support 'docker run', 'docker ps', 'docker images'.
        - Simulate image pulling text if they run a container for the first time.`,
        verificationPrompt: `Did the user run a redis container named 'cache' with -d or --detach? Return JSON.`
      }
    ]
  },
  {
    id: 'linux-101',
    category: ModuleCategory.LINUX,
    title: 'Linux CLI Mastery',
    description: 'Navigate the file system and manage permissions like a pro.',
    icon: 'terminal',
    labs: [
      {
        id: 'linux-lab-1',
        title: 'File Manipulation',
        difficulty: 'Beginner',
        description: 'Create directories, files, and move them around.',
        tasks: [
          'Create a directory named "project"',
          'Create a file "script.sh" inside "project"',
          'Make "script.sh" executable'
        ],
        initialSystemPrompt: `You are a standard Ubuntu Linux terminal.
        - Start in /home/user.
        - Support standard filesystem commands (ls, cd, mkdir, touch, chmod, mv, cp).
        - Maintain virtual filesystem state.`,
        verificationPrompt: `Did the user create /home/user/project/script.sh and run chmod +x (or 755/777) on it? Return JSON.`
      }
    ]
  }
];
