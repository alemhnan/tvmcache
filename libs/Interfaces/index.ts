export interface Cast {
  readonly id: number;
  readonly name: string;
  readonly birthday: string | null;
}

export interface ApiCast {
  readonly person: Cast;
}

export interface Show {
  readonly id: number;
  readonly name: string;
  readonly cast: Cast[];
}
