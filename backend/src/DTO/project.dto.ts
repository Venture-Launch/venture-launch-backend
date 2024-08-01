export interface CreateProjectDto {
  projectLaunchId: string;
  projectLaunchName: string;
  projectLaunchDescription: string;
  projectLaunchRaisedFunds: number;
  milestoneNumber: number;
  users?: string[];
}

export interface UpdateProjectDto {
  projectLaunchName?: string;
  projectLaunchDescription?: string;
  projectLaunchRaisedFunds?: number;
  milestoneNumber?: number;
  isFinal?: boolean;
  users?: string[];
  dataAccountHash?: string;
}
