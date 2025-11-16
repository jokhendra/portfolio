declare module '@calcom/embed-react' {
  export function getCalApi(options?: any): Promise<
    (action: string, opts?: any) => void
  >;
}


