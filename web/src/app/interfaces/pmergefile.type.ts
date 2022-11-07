export interface PMergeFile {
  readonly name: string;
  readonly is_dir: boolean;
  readonly path: string;
  is_open?: boolean;
  children?: PMergeFile[];
  readonly readonly?: boolean;
}