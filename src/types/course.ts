
export interface CourseUploadData {
  title: string;
  description: string;
  imageUrl: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  modules: {
    title: string;
    content: string;
  }[];
  price: string; // Price in APE tokens
}
