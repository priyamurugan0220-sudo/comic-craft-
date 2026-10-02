export interface ComicPanel {
  panel_number: number;
  title: string;
  scene_description: string;
  narration?: string;
  caption: string;
  dialogue: string;
  sound_effect: string;
  image_prompt: string;
  image_url: string;
}

export interface ComicMetadata {
  story_prompt: string;
  character_name: string;
  setting: string;
  tone: string;
  art_style: string;
  panels_count?: number;
  created_at?: string;
}

export interface ComicStory {
  status: string;
  metadata: ComicMetadata;
  layout: ComicPanel[];
  pdf_path?: string;
}

export interface PythonBackendFile {
  name: string;
  path: string;
  description: string;
  code: string;
}
