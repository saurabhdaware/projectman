export type ChoiceType = {
  title: string;
};

export type ProjectType = {
  name: string;
  path: string;
  editor?: string;
};

export type SettingsType = {
  commandToOpen: string;
  projects: ProjectType[];
};
