export enum ModuleCategory {
  KUBERNETES = 'Kubernetes',
  DOCKER = 'Docker',
  LINUX = 'Linux',
  CICD = 'CI/CD',
  TERRAFORM = 'Terraform'
}

export interface Lab {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tasks: string[];
  initialSystemPrompt: string; // Instructions for the AI terminal to behave correctly
  verificationPrompt: string; // Instructions for the AI to verify success
}

export interface CourseModule {
  id: string;
  category: ModuleCategory;
  title: string;
  description: string;
  icon: string;
  labs: Lab[];
}

export interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'system';
  content: string;
}

export interface Message {
  role: 'user' | 'model';
  content: string;
}
